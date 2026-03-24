export enum MaterialOriginType {
	Generic = 'Generic',
	Manufacturer = 'Manufacturer',
	UserDefinedProduct = 'UserDefinedProduct',
}

export const EnMaterialOriginTypesSelectValues = [
	{ label: 'Generic', value: MaterialOriginType.Generic },
	{ label: 'Manufacturer', value: MaterialOriginType.Manufacturer },
	{ label: 'UserDefinedProduct', value: MaterialOriginType.UserDefinedProduct },
];
export const RuMaterialOriginTypesSelectValues = [
	{ label: 'Общий', value: MaterialOriginType.Generic },
	{ label: 'Производитель', value: MaterialOriginType.Manufacturer },
	{ label: 'Пользовательский продукт', value: MaterialOriginType.UserDefinedProduct },
];

export enum MaterialTypeEnum {
	Plaster = 'Plaster',
	Frame = 'Frame',
	WoodBasedBoard = 'WoodBasedBoard',
	MineralBondedBoards = 'MineralBondedBoards',
	Glazing = 'Glazing',
	Membrane = 'Membrane',
	AcousticTreatmentMaterials = 'AcousticTreatmentMaterials',
	AirGap = 'AirGap',
	Link = 'Link',
	Filler = 'Filler',
	Heavy = 'Heavy',
	Board = 'Board',
	ZPanel = 'ZPanel',
	GapDistance = 'GapDistance',
}

export enum RuMaterialTypeEnum {
	MasonryAndSolid = 'Кирпичные и монолитные',
	Frame = 'Каркасные',
	PorousMaterials = 'Пористые материалы',
	SandwichPanel = 'Сэндвич-панели',
	GypsumBondedbBoards = 'Гипсокартонные',
	WoodBasedBoard = 'Древесно-стружечные плиты',
	MineralBondedBoards = 'Минеральные плиты',
	Metal = 'Металлические',
	Glazing = 'Стеклянные',
	Membrane = 'Мембраны',
	FoamMaterials = 'Пеноматериалы',
	AcousticTreatmentMaterials = 'Акустические материалы',
	AirGap = 'Воздушные зазоры',
	Link = 'Связующие',
	Filler = 'Наполнительные',
	Heavy = 'Тяжелые',
	Board = 'Плиты',
}

export enum MaterialTypesSelectValuesEnum {
	Base = 'Base',
	Facing = 'Facing',
	Soundproofing = 'Soundproofing',
	Additional = 'Additional',
	FramePartition = 'Frame Partition',
	AirGapFiller = 'AirGapFiller',
	Glass = 'Glass',
	MultiGlass = 'MultiGlass',
	/** Стекло или плитные слои для двери (над/под базовыми плитами). */
	DoorOptionalLayers = 'DoorOptionalLayers',
}

