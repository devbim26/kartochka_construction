import { ResetInterval } from '@api-gen';
import { z } from 'zod';
import { RESET_INTERVAL_EMPTY } from '../../constants/tariff-plan.constants';

const resetIntervalSchema = z
	.string()
	.refine(
		(value) =>
			value === RESET_INTERVAL_EMPTY || value === ResetInterval.Daily || value === ResetInterval.Monthly,
		'Некорректный интервал сброса',
	);

export const TariffPlanSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	resetInterval: resetIntervalSchema,
	credits: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => !Number.isNaN(+value), 'Значение должно быть числом')
		.refine((value) => +value >= 0, 'Значение должно быть больше или равно нулю'),
});

export const TariffPlanFilterSchema = z.object({});

export type TariffPlanSchemaType = z.infer<typeof TariffPlanSchema>;
export type TariffPlanFilterSchemaType = z.infer<typeof TariffPlanFilterSchema>;
