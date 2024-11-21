import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authSlice } from '../../features/auth/store';

const rootReducer = combineReducers({
	authData: authSlice.reducer,
});

export const store = configureStore({
	reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
