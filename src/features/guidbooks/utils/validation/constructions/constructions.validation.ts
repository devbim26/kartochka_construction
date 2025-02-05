import { z } from 'zod';

const ConstructionsDataSchema = z.object({
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	description: z.string().min(1, 'Поле обязательно для заполнения'),
	priority: z.string().min(1, 'Поле обязательно для заполнения'),
	constructionSource: z.string().min(1, 'Поле обязательно для заполнения'),
	region: z.string().min(1, 'Поле обязательно для заполнения'),
	constructionType: z.string().min(1, 'Поле обязательно для заполнения'),
	manufacturer: z.string().min(1, 'Поле обязательно для заполнения'),
	maxHeight: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	resistanceClass: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля')
		.refine((value) => +value < 6, 'Значение должно быть не больше 5'),
	specificationsSource: z.string().min(1, 'Поле обязательно для заполнения'),
	rTotal: z.array(
		z.object({
			number: z.string().min(1, 'Поле обязательно для заполнения'),
		}),
	),
	index: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	indexValue: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
});

type ConstructionsDataSchemaType = z.infer<typeof ConstructionsDataSchema>;

export { ConstructionsDataSchema, type ConstructionsDataSchemaType };
