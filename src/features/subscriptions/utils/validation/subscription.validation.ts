import { z } from 'zod';

/** Пустое поле или целое число ≥ 0 (корпоративный тариф без лимитов). */
const optionalNonNegativeInteger = z
	.string()
	.refine((value) => value === '' || !Number.isNaN(+value), 'Значение должно быть числом')
	.refine(
		(value) => value === '' || Number.isInteger(+value),
		'Значение должно быть целым числом',
	)
	.refine(
		(value) => value === '' || +value >= 0,
		'Значение должно быть больше или равно нулю',
	);

export const SubscriptionSchema = z.object({
	id: z.string().optional(),
	description: z.string().min(1, 'Поле обязательно для заполнения'),
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	numberOfReports: optionalNonNegativeInteger,
	numberOfDowloadReports: optionalNonNegativeInteger,
	tariffPlanId: z.string().optional(),
	tariffPlanName: z.string().optional(),
	tariffPlanLimit: z.string().optional(),
	price: optionalNonNegativeInteger,
});

export const SubscriptionFiltersSchema = z.object({
	description: z.string().min(1, 'Поле обязательно для заполнения'),
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	numberOfReports: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => Number.isInteger(+value), 'Значение должно быть целым числом')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	price: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => Number.isInteger(+value), 'Значение должно быть целым числом')
		.refine((value) => +value >= 0, 'Значение должно быть больше или равно нулю'),
});

export type SubscriptionSchemaType = z.infer<typeof SubscriptionSchema>;
export type SubscriptionFiltersSchemaType = z.infer<typeof SubscriptionFiltersSchema>;
