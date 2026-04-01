import type { RootState } from '../../store';

/** Сессия из Redux-логина или уже подгруженный профиль (например, после Google OAuth + getCurrentUser). */
export const selectIsUserLoggedIn = (state: RootState): boolean =>
	Boolean(state.authData.data?.isAuth) || Boolean(state.userData.data);
