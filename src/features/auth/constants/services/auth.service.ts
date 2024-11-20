import { fetchApi } from '@api-gen';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginFormData } from '../../types';

export const authLogin = createAsyncThunk(
	'auth/login',
	async (loginData: LoginFormData, thunkAPI) => {
		try {
			const response = await fetchApi.api.authLoginCreate(loginData);
			return response.data;
		} catch (error) {
			if (error instanceof Error) {
				return thunkAPI.rejectWithValue({ error: error.message });
			}
			return thunkAPI.rejectWithValue({ error: 'Unknown error' });
		}
	},
);
