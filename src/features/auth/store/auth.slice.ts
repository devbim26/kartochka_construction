import { createSlice } from '@reduxjs/toolkit';
import { createAsyncCases, SliceInitialState } from '../../../core/utils/fetch/create-cases.util';
import {
	authLogin,
	authRegistration,
	fileUpload,
	logout,
	smsCodeApprove,
	smsCodeRequest,
} from '../services';
import { authReducer } from './auth.reducer';

export interface AuthSliceDataState {
	isAuth: boolean;
	user_id: string;
	invalid_code: boolean;
	existed_email: boolean;
	invalid_email: boolean;
	existed_username: boolean;
	invalid_data: boolean;
	user_role: string;
}

export interface AuthSliceState extends SliceInitialState {
	data: AuthSliceDataState;
}

const initialState: AuthSliceState = {
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
};

export const authSlice = createSlice({
	name: 'responseData',
	initialState: initialState,
	reducers: {
		authReducer,
	},
	extraReducers: (builder) => {
		createAsyncCases(builder, authLogin, (state: AuthSliceState, action) =>
			console.log(action.payload),
		);
		createAsyncCases(builder, smsCodeRequest, (state: AuthSliceState, action) => {
			console.log(action.payload);
		});
		createAsyncCases(builder, smsCodeApprove, (state: AuthSliceState, action) => {
			console.log(action.payload);
		});
		createAsyncCases(builder, authRegistration, (state: AuthSliceState, action) => {
			console.log(action.payload);
		});
		createAsyncCases(builder, fileUpload, (state: AuthSliceState, action) => {
			console.log(action.payload);
		});
		createAsyncCases(builder, logout, (state: AuthSliceState, action) => {
			console.log(action.payload);
		});
	},
});
