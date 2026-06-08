import type { ResetInterval, TariffPlanDto } from '@api-gen';
import {
	RESET_INTERVAL_EMPTY,
	TARIFF_PLAN_COEFFICIENT,
} from '../../constants/tariff-plan.constants';
import type { TariffPlan } from '../../types/tariff-plans';

export const convertTariffPlanToClient = (data: TariffPlanDto): TariffPlan => ({
	id: data.id,
	name: data.name ?? '',
	resetInterval: data.resetInterval ?? RESET_INTERVAL_EMPTY,
	credits: data.credits != null ? String(data.credits) : '',
});

export const convertTariffPlanToServer = (data: TariffPlan) => {
	const payload: {
		id?: string;
		name: string;
		resetInterval?: ResetInterval;
		credits: number;
		coefficient: number;
	} = {
		name: data.name,
		credits: +data.credits,
		coefficient: TARIFF_PLAN_COEFFICIENT,
	};

	if (data.id) payload.id = data.id;
	if (data.resetInterval) payload.resetInterval = data.resetInterval as ResetInterval;

	return payload;
};
