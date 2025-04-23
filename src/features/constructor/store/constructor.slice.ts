import { createAsyncCases, type SliceInitialState } from '@core/utils/fetch/create-cases.util';
import { getCurrentUser, logout, updateUser } from '@features/account/services';
import { createSlice } from '@reduxjs/toolkit';
import type { AboutBuildingData, CreateConstructionData } from '../types';
import { constructorReducer } from './constructor.reducer';

export type ConstructorDataState = AboutBuildingData;

export interface ConstructorSliceState extends SliceInitialState {
	data: ConstructorDataState | null;
	createConstructionData: CreateConstructionData | null;
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
	createConstructionData: null,
};

export const constructorSlice = createSlice({
	name: 'responseData',
	initialState: initialState,
	reducers: {
		setAboutBuilding: constructorReducer.setAboutBuilding,
		setCreateConstructionData: constructorReducer.setCreateConstructionData,
	},
	extraReducers: (builder) => {
		createAsyncCases(builder, getCurrentUser, (state: ConstructorSliceState, action) => {});
		createAsyncCases(builder, updateUser, (state: ConstructorSliceState, action) => {});
		createAsyncCases(builder, logout, (state: ConstructorSliceState, action) => {});
	},
});
