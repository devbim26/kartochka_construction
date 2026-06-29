import { fetchApi } from '@api-gen';
import type { AppDispatch } from '@core/store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ACCOUNT_FETCH_ROUTES } from '../constants';
import { convertToClientAccountData, convertToServerAccountData } from '../converters';
import type { AccountData } from '../types';
import { hasFilledCompanyRequisites } from '../utils/company-requisites.utils';

export const getCurrentUser = createAsyncThunk(
	ACCOUNT_FETCH_ROUTES.getCurrent.async_thunk_route,
	async (_, thunkAPI) => {
		try {
			const response = await fetchApi.api.accountCurrentList();
			return {
				status: response.status,
				data: convertToClientAccountData(response.data),
				fetch_data: {
					group: ACCOUNT_FETCH_ROUTES.group,
					fetch_name: ACCOUNT_FETCH_ROUTES.getCurrent.fetch_name,
				},
			};
		} catch (error) {
			if (error instanceof Error) {
				return thunkAPI.rejectWithValue({ error: error.message });
			}
			return thunkAPI.rejectWithValue({ error: 'Unknown error' });
		}
	},
);

export const ensureCompanyRequisitesFilled = async (dispatch: AppDispatch): Promise<boolean> => {
	try {
		const payload = await dispatch(getCurrentUser()).unwrap();
		if (payload?.status !== 200 || !payload.data) {
			return false;
		}
		return hasFilledCompanyRequisites(payload.data as AccountData);
	} catch {
		return false;
	}
};

export const updateUser = createAsyncThunk(
	ACCOUNT_FETCH_ROUTES.update.async_thunk_route,
	async (data: AccountData, thunkAPI) => {
		try {
			const response = await fetchApi.api.accountUpdateUpdate(
				convertToServerAccountData(data),
			);
			if (response.status === 200) {
				toast.success('Успешное редактирование данных о компании!');
			}
			return {
				payload: response.data,
				fetch_data: {
					group: ACCOUNT_FETCH_ROUTES.group,
					fetch_name: ACCOUNT_FETCH_ROUTES.update.fetch_name,
				},
			};
		} catch (error) {
			if (error instanceof Error) {
				return thunkAPI.rejectWithValue({ error: error.message });
			}
			return thunkAPI.rejectWithValue({ error: 'Unknown error' });
		}
	},
);

export const logout = createAsyncThunk(
	ACCOUNT_FETCH_ROUTES.logout.async_thunk_route,
	async (_, thunkAPI) => {
		try {
			const response = await fetchApi.api.authLogoutCreate();
			if (response.status === 200) {
				toast.success('Выход из аккаунта прошел успешно');
				sessionStorage.clear();
			}
			return {
				status: response.status,
				data: null,
				fetch_data: {
					group: ACCOUNT_FETCH_ROUTES.group,
					fetch_name: ACCOUNT_FETCH_ROUTES.logout.fetch_name,
				},
			};
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data);
				return thunkAPI.rejectWithValue({ error: error.message });
			}
			toast.error('Неизвестная ошибка');
			return thunkAPI.rejectWithValue({ error: 'Unknown error' });
		}
	},
);
