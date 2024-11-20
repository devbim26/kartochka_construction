import { createSlice } from '@reduxjs/toolkit';
import { authReducer } from './auth.reducer';

export interface SliceInitialState {
	fetch_data: {
		group: string;
		fetch_name: string;
	} | null;
	loading: boolean;
	status: number;
	error: any;
	data: any;
}

export interface AuthSliceState extends SliceInitialState {
	data: {
		isAuth: boolean;
		user_id: string;
		invalid_code: boolean;
		existed_email: boolean;
		invalid_email: boolean;
		existed_username: boolean;
		invalid_data: boolean;
		user_role: string;
	};
}

export const authSlice = createSlice({
	name: 'responseData',
	initialState: {
		fetch_data: {
			group: '',
			fetch_name: '',
		},
		loading: false,
		status: 0,
		error: null,
		data: {
			isAuth: false,
			user_id: '',
			invalid_code: false,
			existed_email: false,
			invalid_email: false,
			existed_username: false,
			invalid_data: false,
			user_role: '',
		},
	} as AuthSliceState,
	reducers: {
		authReducer,
	},
	extraReducers: (builder) => {},
});
