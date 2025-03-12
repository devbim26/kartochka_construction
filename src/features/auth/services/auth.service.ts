import { fetchApi } from '@api-gen';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { AUTH_FETCH_ROUTES } from '../constants';
import { convertToServerRegistrationData } from '../converters';
import type { ApproveFormData, LoginFormData, RegistrationFormData } from '../types';

export const authLogin = createAsyncThunk(
	AUTH_FETCH_ROUTES.login.async_thunk_route,
	async (loginData: LoginFormData, thunkAPI) => {
		try {
			const response = await fetchApi.api.authLoginCreate(loginData);
			if (response.status === 200) {
				toast.success('Авторизация прошла успешно');
			}
			return {
				payload: response.data,
				fetch_data: {
					group: AUTH_FETCH_ROUTES.group,
					fetch_name: AUTH_FETCH_ROUTES.login.fetch_name,
				},
			};
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.message);
				return thunkAPI.rejectWithValue({ error: error.message });
			}
			toast.error('Неизвестная ошибка');
			return thunkAPI.rejectWithValue({ error: 'Unfnown error' });
		}
	},
);

export const authRegistration = createAsyncThunk(
	AUTH_FETCH_ROUTES.registration.async_thunk_route,
	async (registrationData: RegistrationFormData, thunkAPI) => {
		try {
			const data = convertToServerRegistrationData(registrationData);
			const response = await fetchApi.api.accountRegisterCreate(data);
			if (response.status === 200) {
				toast.success('Регистрация прошла успешно');
			}
			return {
				payload: response.data,
				fetch_data: {
					group: AUTH_FETCH_ROUTES.group,
					fetch_name: AUTH_FETCH_ROUTES.registration.fetch_name,
				},
			};
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.message);
				return thunkAPI.rejectWithValue({ error: error.message });
			}
			toast.error('Неизвестная ошибка');
			return thunkAPI.rejectWithValue({ error: 'Unfnown error' });
		}
	},
);

export const smsCodeRequest = createAsyncThunk(
	AUTH_FETCH_ROUTES.sms.async_thunk_route,
	async (phoneNumber: string, thunkAPI) => {
		try {
			const response = await fetchApi.api.postApi({ phoneNumber });
			if (response.status === 200) {
				toast.success('Код подтверждения был отправлен на ваш номер телефона');
			}
			return {
				payload: response.data,
				fetch_data: {
					group: AUTH_FETCH_ROUTES.group,
					fetch_name: AUTH_FETCH_ROUTES.sms.fetch_name,
				},
			};
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.message);
				return thunkAPI.rejectWithValue({ error: error.message });
			}
			toast.error('Неизвестная ошибка');
			return thunkAPI.rejectWithValue({ error: 'Unknown error' });
		}
	},
);

export const smsCodeApprove = createAsyncThunk(
	AUTH_FETCH_ROUTES.smsApprove.async_thunk_route,
	async (data: ApproveFormData, thunkAPI) => {
		try {
			const response = await fetchApi.api.smsApproveCreate(data);
			if (response.status === 200) {
				toast.success('Номер телефона успешно подтвержден');
			}
			return {
				payload: response.data,
				fetch_data: {
					group: AUTH_FETCH_ROUTES.group,
					fetch_name: AUTH_FETCH_ROUTES.smsApprove.fetch_name,
				},
			};
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.message);
				return thunkAPI.rejectWithValue({ error: error.message });
			}
			toast.error('Неизвестная ошибка');
			return thunkAPI.rejectWithValue({ error: 'Unknown error' });
		}
	},
);

export const logout = createAsyncThunk(
	AUTH_FETCH_ROUTES.logout.async_thunk_route,
	async (_, thunkAPI) => {
		try {
			const response = await fetchApi.api.authLogoutCreate();
			if (response.status === 200) {
				toast.success('Выход из аккаунта прошел успешно');
			}
			return {
				payload: response.data,
				fetch_data: {
					group: AUTH_FETCH_ROUTES.group,
					fetch_name: AUTH_FETCH_ROUTES.fileUpload.fetch_name,
				},
			};
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.message);
				return thunkAPI.rejectWithValue({ error: error.message });
			}
			toast.error('Неизвестная ошибка');
			return thunkAPI.rejectWithValue({ error: 'Unknown error' });
		}
	},
);
