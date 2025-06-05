import { type SliceInitialState } from '@core/utils/fetch/create-cases.util';
import { createSlice } from '@reduxjs/toolkit';

export interface ConstructorLoaderSliceState extends SliceInitialState {
	isLoading: boolean;
}

const initialState: ConstructorLoaderSliceState = {
	fetch_data: {
		group: '',
		fetch_name: '',
	},
	loading: false,
	status: 0,
	data: null,
	error: null,
	isLoading: false,
};

export const constructorLoaderSlice = createSlice({
	name: 'constructorLoader',
	initialState,
	reducers: {
		startLoading(state) {
			state.isLoading = true;
		},
		stopLoading(state) {
			state.isLoading = false;
		},
	},
});

export const { startLoading, stopLoading } = constructorLoaderSlice.actions;
export default constructorLoaderSlice.reducer;
