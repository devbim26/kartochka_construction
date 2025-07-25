import { z } from 'zod';

export const SubscriptionSchema = z.object({
	id: z.string().optional(),
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
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
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
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
});

export type SubscriptionSchemaType = z.infer<typeof SubscriptionSchema>;
export type SubscriptionFiltersSchemaType = z.infer<typeof SubscriptionFiltersSchema>;
