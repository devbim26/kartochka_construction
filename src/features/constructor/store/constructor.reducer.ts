import type { AccountSliceState } from '@features/account/store';
import type { AUTH_ACTIONS } from '@features/auth';
import type { ConstructorSliceState } from './constructor.slice';

type ActionType = (typeof AUTH_ACTIONS)[keyof typeof AUTH_ACTIONS];
type PayloadType = boolean | string;

interface Action {
	type: ActionType;
	payload: PayloadType;
}

export const constructorReducer = (
	state: ConstructorSliceState,
	action: Action,
): AccountSliceState => {
	return state;
};
