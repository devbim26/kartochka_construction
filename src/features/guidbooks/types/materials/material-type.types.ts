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
	Plaster = 'Штукатурка',
	Frame = 'Каркас',
	WoodBasedBoard = 'Деревянные панели',
	MineralBondedBoards = 'Минеральные панели',
	Glazing = 'Стекло',
	Membrane = 'Мембрана',
	AcousticTreatmentMaterials = 'Акустические материалы',
	AirGap = 'Воздушный зазор',
	Link = 'Тип связи',
	Filler = 'Заполнитель',
	Heavy = 'Тяжелая однослойная',
	Board = 'Плитные материалы',
	ZPanel = 'Звукоизоляционная панель',
	GapDistance = 'Промежуток',
	Screed = 'Стяжка',
}

/** Подписи типов материалов в селектах — как Description на бэкенде (MaterialTypeEnum). */
export const MaterialTypeSelectLabelsRu: Record<MaterialTypeEnum, string> = {
	[MaterialTypeEnum.Plaster]: 'Штукатурка',
	[MaterialTypeEnum.Frame]: 'Каркас',
	[MaterialTypeEnum.WoodBasedBoard]: 'Деревянные панели',
	[MaterialTypeEnum.MineralBondedBoards]: 'Минеральные панели',
	[MaterialTypeEnum.Glazing]: 'Стекло',
	[MaterialTypeEnum.Membrane]: 'Мембрана',
	[MaterialTypeEnum.AcousticTreatmentMaterials]: 'Акустические материалы',
	[MaterialTypeEnum.AirGap]: 'Воздушный зазор',
	[MaterialTypeEnum.Link]: 'Тип связи',
	[MaterialTypeEnum.Filler]: 'Заполнитель',
	[MaterialTypeEnum.Heavy]: 'Тяжелая однослойная',
	[MaterialTypeEnum.Board]: 'Плитные материалы',
	[MaterialTypeEnum.ZPanel]: 'Звукоизоляционная панель',
	[MaterialTypeEnum.GapDistance]: 'Промежуток',
	[MaterialTypeEnum.Screed]: 'Стяжка',
};

export const MaterialTypeSelectLabelsEn: Record<MaterialTypeEnum, string> = {
	[MaterialTypeEnum.Plaster]: 'Plaster',
	[MaterialTypeEnum.Frame]: 'Frame',
	[MaterialTypeEnum.WoodBasedBoard]: 'Wood-based boards',
	[MaterialTypeEnum.MineralBondedBoards]: 'Mineral-bonded boards',
	[MaterialTypeEnum.Glazing]: 'Glazing',
	[MaterialTypeEnum.Membrane]: 'Membrane',
	[MaterialTypeEnum.AcousticTreatmentMaterials]: 'Acoustic treatment materials',
	[MaterialTypeEnum.AirGap]: 'Air gap',
	[MaterialTypeEnum.Link]: 'Link type',
	[MaterialTypeEnum.Filler]: 'Filler',
	[MaterialTypeEnum.Heavy]: 'Heavy single-layer',
	[MaterialTypeEnum.Board]: 'Board materials',
	[MaterialTypeEnum.ZPanel]: 'Sound insulation panel',
	[MaterialTypeEnum.GapDistance]: 'Gap',
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
