import { MaterialParametrs } from '@api-gen';
import { MaterialTypeEnum } from '@features/guidbooks/types';

export type ZPanelCladdingFormRow = {
	positionId: string;
	materialId: string;
	materialType: MaterialTypeEnum;
	materialTypeValue: { materialParameters: MaterialParametrs; value: string }[];
};

export const zPanelThicknessDensityDefaults = (): ZPanelCladdingFormRow['materialTypeValue'] => [
	{ materialParameters: MaterialParametrs.Thickness, value: '' },
	{ materialParameters: MaterialParametrs.Density, value: '' },
];

/** Верхняя звукопоглощающая панель: плита — плита — заполнитель */
export const zPanelTopCladdingInitialRows = (): ZPanelCladdingFormRow[] => [
	{
		positionId: '0',
		materialId: '',
		materialType: MaterialTypeEnum.Board,
		materialTypeValue: zPanelThicknessDensityDefaults(),
	},
	{
		positionId: '1',
		materialId: '',
		materialType: MaterialTypeEnum.Board,
		materialTypeValue: zPanelThicknessDensityDefaults(),
	},
	{
		positionId: '2',
		materialId: '',
		materialType: MaterialTypeEnum.Filler,
		materialTypeValue: zPanelThicknessDensityDefaults(),
	},
];

/** Нижняя панель: заполнитель — плита — плита */
export const zPanelBottomCladdingInitialRows = (): ZPanelCladdingFormRow[] => [
	{
		positionId: '0',
		materialId: '',
		materialType: MaterialTypeEnum.Filler,
		materialTypeValue: zPanelThicknessDensityDefaults(),
	},
	{
		positionId: '1',
		materialId: '',
		materialType: MaterialTypeEnum.Board,
		materialTypeValue: zPanelThicknessDensityDefaults(),
	},
	{
		positionId: '2',
		materialId: '',
		materialType: MaterialTypeEnum.Board,
		materialTypeValue: zPanelThicknessDensityDefaults(),
	},
];

export const Z_PANEL_CLADDING_POSITION_IDS = ['0', '1', '2'] as const;
