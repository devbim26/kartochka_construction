export enum MaterialOriginType {
	Generic = 'Generic',
	Manufacturer = 'Manufacturer',
	UserDefinedProduct = 'UserDefinedProduct',
}

export const RuMaterialOriginTypesSelectValues = [
	{ label: 'Общий', value: MaterialOriginType.Generic },
	{ label: 'Производитель', value: MaterialOriginType.Manufacturer },
	{ label: 'Пользовательский продукт', value: MaterialOriginType.UserDefinedProduct },
];

export enum MaterialTypeEnum {
	MasonryAndSolid = 'MasonryAndSolid',
	Frame = 'Frame',
	PorousMaterials = 'PorousMaterials',
	SandwichPanel = 'SandwichPanel',
	GypsumBondedbBoards = 'GypsumBondedbBoards',
	WoodBasedBoard = 'WoodBasedBoard',
	MineralBondedBoards = 'MineralBondedBoards',
	Metal = 'Metal',
	Glazing = 'Glazing',
	Membrane = 'Membrane',
	FoamMaterials = 'FoamMaterials',
	AcousticTreatmentMaterials = 'AcousticTreatmentMaterials',
	AirGap = 'AirGap',
	Link = 'Link',
	Filler = 'Filler',
	Heavy = 'Heavy',
	Board = 'Board',
	ZPanel = 'ZPanel',
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
	// Additional = 'Additional',
	FramePartition = 'Frame Partition',
	AirGapFiller = 'AirGapFiller',
	Glass = 'Glass',
	MultiGlass = 'MultiGlass',
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
	// [MaterialTypesSelectValuesEnum.Additional]: [
	// 	{ label: 'Плиты', value: MaterialTypeEnum.Board },
	// 	{ label: 'Мембраны', value: MaterialTypeEnum.Membrane },
	// 	{ label: 'Акустические материалы', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	// ],
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
};

export const RuMaterialTypesSelectValues = [
	{ label: 'Кирпичные и монолитные', value: MaterialTypeEnum.MasonryAndSolid },
	{ label: 'Каркасные', value: MaterialTypeEnum.Frame },
	{ label: 'Пористые материалы', value: MaterialTypeEnum.PorousMaterials },
	{ label: 'Сэндвич-панели', value: MaterialTypeEnum.SandwichPanel },
	{ label: 'Гипсокартонные', value: MaterialTypeEnum.GypsumBondedbBoards },
	{ label: 'Древесно-стружечные плиты', value: MaterialTypeEnum.WoodBasedBoard },
	{ label: 'Минеральные плиты', value: MaterialTypeEnum.MineralBondedBoards },
	{ label: 'Металлические', value: MaterialTypeEnum.Metal },
	{ label: 'Стеклянные', value: MaterialTypeEnum.Glazing },
	{ label: 'Мембраны', value: MaterialTypeEnum.Membrane },
	{ label: 'Пеноматериалы', value: MaterialTypeEnum.FoamMaterials },
	{ label: 'Акустические материалы', value: MaterialTypeEnum.AcousticTreatmentMaterials },
	{ label: 'Воздушные зазоры', value: MaterialTypeEnum.AirGap },
	{ label: 'Связующие', value: MaterialTypeEnum.Link },
	{ label: 'Наполнительные', value: MaterialTypeEnum.Filler },
	{ label: 'Тяжелые', value: MaterialTypeEnum.Heavy },
	{ label: 'Плиты', value: MaterialTypeEnum.Board },
	{ label: 'Звукоизоляционные', value: MaterialTypeEnum.ZPanel },
];

export interface MaterialType {
	id: string;
	name: string;
	shortName: string;
	materialTypeEnum: string;
	materialTypeValues: string;
	fullName: string;
}
