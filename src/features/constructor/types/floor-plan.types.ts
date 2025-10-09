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

export { type FloorPlansData, type FloorPlanModalData, type FloorFromReport };
