import { MaterialParametrs } from '@api-gen';
import { MaterialTypeEnum } from '@features/guidbooks/types';

const thicknessDensity = () => [
	{ materialParameters: MaterialParametrs.Thickness, value: '' },
	{ materialParameters: MaterialParametrs.Density, value: '' },
];

/** Ядро многослойной стены: тяжёлый — плита — тяжёлый (без штукатурки). */
export const heavyMultiLayerWallCenterCoreRows = () => [
	{
		positionId: '2',
		materialId: '',
		materialType: MaterialTypeEnum.Heavy,
		materialTypeValue: thicknessDensity(),
	},
	{
		positionId: '3',
		materialId: '',
		materialType: MaterialTypeEnum.Board,
		materialTypeValue: thicknessDensity(),
	},
	{
		positionId: '4',
		materialId: '',
		materialType: MaterialTypeEnum.Heavy,
		materialTypeValue: thicknessDensity(),
	},
];
