import type { ReportFloorInfoDto, ReportInfoFloorConstructionDto } from '@api-gen';
import { type SliceInitialState } from '@core/utils/fetch/create-cases.util';
import { createSlice } from '@reduxjs/toolkit';
import type { AboutBuildingData, CreateConstructionData, FloorPlanModalData } from '../types';
import type { ConstructionSheet } from '../types/constructions-sheet.types';
import { constructorReducer } from './constructor.reducer';

export type ConstructorDataState = AboutBuildingData | FloorPlanModalData;

export interface ConstructorSliceState extends SliceInitialState {
	data: ConstructorDataState | null;
	createConstructionData: CreateConstructionData | null;
	reportInfo: ReportFloorInfoDto | null;
	file: FloorPlanModalData | null;
	constructionsSheet: ConstructionSheet[];
	reportInfoFull: ReportInfoFloorConstructionDto | null;
}

const initialState: ConstructorSliceState = {
	fetch_data: {
		group: '',
		fetch_name: '',
	},
	loading: false,
	status: 0,
	error: null,
	data: null,
	createConstructionData: null,
	reportInfo: null,
	file: null,
	constructionsSheet: [],
	reportInfoFull: null,
};

export const constructorSlice = createSlice({
	name: 'responseData',
	initialState: initialState,
	reducers: {
		setInfo: constructorReducer.setInfo,
		setFile: constructorReducer.setFile,
		setAboutBuilding: constructorReducer.setAboutBuilding,
		setCreateConstructionData: constructorReducer.setCreateConstructionData,
		setConstructionsSheet: constructorReducer.setConstructionSheets,
		setInfoFull: constructorReducer.setInfoFull,
	},
});
