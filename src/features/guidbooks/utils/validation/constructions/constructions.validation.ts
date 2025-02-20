import { z } from 'zod';

export const ConstructionsFilterSchema = z.object({
	name: z.string(),
	constructionTypeId: z.string(),
	description: z.string(),
	region: z.string(),
});

export const ConstructionsAddSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	description: z.string().min(1, 'Поле обязательно для заполнения'),
	priority: z.string().min(1, 'Поле обязательно для заполнения'),
	descriptionSource: z.string().min(1, 'Поле обязательно для заполнения'),
	region: z.string().min(1, 'Поле обязательно для заполнения'),
	constructionType: z.string().min(1, 'Поле обязательно для заполнения'),
	issuer: z.string().min(1, 'Поле обязательно для заполнения'),
	maxHeight: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	fireResistance: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	propertySource: z.string().min(1, 'Поле обязательно для заполнения'),
	labRTotal: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => {
			const numbers = value.split(',').map((num) => num.trim());
			const isValidCount = numbers.length === 16 || numbers.length === 21;
			return isValidCount;
		}, 'Необходимо 16 или 21 значение')
		.refine((value) => {
			const numbers = value.split(',').map((num) => num.trim());
			const areNumbers = numbers.every((num) => !isNaN(parseFloat(num)) && isFinite(+num));
			return areNumbers;
		}, 'Значение должны быть числами'),
	labIndex: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	labIndexValue: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
});

export const ConstructionsEditSchema = ConstructionsAddSchema.merge(
	z.object({
		comment: z.string(),
		estimatedRTotal: z.string().min(1, 'Поле обязательно для заполнения'),
		estimatedIndex: z
			.string()
			.min(1, 'Поле обязательно для заполнения')
			.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
		estimatedIndexValue: z
			.string()
			.min(1, 'Поле обязательно для заполнения')
			.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	}),
);

export type ConstructionsAddSchemaType = z.infer<typeof ConstructionsAddSchema>;
export type ConstructionsEditSchemaType = z.infer<typeof ConstructionsEditSchema>;
export type ConstructionsFilterSchemaType = z.infer<typeof ConstructionsFilterSchema>;
