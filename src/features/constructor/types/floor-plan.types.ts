import type { NamedEntity } from '@core';
import type { FloorPlansSchemaType } from '../utils';

type FloorPlansData = FloorPlansSchemaType;

type FloorPlanModalData = {
	image: string;
};

type FloorFromReport = {
	id: string;
	reportFloorInfos: string[];
	floorNumber: string;
	floorDocumentUrl: string;
};

type ReportConstructionHeader = {
	id: string;
	constructionHeaderId: string;
	square: number;
	secondPlacementRoom: NamedEntity;
	firstPlacemetnRoom: NamedEntity;
	width: number;
	length: number;
};

type FloorConstruction = {
	documentImageUrl: string;
	coordinates: {
		x: number;
		y: number;
	};
	page: number;
	reportConstructionHeader: ReportConstructionHeader;
};

export {
	type FloorPlansData,
	type FloorPlanModalData,
	type FloorFromReport,
	type ReportConstructionHeader,
	type FloorConstruction,
};
