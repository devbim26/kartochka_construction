import {
	ActionReducerMapBuilder,
	AsyncThunk,
	PayloadAction,
	SerializedError,
} from '@reduxjs/toolkit';

function createAsyncCases<T>(
	builder: ActionReducerMapBuilder<State>,
	asyncThunk: AsyncThunk<any, any, any>,
	onSuccess?: (state: State, action: PayloadAction<any>) => void,
	onError?: (state: State, action: PayloadAction<{ error: string } | SerializedError>) => void,
) {
	const handleSuccess = (state: State, action: PayloadAction<any>) => {
		state.fetch_data = action.payload.fetch_data;
		state.status = action.payload.status;
		if (action.payload.status === 200) {
			state.error = null;
			state.data = action.payload.data;
		} else {
			state.data = null;
			state.error = action.payload.data;
		}
		if (onSuccess) {
			onSuccess(state, action);
		}
	};

	const handleError = (
		state: State,
		action: PayloadAction<{ error: string } | SerializedError>,
	) => {
		state.fetch_data = {};
		state.error = action.payload || 'Unknown error';
		if (onError) {
			onError(state, action);
		}
	};

	builder
		.addCase(asyncThunk.pending, (state) => {
			state.loading = true;
		})
		.addCase(asyncThunk.fulfilled, handleSuccess)
		.addCase(asyncThunk.rejected, handleError);
}

export { createAsyncCases };
