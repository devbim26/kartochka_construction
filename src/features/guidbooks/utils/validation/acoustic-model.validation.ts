import { z } from 'zod';

const coefficientSchema = z
	.string()
	.min(1, 'Поле обязательно для заполнения')
	.refine((value) => !Number.isNaN(+value), 'Значение должно быть числом')
	.refine((value) => +value > 0, 'Значение должно быть больше нуля');

export const AcousticModelSchema = z.object({
	name: z.string(),
	openRouterModelId: z.string().min(1, 'Поле обязательно для заполнения'),
	coefficient: coefficientSchema,
});

export const AcousticModelFilterSchema = z.object({
	name: z.string(),
});

export type AcousticModelSchemaType = z.infer<typeof AcousticModelSchema>;
export type AcousticModelFilterSchemaType = z.infer<typeof AcousticModelFilterSchema>;
