import { z } from 'zod';

const baseConstructionSchema = z.object({
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

const claddingSchema = z.object({
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
	racksStep: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	width: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	numberOfConnections: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => Number.isInteger(+value), 'Значение должно быть целым числом')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
});

export const ConstructionsFilterSchema = z.object({
	name: z.string(),
	description: z.string(),
	region: z.string(),
	constructionType: z.string(),
});

export const ConstructionsAddSchema = z.object({
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
	baseConstruction: z.record(baseConstructionSchema.optional()),
	cladding: z.record(claddingSchema.optional()),
});

export const ConstructionsEditSchema = z.object({
	// name: z.string().min(1, 'Поле обязательно для заполнения'),
	// description: z.string().min(1, 'Поле обязательно для заполнения'),
	// priority: z.string().min(1, 'Поле обязательно для заполнения'),
	// constructionSource: z.string().min(1, 'Поле обязательно для заполнения'),
	// region: z.string().min(1, 'Поле обязательно для заполнения'),
	// constructionType: z.string().min(1, 'Поле обязательно для заполнения'),
	// manufacturer: z.string().min(1, 'Поле обязательно для заполнения'),
	// maxHeight: z
	// 	.string()
	// 	.min(1, 'Поле обязательно для заполнения')
	// 	.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	// resistanceClass: z
	// 	.string()
	// 	.min(1, 'Поле обязательно для заполнения')
	// 	.refine((value) => +value > 0, 'Значение должно быть больше нуля')
	// 	.refine((value) => +value < 6, 'Значение должно быть не больше 5'),
	// specificationsSource: z.string().min(1, 'Поле обязательно для заполнения'),
	// rTotal: z.array(
	// 	z.object({
	// 		number: z.string().min(1, 'Поле обязательно для заполнения'),
	// 	}),
	// ),
	// rLab: z.array(
	// 	z.object({
	// 		number: z.string().min(1, 'Поле обязательно для заполнения'),
	// 	}),
	// ),
	// rCalc: z
	// 	.string()
	// 	.min(1, 'Поле обязательно для заполнения')
	// 	.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	// labIndex: z
	// 	.string()
	// 	.min(1, 'Поле обязательно для заполнения')
	// 	.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	// labIndexValue: z
	// 	.string()
	// 	.min(1, 'Поле обязательно для заполнения')
	// 	.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	// estimatedIndex: z
	// 	.string()
	// 	.min(1, 'Поле обязательно для заполнения')
	// 	.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	// estimatedIndexValue: z
	// 	.string()
	// 	.min(1, 'Поле обязательно для заполнения')
	// 	.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	// heavySingleWall: z.array(z.record(z.string(), heavySingleWallDataSchema.optional())),
});

export type ConstructionsAddSchemaType = z.infer<typeof ConstructionsAddSchema>;
export type ConstructionsEditSchemaType = z.infer<typeof ConstructionsEditSchema>;
export type ConstructionsFilterSchemaType = z.infer<typeof ConstructionsFilterSchema>;
