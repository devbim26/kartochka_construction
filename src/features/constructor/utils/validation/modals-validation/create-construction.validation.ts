import { z } from 'zod';

export const CreateConstructionSchema = z.object({
	id: z.string().optional(),
	requirementId: z.string().optional(),
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	constructionType: z.string().min(1, 'Поле обязательно для заполнения'),
	construction: z.string().min(1, 'Поле обязательно для заполнения'),
	firstPlacementRoom: z.string().min(1, 'Поле обязательно для заполнения'),
	secondPlacementRoom: z.string().min(1, 'Поле обязательно для заполнения'),
	area: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => Number.isInteger(Number(value)), 'Значение должно быть целым числом')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	width: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => Number.isInteger(Number(value)), 'Значение должно быть целым числом')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	length: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => Number.isInteger(Number(value)), 'Значение должно быть целым числом')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
});

export type CreateConstructionSchemaType = z.infer<typeof CreateConstructionSchema>;
