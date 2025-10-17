import type { ReportFloorInfoDto } from '@api-gen';
import type { AUTH_ACTIONS } from '@features/auth/constants';
import type { AboutBuildingData, CreateConstructionData, FloorPlanModalData } from '../types';
import type { ConstructionSheet } from '../types/constructions-sheet.types';
import type { ConstructorSliceState } from './constructor.slice';

type ActionType = (typeof AUTH_ACTIONS)[keyof typeof AUTH_ACTIONS];
type PayloadType =
	| AboutBuildingData
	| FloorPlanModalData
	| ReportFloorInfoDto
	| ConstructionSheet[]
	| string
	| null;

interface Action {
	type: ActionType;
	payload: PayloadType;
}

export const constructorReducer = {
	setFile: (state: ConstructorSliceState, action: Action) => {
		state.file = action.payload as FloorPlanModalData;
	},
	setInfo: (state: ConstructorSliceState, action: Action) => {
		state.reportInfo = action.payload as ReportFloorInfoDto;
	},
	setFloorConstructionInfoId: (state: ConstructorSliceState, action: Action) => {
		state.id = action.payload as string;
	},
	setAboutBuilding: (state: ConstructorSliceState, action: Action) => {
		//state.data = action.payload;
	},
	setCreateConstructionData: (
		state: ConstructorSliceState,
		action: { payload: CreateConstructionData },
	) => {
		state.createConstructionData = action.payload;
	},
	setConstructionSheets: (state: ConstructorSliceState, action: Action) => {
		state.constructionsSheet = action.payload as ConstructionSheet[];
	},
	setInfoFull: (state: ConstructorSliceState, action: { payload: any }) => {
		//TODO: ubrat
		state.reportInfoFull = action.payload;
	},
};
