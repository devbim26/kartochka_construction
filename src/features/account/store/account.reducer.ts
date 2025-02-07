import type { AUTH_ACTIONS } from '@features/auth';
import type { AccountSliceState } from './account.slice';

type ActionType = (typeof AUTH_ACTIONS)[keyof typeof AUTH_ACTIONS];
type PayloadType = boolean | string;

interface Action {
	type: ActionType;
	payload: PayloadType;
}

export const accountReducer = (state: AccountSliceState, action: Action): AccountSliceState => {
	return state;
};
