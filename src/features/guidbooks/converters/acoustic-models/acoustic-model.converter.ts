import type { AcousticModelDto } from '@api-gen';
import type { AcousticModel, AcousticModelFilters } from '../../types/acoustic-models';

export const convertAcousticModelToClient = (data: AcousticModelDto): AcousticModel => ({
	name: data.name ?? '',
	coefficient: data.coefficient != null ? String(data.coefficient) : '',
	openRouterModelId: data.openRouterModelId ?? '',
});

export const convertAcousticModelToServer = (data: AcousticModel) => ({
	modelId: data.openRouterModelId,
	coefficient: +data.coefficient,
});

export const convertAcousticModelFiltersToServer = (data: AcousticModelFilters) => ({
	name: data.name?.trim() ? data.name.trim() : null,
});
