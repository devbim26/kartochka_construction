import { accountSlice } from '@features/account/store';
import { authSlice } from '@features/auth/store';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
	authData: authSlice.reducer,
	userData: accountSlice.reducer,
});

export const store = configureStore({
	reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
