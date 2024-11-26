import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchApi } from '../../../api-gen';
import { AUTH_FETCH_ROUTES } from '../constants';
import { convertToServerRegistrationData } from '../converters';
import { ApproveFormData, LoginFormData, RegistrationFormData } from '../types';

export const authLogin = createAsyncThunk(
	AUTH_FETCH_ROUTES.login.async_thunk_route,
	async (loginData: LoginFormData, thunkAPI) => {
		try {
			const response = await fetchApi.api.authLoginCreate(loginData);
			return {
				payload: response.data,
				fetch_data: {
					group: AUTH_FETCH_ROUTES.group,
					fetch_name: AUTH_FETCH_ROUTES.login.fetch_name,
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

export const authRegistration = createAsyncThunk(
	AUTH_FETCH_ROUTES.registration.async_thunk_route,
	async (registrationData: RegistrationFormData, thunkAPI) => {
		try {
			const data = convertToServerRegistrationData(registrationData);
			const response = await fetchApi.api.accountRegisterCreate(data);
			return {
				payload: response.data,
				fetch_data: {
					group: AUTH_FETCH_ROUTES.group,
					fetch_name: AUTH_FETCH_ROUTES.registration.fetch_name,
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

export const smsCodeRequest = createAsyncThunk(
	AUTH_FETCH_ROUTES.sms.async_thunk_route,
	async (phoneNumber: string, thunkAPI) => {
		try {
			const response = await fetchApi.api.postApi({ phoneNumber });
			return {
				payload: response.data,
				fetch_data: {
					group: AUTH_FETCH_ROUTES.group,
					fetch_name: AUTH_FETCH_ROUTES.sms.fetch_name,
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

export const smsCodeApprove = createAsyncThunk(
	AUTH_FETCH_ROUTES.smsApprove.async_thunk_route,
	async (data: ApproveFormData, thunkAPI) => {
		try {
			const response = await fetchApi.api.smsApproveCreate(data);
			return {
				payload: response.data,
				fetch_data: {
					group: AUTH_FETCH_ROUTES.group,
					fetch_name: AUTH_FETCH_ROUTES.smsApprove.fetch_name,
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

export const fileUpload = createAsyncThunk(
	AUTH_FETCH_ROUTES.fileUpload.async_thunk_route,
	async (
		request: {
			data: { mimeType: string | null; isPublic: boolean };
			file: string | ArrayBuffer;
		},
		thunkAPI,
	) => {
		try {
			const response = await fetchApi.api.fileCreate(request.data);
			const upload = await fetch(String(response.data), {
				method: 'PUT',
				body: request.file,
			});
			console.log(upload);
			return {
				payload: upload.body,
				fetch_data: {
					group: AUTH_FETCH_ROUTES.group,
					fetch_name: AUTH_FETCH_ROUTES.fileUpload.fetch_name,
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
	AUTH_FETCH_ROUTES.logout.async_thunk_route,
	async (_, thunkAPI) => {
		try {
			const response = await fetchApi.api.authLogoutCreate();
			return {
				payload: response.data,
				fetch_data: {
					group: AUTH_FETCH_ROUTES.group,
					fetch_name: AUTH_FETCH_ROUTES.fileUpload.fetch_name,
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
