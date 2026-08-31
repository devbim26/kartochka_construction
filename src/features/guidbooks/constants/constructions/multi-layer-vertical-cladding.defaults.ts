import { MaterialParametrs } from '@api-gen';
import { MaterialTypeEnum } from '@features/guidbooks/types';

export type VerticalCladdingFormRow = {
	positionId: string;
	materialId: string;
	materialType: MaterialTypeEnum;
	materialTypeValue: { materialParameters: MaterialParametrs; value: string }[];
};

const thicknessDensity = (): VerticalCladdingFormRow['materialTypeValue'] => [
	{ materialParameters: MaterialParametrs.Thickness, value: '' },
	{ materialParameters: MaterialParametrs.Density, value: '' },
];

const frameWidthStep = (): VerticalCladdingFormRow['materialTypeValue'] => [
	{ materialParameters: MaterialParametrs.Thickness, value: '' },
	{ materialParameters: MaterialParametrs.RackStep, value: '' },
];

const linkConnections = (): VerticalCladdingFormRow['materialTypeValue'] => [
	{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
	{ materialParameters: MaterialParametrs.ConnectionType, value: '' },
];

/**
 * Облицовка слева (Left): от наружной стороны к базе — плита, заполнитель, каркас, подвес;
 * воздушный зазор последним (у базовой конструкции).
 */
export const multiLayerTopCladdingInitialRows = (): VerticalCladdingFormRow[] => [
	{
		positionId: '0',
		materialId: '',
		materialType: MaterialTypeEnum.Board,
		materialTypeValue: thicknessDensity(),
	},
	{
		positionId: '1',
		materialId: '',
		materialType: MaterialTypeEnum.Filler,
		materialTypeValue: thicknessDensity(),
	},
	{
		positionId: '2',
		materialId: '',
		materialType: MaterialTypeEnum.Frame,
		materialTypeValue: frameWidthStep(),
	},
	{
		positionId: '3',
		materialId: '',
		materialType: MaterialTypeEnum.Link,
		materialTypeValue: linkConnections(),
	},
	{
		positionId: '4',
		materialId: '',
		materialType: MaterialTypeEnum.AirGap,
		materialTypeValue: thicknessDensity(),
	},
];

/**
 * Облицовка справа (Right): воздушный зазор первым (у базы), далее подвес, каркас, заполнитель, плита.
 */
export const multiLayerBottomCladdingInitialRows = (): VerticalCladdingFormRow[] => [
	{
		positionId: '0',
		materialId: '',
		materialType: MaterialTypeEnum.AirGap,
		materialTypeValue: thicknessDensity(),
	},
	{
		positionId: '1',
		materialId: '',
		materialType: MaterialTypeEnum.Link,
		materialTypeValue: linkConnections(),
	},
	{
		positionId: '2',
		materialId: '',
		materialType: MaterialTypeEnum.Frame,
		materialTypeValue: frameWidthStep(),
	},
	{
		positionId: '3',
		materialId: '',
		materialType: MaterialTypeEnum.Filler,
		materialTypeValue: thicknessDensity(),
	},
	{
		positionId: '4',
		materialId: '',
		materialType: MaterialTypeEnum.Board,
		materialTypeValue: thicknessDensity(),
	},
];

export const MULTI_LAYER_VERTICAL_CLADDING_POSITION_IDS = ['0', '1', '2', '3', '4'] as const;

