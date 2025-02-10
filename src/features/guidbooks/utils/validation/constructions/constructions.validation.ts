import { z } from 'zod';

const heavySingleWallDataSchema = z.object({
	type: z.string().min(1, 'Поле обязательно для заполнения'),
	material: z.string().min(1, 'Поле обязательно для заполнения'),
	thickness: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	density: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
});
export const ConstructionsFilterDataSchema = z.object({
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	description: z.string().min(1, 'Поле обязательно для заполнения'),
	region: z.string().min(1, 'Поле обязательно для заполнения'),
	constructionType: z.string().min(1, 'Поле обязательно для заполнения'),
});

export const ConstructionsAddDataSchema = z.object({
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
	rLab: z.array(
		z.object({
			number: z.string().min(1, 'Поле обязательно для заполнения'),
		}),
	),
	labIndex: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	labIndexValue: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	heavySingleWall: z.array(z.record(z.string(), heavySingleWallDataSchema.optional())),
});

export const ConstructionsEditDataSchema = z.object({
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
	rLab: z.array(
		z.object({
			number: z.string().min(1, 'Поле обязательно для заполнения'),
		}),
	),
	rCalc: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	labIndex: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	labIndexValue: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	estimatedIndex: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	estimatedIndexValue: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	heavySingleWall: z.array(z.record(z.string(), heavySingleWallDataSchema.optional())),
});

export type ConstructionsAddData = z.infer<typeof ConstructionsAddDataSchema>;
export type ConstructionsEditData = z.infer<typeof ConstructionsEditDataSchema>;
export type ConstructionsFilterData = z.infer<typeof ConstructionsFilterDataSchema>;
