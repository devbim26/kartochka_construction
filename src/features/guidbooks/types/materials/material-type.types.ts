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
	Screed = 'Screed',
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
	Screed = 'Стяжка',
}

/** Подписи типов материалов в селектах (enum не меняем). */
export const MaterialTypeSelectLabelsRu: Partial<Record<MaterialTypeEnum, string>> = {
	[MaterialTypeEnum.Heavy]: 'Тяжелые материалы',
	[MaterialTypeEnum.Board]: 'Плитные материалы',
	[MaterialTypeEnum.Frame]: 'Каркас',
	[MaterialTypeEnum.Glazing]: 'Стекло',
	[MaterialTypeEnum.Link]: 'Подвес',
	[MaterialTypeEnum.AirGap]: 'Воздушный зазор',
	[MaterialTypeEnum.Filler]: 'Звукопоглощающие плиты',
	[MaterialTypeEnum.Membrane]: 'Мембраны',
	[MaterialTypeEnum.AcousticTreatmentMaterials]: 'Акустические материалы',
	[MaterialTypeEnum.Plaster]: 'Штукатурка',
	[MaterialTypeEnum.Screed]: 'Стяжка',
};

export const MaterialTypeSelectLabelsEn: Partial<Record<MaterialTypeEnum, string>> = {
	[MaterialTypeEnum.Heavy]: 'Heavy materials',
	[MaterialTypeEnum.Board]: 'Board materials',
	[MaterialTypeEnum.Frame]: 'Frame',
	[MaterialTypeEnum.Glazing]: 'Glass',
	[MaterialTypeEnum.Link]: 'Suspension',
	[MaterialTypeEnum.AirGap]: 'Air gap',
	[MaterialTypeEnum.Filler]: 'Sound-absorbing boards',
	[MaterialTypeEnum.Membrane]: 'Membrane',
	[MaterialTypeEnum.AcousticTreatmentMaterials]: 'Acoustic treatment materials',
	[MaterialTypeEnum.Plaster]: 'Plaster',
	[MaterialTypeEnum.Screed]: 'Screed',
};

/** Не показывать в селектах выбора типа материала. */
export const MATERIAL_TYPES_EXCLUDED_FROM_SELECT: MaterialTypeEnum[] = [
	MaterialTypeEnum.WoodBasedBoard,
	MaterialTypeEnum.MineralBondedBoards,
	MaterialTypeEnum.ZPanel,
	MaterialTypeEnum.GapDistance,
];

export type MaterialTypeSelectOption = { label: string; value: MaterialTypeEnum };

const materialTypeSelectOption = (
	type: MaterialTypeEnum,
	locale: 'ru' | 'en',
): MaterialTypeSelectOption => ({
	label:
		(locale === 'en' ? MaterialTypeSelectLabelsEn : MaterialTypeSelectLabelsRu)[type] ??
		type,
	value: type,
});

const materialTypeSelectOptions = (
	types: MaterialTypeEnum[],
	locale: 'ru' | 'en',
): MaterialTypeSelectOption[] =>
	types
		.filter((t) => !MATERIAL_TYPES_EXCLUDED_FROM_SELECT.includes(t))
		.map((t) => materialTypeSelectOption(t, locale));

export enum MaterialTypesSelectValuesEnum {
	Base = 'Base',
	Facing = 'Facing',
	Soundproofing = 'Soundproofing',
	Additional = 'Additional',
	FramePartition = 'Frame Partition',
	AirGapFiller = 'AirGapFiller',
	Glass = 'Glass',
	MultiGlass = 'MultiGlass',
	/** Пол с упругим основанием: стяжка, упругий слой, тяжёлая плита. */
	ElasticBaseFloor = 'ElasticBaseFloor',
	/** Однослойные перекрытия: доп. слои сверху — плиты или стяжка. */
	HomogeneousFloorOptional = 'HomogeneousFloorOptional',
	/** Стекло или плитные слои для двери (над/под базовыми плитами). */
	DoorOptionalLayers = 'DoorOptionalLayers',
	/** Тяжелая однослойная стена: тяжёлые, плиты, штукатурка (без мембран и акустики). */
	BaseHeavySingleLayer = 'BaseHeavySingleLayer',
}

/** Типы материалов, недоступные при добавлении слоя в проектировании. */
export const DESIGNING_EXCLUDED_MATERIAL_TYPES: MaterialTypeEnum[] = [
	MaterialTypeEnum.AcousticTreatmentMaterials,
];

const supplementalMaterialTypes: MaterialTypeEnum[] = [
	MaterialTypeEnum.Membrane,
	MaterialTypeEnum.AcousticTreatmentMaterials,
];