export const MaterialTypesSelectValuesMap = {
	[MaterialTypesSelectValuesEnum.Base]: [
		{ label: 'Тяжелые', value: MaterialTypeEnum.Heavy },
		//доп материалы
		{ label: 'Плиты', value: MaterialTypeEnum.Board },
		{ label: 'Мембраны', value: MaterialTypeEnum.Membrane },
		{ label: 'Акустические материалы', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	],
	[MaterialTypesSelectValuesEnum.Glass]: [{ label: 'Стекло', value: MaterialTypeEnum.Glazing }],
	[MaterialTypesSelectValuesEnum.MultiGlass]: [
		{ label: 'Стекло', value: MaterialTypeEnum.Glazing },
		{ label: 'Воздушные зазоры', value: MaterialTypeEnum.AirGap },
	],
	[MaterialTypesSelectValuesEnum.Soundproofing]: [
		{ label: 'Звукоизоляционные', value: MaterialTypeEnum.ZPanel },
		//доп материалы
		{ label: 'Плиты', value: MaterialTypeEnum.Board },
		{ label: 'Мембраны', value: MaterialTypeEnum.Membrane },
		{ label: 'Акустические материалы', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	],
	[MaterialTypesSelectValuesEnum.Facing]: [
		{ label: 'Каркасные', value: MaterialTypeEnum.Frame },
		{ label: 'Воздушные зазоры', value: MaterialTypeEnum.AirGap },
		{ label: 'Связующие', value: MaterialTypeEnum.Link },
		{ label: 'Наполнительные', value: MaterialTypeEnum.Filler },
		{ label: 'Плиты', value: MaterialTypeEnum.Board },
		//доп материалы
		{ label: 'Мембраны', value: MaterialTypeEnum.Membrane },
		{ label: 'Акустические материалы', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	],
	[MaterialTypesSelectValuesEnum.Additional]: [
		{ label: 'Плиты', value: MaterialTypeEnum.Board },
		{ label: 'Мембраны', value: MaterialTypeEnum.Membrane },
		{ label: 'Акустические материалы', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	],
	[MaterialTypesSelectValuesEnum.FramePartition]: [
		{ label: 'Каркасные', value: MaterialTypeEnum.Frame },
		{ label: 'Наполнительные', value: MaterialTypeEnum.Filler },
		{ label: 'Плиты', value: MaterialTypeEnum.Board },
		//доп материалы
		{ label: 'Мембраны', value: MaterialTypeEnum.Membrane },
		{ label: 'Акустические материалы', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	],
	[MaterialTypesSelectValuesEnum.AirGapFiller]: [
		{ label: 'Воздушные зазоры', value: MaterialTypeEnum.AirGap },
		{ label: 'Наполнительные', value: MaterialTypeEnum.Filler },
		//доп материалы
		{ label: 'Плиты', value: MaterialTypeEnum.Board },
		{ label: 'Мембраны', value: MaterialTypeEnum.Membrane },
		{ label: 'Акустические материалы', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	],
	[MaterialTypesSelectValuesEnum.DoorOptionalLayers]: [
		{ label: 'Стеклянные', value: MaterialTypeEnum.Glazing },
		{ label: 'Тяжелые', value: MaterialTypeEnum.Heavy },
		{ label: 'Плиты', value: MaterialTypeEnum.Board },
	],
};

export const EnMaterialTypesSelectValuesMap = {
	[MaterialTypesSelectValuesEnum.Base]: [
		{ label: 'Heavy', value: MaterialTypeEnum.Heavy },
		//доп материалы
		{ label: 'Board', value: MaterialTypeEnum.Board },
		{ label: 'Membrane', value: MaterialTypeEnum.Membrane },
		{ label: 'AcousticTreatmentMaterials', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	],
	[MaterialTypesSelectValuesEnum.Glass]: [{ label: 'Glass', value: MaterialTypeEnum.Glazing }],
	[MaterialTypesSelectValuesEnum.MultiGlass]: [
		{ label: 'Glass', value: MaterialTypeEnum.Glazing },
		{ label: 'AirGap', value: MaterialTypeEnum.AirGap },
	],
	[MaterialTypesSelectValuesEnum.Soundproofing]: [
		{ label: 'ZPanel', value: MaterialTypeEnum.ZPanel },
		//доп материалы
		{ label: 'Board', value: MaterialTypeEnum.Board },
		{ label: 'Membrane', value: MaterialTypeEnum.Membrane },
		{ label: 'AcousticTreatmentMaterials', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	],
	[MaterialTypesSelectValuesEnum.Facing]: [
		{ label: 'Frame', value: MaterialTypeEnum.Frame },
		{ label: 'AirGap', value: MaterialTypeEnum.AirGap },
		{ label: 'Link', value: MaterialTypeEnum.Link },
		{ label: 'Filler', value: MaterialTypeEnum.Filler },
		{ label: 'Board', value: MaterialTypeEnum.Board },
		//доп материалы
		{ label: 'Membrane', value: MaterialTypeEnum.Membrane },
		{ label: 'AcousticTreatmentMaterials', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	],
	[MaterialTypesSelectValuesEnum.Additional]: [
		{ label: 'Board', value: MaterialTypeEnum.Board },
		{ label: 'Membrane', value: MaterialTypeEnum.Membrane },
		{ label: 'AcousticTreatmentMaterials', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	],
	[MaterialTypesSelectValuesEnum.FramePartition]: [
		{ label: 'Frame', value: MaterialTypeEnum.Frame },
		{ label: 'Filler', value: MaterialTypeEnum.Filler },
		{ label: 'Board', value: MaterialTypeEnum.Board },
		//доп материалы
		{ label: 'Membrane', value: MaterialTypeEnum.Membrane },
		{ label: 'AcousticTreatmentMaterials', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	],
	[MaterialTypesSelectValuesEnum.AirGapFiller]: [
		{ label: 'AirGap', value: MaterialTypeEnum.AirGap },
		{ label: 'Filler', value: MaterialTypeEnum.Filler },
		//доп материалы
		{ label: 'Board', value: MaterialTypeEnum.Board },
		{ label: 'Membrane', value: MaterialTypeEnum.Membrane },
		{ label: 'AcousticTreatmentMaterials', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	],
	[MaterialTypesSelectValuesEnum.DoorOptionalLayers]: [
		{ label: 'Glazing', value: MaterialTypeEnum.Glazing },
		{ label: 'Heavy', value: MaterialTypeEnum.Heavy },
		{ label: 'Board', value: MaterialTypeEnum.Board },
	],
};

export const RuMaterialTypesSelectValues = [
	{ label: 'Каркасные', value: MaterialTypeEnum.Frame },
	{ label: 'Древесно-стружечные плиты', value: MaterialTypeEnum.WoodBasedBoard },
	{ label: 'Минеральные плиты', value: MaterialTypeEnum.MineralBondedBoards },
	{ label: 'Стеклянные', value: MaterialTypeEnum.Glazing },
	{ label: 'Мембраны', value: MaterialTypeEnum.Membrane },
	{ label: 'Акустические материалы', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	{ label: 'Воздушные зазоры', value: MaterialTypeEnum.AirGap },
	{ label: 'Связующие', value: MaterialTypeEnum.Link },
	{ label: 'Наполнительные', value: MaterialTypeEnum.Filler },
	{ label: 'Тяжелые', value: MaterialTypeEnum.Heavy },
	{ label: 'Плиты', value: MaterialTypeEnum.Board },
	{ label: 'Звукоизоляционные', value: MaterialTypeEnum.ZPanel },
	{ label: 'Зазоры', value: MaterialTypeEnum.GapDistance },
	{ label: 'Штукатурка', value: MaterialTypeEnum.Plaster },
];

export const EnMaterialTypesSelectValues = [
	{ label: 'Frame', value: MaterialTypeEnum.Frame },
	{ label: 'WoodBasedBoard', value: MaterialTypeEnum.WoodBasedBoard },
	{ label: 'MineralBondedBoards', value: MaterialTypeEnum.MineralBondedBoards },
	{ label: 'Glazing', value: MaterialTypeEnum.Glazing },
	{ label: 'Membrane', value: MaterialTypeEnum.Membrane },
	{ label: 'AcousticTreatmentMaterials', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	{ label: 'AirGap', value: MaterialTypeEnum.AirGap },
	{ label: 'Link', value: MaterialTypeEnum.Link },
	{ label: 'Filler', value: MaterialTypeEnum.Filler },
	{ label: 'Heavy', value: MaterialTypeEnum.Heavy },
	{ label: 'Board', value: MaterialTypeEnum.Board },
	{ label: 'ZPanel', value: MaterialTypeEnum.ZPanel },
	{ label: 'GapDistance', value: MaterialTypeEnum.GapDistance },
	{ label: 'Plaster', value: MaterialTypeEnum.Plaster },
];

export interface MaterialType {
	id: string;
	name: string;
	shortName: string;
	materialTypeEnum: string;
	materialTypeValues: string;
	fullName: string;
}
