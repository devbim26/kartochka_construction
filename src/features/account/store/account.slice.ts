import { createAsyncCases, type SliceInitialState } from '@core/utils/fetch/create-cases.util';
import { createSlice } from '@reduxjs/toolkit';
import { getCurrentUser, updateUser } from '../services';
import { accountReducer } from './account.reducer';

export interface AccountDataState {
	isAuth: boolean;
	user_id: string;
	user_role: string;
}

export interface AccountSliceState extends SliceInitialState {
	data: AccountDataState;
}

const initialState: AccountSliceState = {
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
		user_role: '',
	},
};

export const accountSlice = createSlice({
	name: 'responseData',
	initialState: initialState,
	reducers: {
		accountReducer,
	},
	extraReducers: (builder) => {
		createAsyncCases(builder, getCurrentUser, (state: AccountSliceState, action) =>
			console.log(action.payload),
		);
		createAsyncCases(builder, updateUser, (state: AccountSliceState, action) =>
			console.log(action.payload),
		);
	},
});
