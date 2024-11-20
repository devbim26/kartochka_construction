import { AUTH_ACTIONS } from '../constants';
import { AuthSliceState } from './auth.slice';

type ActionType = (typeof AUTH_ACTIONS)[keyof typeof AUTH_ACTIONS];
type ActionFunction = (state: State, payload: boolean | string) => State;

interface Action {
	type: ActionType;
	payload: boolean | string;
}

export type State = {
	isAuth: boolean;
	user_id: string;
	invalid_code: boolean;
	existed_email: boolean;
	invalid_email: boolean;
	existed_username: boolean;
	invalid_data: boolean;
	user_role: string;
};

export const defaultState: AuthSliceState = {
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
		invalid_code: false,
		existed_email: false,
		invalid_email: false,
		existed_username: false,
		invalid_data: false,
		user_role: '',
	},
};

const actions = new Map<any, any>([
	[
		AUTH_ACTIONS.SET_INVALID_DATA,
		(state: State, payload: boolean) => {
			return { ...state, invalid_data: payload };
		},
	],
	[
		AUTH_ACTIONS.SET_USER_ID,
		(state: State, payload: string) => {
			return { ...state, user_id: payload };
		},
	],
	[
		AUTH_ACTIONS.SET_INVALID_CODE,
		(state: State, payload: boolean) => {
			return { ...state, invalid_code: payload };
		},
	],
	[
		AUTH_ACTIONS.SET_INVALID_EMAIL,
		(state: State, payload: boolean) => {
			return { ...state, invalid_email: payload };
		},
	],
	[
		AUTH_ACTIONS.SET_EXISTED_USERNAME,
		(state: State, payload: boolean) => {
			return { ...state, existed_username: payload };
		},
	],
	[
		AUTH_ACTIONS.SET_EXISTED_EMAIL,
		(state: State, payload: boolean) => {
			return { ...state, existed_email: payload };
		},
	],
	[
		AUTH_ACTIONS.LOGOUT,
		(state: State, payload: boolean) => {
			return { ...state, user_id: '', user_role: '' };
		},
	],
]);

export const authReducer = (state = defaultState, action: Action) => {
	if (actions.has(action.type)) {
		return actions.get(action.type)(state, action.payload);
	} else {
		return state;
	}
};
