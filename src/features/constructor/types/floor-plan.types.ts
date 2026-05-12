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
};

/** Строка окна/двери в отчёте (на бэкенде ширина — поле `lenght`). */
type AdditionalOpeningRow = {
	constructionHeaderId: string;
	length: number;
	height: number;
	quantity: number;
};

type ReportConstructionHeader = {
	id: string;
	constructionHeaderId: string;
	square: number;
	secondPlacementRoom: NamedEntity;
	firstPlacemetnRoom: NamedEntity;
	width: number;
	length: number;
	/** Индексы требования по звукоизоляции, сохранённые в конструкции отчёта (без справочника Requirement). */
	requirementNoizeIsolationIndex?: number;
	requirementNoizeImpactIndex?: number | null;
	additionalWindows?: AdditionalOpeningRow[];
	additionalDoors?: AdditionalOpeningRow[];
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
	type AdditionalOpeningRow,
	type ReportConstructionHeader,
	type FloorConstruction,
	type SingleConstruction,
};
