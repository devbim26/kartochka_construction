import { createAsyncCases, type SliceInitialState } from '@core/utils/fetch/create-cases.util';
import { createSlice } from '@reduxjs/toolkit';
import { getCurrentUser, logout, updateUser } from '../services';
import type { AccountData } from '../types';
import { accountReducer } from './account.reducer';

export type AccountDataState = AccountData;

export interface AccountSliceState extends SliceInitialState {
	data: AccountDataState | null;
}

const initialState: AccountSliceState = {
	fetch_data: {
		group: '',
		fetch_name: '',
	},
	loading: false,
	status: 0,
	error: null,
	data: null,
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
		createAsyncCases(builder, logout, (state: AccountSliceState, action) => {
			console.log(action.payload);
		});
	},
});
