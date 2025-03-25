import { createAsyncCases, type SliceInitialState } from '@core/utils/fetch/create-cases.util';
import { getCurrentUser, logout, updateUser, type AccountData } from '@features/account';
import { createSlice } from '@reduxjs/toolkit';
import { constructorReducer } from './constructor.reducer';

export type ConstructorDataState = AccountData; //потом поменять тип

export interface ConstructorSliceState extends SliceInitialState {
	data: ConstructorDataState | null;
}

const initialState: ConstructorSliceState = {
	fetch_data: {
		group: '',
		fetch_name: '',
	},
	loading: false,
	status: 0,
	error: null,
	data: null,
};

export const constructorSlice = createSlice({
	name: 'responseData',
	initialState: initialState,
	reducers: {
		constructorReducer,
	},
	extraReducers: (builder) => {
		createAsyncCases(builder, getCurrentUser, (state: ConstructorSliceState, action) => {});
		createAsyncCases(builder, updateUser, (state: ConstructorSliceState, action) => {});
		createAsyncCases(builder, logout, (state: ConstructorSliceState, action) => {});
	},
});
