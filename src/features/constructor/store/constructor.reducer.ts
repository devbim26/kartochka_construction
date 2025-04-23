import type { AUTH_ACTIONS } from '@features/auth/constants';
import type { AboutBuildingData, CreateConstructionData } from '../types';
import type { ConstructorSliceState } from './constructor.slice';

type ActionType = (typeof AUTH_ACTIONS)[keyof typeof AUTH_ACTIONS];
type PayloadType = AboutBuildingData | null;

interface Action {
	type: ActionType;
	payload: PayloadType;
}

export const constructorReducer = {
	setAboutBuilding: (state: ConstructorSliceState, action: Action) => {
		state.data = action.payload;
	},
	setCreateConstructionData: (
		state: ConstructorSliceState,
		action: { payload: CreateConstructionData },
	) => {
		state.createConstructionData = action.payload;
	},
};
