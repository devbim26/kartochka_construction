import { fetchApi } from '@api-gen';
import {
	convertAcousticModelFiltersToServer,
	convertAcousticModelToServer,
} from '../converters/acoustic-models';
import type { AcousticModel, AcousticModelFilters } from '../types/acoustic-models';

export const getAcousticModels = async (filters: AcousticModelFilters) => {
	return await fetchApi.api.openRouterModelsModelsCreate(
		convertAcousticModelFiltersToServer(filters),
	);
};

export const saveAcousticModel = async (data: AcousticModel) => {
	return await fetchApi.api.openRouterModelsCreate(convertAcousticModelToServer(data));
};

export const deleteAcousticModel = async (openRouterModelId: string) => {
	return await fetchApi.api.openRouterModelsDelete({ modelId: openRouterModelId });
};
