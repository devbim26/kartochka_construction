export enum MaterialOriginType {
	Generic = 'Generic',
	Manufacturer = 'Manufacturer',
	UserDefinedProduct = 'UserDefinedProduct',
}

export const RuMaterialOriginTypesSelectValues = [
	{ label: 'Общий', value: MaterialOriginType.Generic },
	{ label: 'Произвлдитель', value: MaterialOriginType.Manufacturer },
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
}

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
];

export interface MaterialType {
	id: string;
	name: string;
	shortName: string;
	materialTypeEnum: string;
	materialTypeValues: string;
	fullName: string;
}
