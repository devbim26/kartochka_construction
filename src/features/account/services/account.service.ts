import { fetchApi } from '@api-gen';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ACCOUNT_FETCH_ROUTES } from '../constants';
import { AccountData } from '../types';

export const getCurrentUser = createAsyncThunk(
	ACCOUNT_FETCH_ROUTES.getCurrent.async_thunk_route,
	async (_, thunkAPI) => {
		try {
			const response = await fetchApi.api.accountCurrentList();
			return {
				payload: response.data,
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

export const updateUser = createAsyncThunk(
	ACCOUNT_FETCH_ROUTES.getCurrent.async_thunk_route,
	async (data: AccountData, thunkAPI) => {
		try {
			const response = await fetchApi.api.accountUpdateUpdate(data);
			return {
				payload: response.data,
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
