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

export interface MaterialType {
	id: string;
	name: string;
	shortName: string;
	materialTypeEnum: MaterialTypeEnum;
	materialTypeValues: string;
	fullName: string;
}
