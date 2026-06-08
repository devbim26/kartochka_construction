import { fetchApi } from '@api-gen';
import type { PaginationState } from '@core';
import { convertTariffPlanToServer } from '../converters/tariff-plans';
import type { TariffPlan } from '../types/tariff-plans';

export const getTariffPlanById = async (id: string) => {
	return await fetchApi.api.tariffPlanDetail(id);
};

export const deleteTariffPlan = async (id: string) => {
	return await fetchApi.api.tariffPlanDelete(id, { tariffId: id });
};

export const createTariffPlan = async (data: TariffPlan) => {
	return await fetchApi.api.tariffPlanCreate(convertTariffPlanToServer(data));
};

export const updateTariffPlan = async (data: TariffPlan) => {
	return await fetchApi.api.tariffPlanUpdate(convertTariffPlanToServer(data));
};

type PaginatedProps = {
	pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>;
};

export const getPaginatedTariffPlans = async ({ pagination }: PaginatedProps) => {
	return await fetchApi.api.tariffPlanGetPaginatedCreate({
		...pagination,
	});
};
