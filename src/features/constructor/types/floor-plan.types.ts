import type { NamedEntity } from '@core';
import type { Requirement } from '@features/guidbooks/types';
import type { FloorPlansSchemaType } from '../utils';

type FloorPlansData = FloorPlansSchemaType;

type FloorPlanModalData = {
	image: string;
};

type FloorFromReport = {
	id: string;
	reportFloorInfos: string[];
	floorNumber: string;
};

type ReportConstructionHeader = {
	id: string;
	constructionHeaderId: string;
	square: number;
	secondPlacementRoom: NamedEntity;
	firstPlacemetnRoom: NamedEntity;
	width: number;
	length: number;
	requirement?: Requirement;
};

type FloorConstruction = {
	id: string;
	documentImageUrl: string;
	coordinates: {
		x: number;
		y: number;
	};
	coordinates2: {
		x: number;
		y: number;
	};
	page: number;
	reportConstructionHeader: ReportConstructionHeader;
};

type SingleConstruction = {
	documentImageUrl: string;
	reportConstructionHeader: ReportConstructionHeader;
};

export {
	type FloorPlansData,
	type FloorPlanModalData,
	type FloorFromReport,
	type ReportConstructionHeader,
	type FloorConstruction,
	type SingleConstruction,
};
