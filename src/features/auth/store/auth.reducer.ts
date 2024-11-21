import { AUTH_ACTIONS } from '../constants';
import { AuthSliceDataState, AuthSliceState } from './auth.slice';

type ActionType = (typeof AUTH_ACTIONS)[keyof typeof AUTH_ACTIONS];
type PayloadType = boolean | string;

interface Action {
	type: ActionType;
	payload: PayloadType;
}
type MapFnc = (data: AuthSliceDataState, payload: any) => AuthSliceDataState;

const actions = new Map<ActionType, MapFnc>([
	[
		AUTH_ACTIONS.SET_INVALID_DATA,
		(data: AuthSliceDataState, payload: boolean) => {
			return { ...data, invalid_data: payload };
		},
	],
	[
		AUTH_ACTIONS.SET_USER_ID,
		(data: AuthSliceDataState, payload: string) => {
			return { ...data, user_id: payload };
		},
	],
	[
		AUTH_ACTIONS.SET_INVALID_CODE,
		(data: AuthSliceDataState, payload: boolean) => {
			return { ...data, invalid_code: payload };
		},
	],
	[
		AUTH_ACTIONS.SET_INVALID_EMAIL,
		(data: AuthSliceDataState, payload: boolean) => {
			return { ...data, invalid_email: payload };
		},
	],
	[
		AUTH_ACTIONS.SET_EXISTED_USERNAME,
		(data: AuthSliceDataState, payload: boolean) => {
			return { ...data, existed_username: payload };
		},
	],
	[
		AUTH_ACTIONS.SET_EXISTED_EMAIL,
		(data: AuthSliceDataState, payload: boolean) => {
			return { ...data, existed_email: payload };
		},
	],
	[
		AUTH_ACTIONS.LOGOUT,
		(data: AuthSliceDataState, payload: boolean) => {
			return { ...data, user_id: '', user_role: '' };
		},
	],
]);

export const authReducer = (state: AuthSliceState, action: Action): AuthSliceState => {
	if (actions.has(action.type)) {
		return { ...state, data: actions.get(action.type)!(state.data, action.payload) };
	} else {
		return state;
	}
};