/** Тяжёлые стены: тяжёлые, плиты, штукатурка (без мембран и акустики в базе). */
const heavyBaseLayerMaterialTypes: MaterialTypeEnum[] = [
	MaterialTypeEnum.Heavy,
	MaterialTypeEnum.Board,
	MaterialTypeEnum.Plaster,
];

const buildMaterialTypesSelectValuesMap = (locale: 'ru' | 'en') => ({
	[MaterialTypesSelectValuesEnum.Base]: materialTypeSelectOptions(
		[MaterialTypeEnum.Heavy, MaterialTypeEnum.Board, ...supplementalMaterialTypes],
		locale,
	),
	[MaterialTypesSelectValuesEnum.Glass]: materialTypeSelectOptions(
		[MaterialTypeEnum.Glazing],
		locale,
	),
	[MaterialTypesSelectValuesEnum.MultiGlass]: materialTypeSelectOptions(
		[MaterialTypeEnum.Glazing, MaterialTypeEnum.AirGap],
		locale,
	),
	[MaterialTypesSelectValuesEnum.Soundproofing]: materialTypeSelectOptions(
		[MaterialTypeEnum.Board, ...supplementalMaterialTypes],
		locale,
	),
	[MaterialTypesSelectValuesEnum.Facing]: materialTypeSelectOptions(
		[
			MaterialTypeEnum.Frame,
			MaterialTypeEnum.AirGap,
			MaterialTypeEnum.Link,
			MaterialTypeEnum.Filler,
			MaterialTypeEnum.Board,
			MaterialTypeEnum.Plaster,
			...supplementalMaterialTypes,
		],
		locale,
	),
	[MaterialTypesSelectValuesEnum.Additional]: materialTypeSelectOptions(
		[MaterialTypeEnum.Board, MaterialTypeEnum.Plaster, ...supplementalMaterialTypes],
		locale,
	),
	[MaterialTypesSelectValuesEnum.FramePartition]: materialTypeSelectOptions(
		[
			MaterialTypeEnum.Frame,
			MaterialTypeEnum.Filler,
			MaterialTypeEnum.Board,
			...supplementalMaterialTypes,
		],
		locale,
	),
	[MaterialTypesSelectValuesEnum.AirGapFiller]: materialTypeSelectOptions(
		[
			MaterialTypeEnum.AirGap,
			MaterialTypeEnum.Filler,
			MaterialTypeEnum.Board,
			...supplementalMaterialTypes,
		],
		locale,
	),
	[MaterialTypesSelectValuesEnum.ElasticBaseFloor]: materialTypeSelectOptions(
		[MaterialTypeEnum.Screed, MaterialTypeEnum.Filler, MaterialTypeEnum.Heavy],
		locale,
	),
	[MaterialTypesSelectValuesEnum.HomogeneousFloorOptional]: materialTypeSelectOptions(
		[MaterialTypeEnum.Board, MaterialTypeEnum.Screed],
		locale,
	),
	[MaterialTypesSelectValuesEnum.DoorOptionalLayers]: materialTypeSelectOptions(
		[MaterialTypeEnum.Glazing, MaterialTypeEnum.Heavy, MaterialTypeEnum.Board],
		locale,
	),
	[MaterialTypesSelectValuesEnum.BaseHeavySingleLayer]: materialTypeSelectOptions(
		heavyBaseLayerMaterialTypes,
		locale,
	),
});

export const MaterialTypesSelectValuesMap = buildMaterialTypesSelectValuesMap('ru');

export const EnMaterialTypesSelectValuesMap = buildMaterialTypesSelectValuesMap('en');

const allSelectableMaterialTypes: MaterialTypeEnum[] = [
	MaterialTypeEnum.Frame,
	MaterialTypeEnum.Glazing,
	MaterialTypeEnum.Membrane,
	MaterialTypeEnum.AcousticTreatmentMaterials,
	MaterialTypeEnum.AirGap,
	MaterialTypeEnum.Link,
	MaterialTypeEnum.Filler,
	MaterialTypeEnum.Heavy,
	MaterialTypeEnum.Board,
	MaterialTypeEnum.Plaster,
	MaterialTypeEnum.Screed,
];

export const RuMaterialTypesSelectValues = materialTypeSelectOptions(
	allSelectableMaterialTypes,
	'ru',
);

export const EnMaterialTypesSelectValues = materialTypeSelectOptions(
	allSelectableMaterialTypes,
	'en',
);

export interface MaterialType {
	id: string;
	name: string;
	shortName: string;
	materialTypeEnum: string;
	materialTypeValues: string;
	fullName: string;
}
