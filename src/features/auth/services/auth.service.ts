import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchApi } from '../../../api-gen';
import { AUTH_FETCH_ROUTES } from '../constants';
import { LoginFormData } from '../types';

export const authLogin = createAsyncThunk(
	AUTH_FETCH_ROUTES.login.url,
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
