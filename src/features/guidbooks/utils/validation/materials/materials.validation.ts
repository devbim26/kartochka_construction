import { z } from 'zod';

export const MaterialsAddAndEditDataSchema = z.object({
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	description: z.string().min(1, 'Поле обязательно для заполнения'),
	shortName: z.string().min(1, 'Поле обязательно для заполнения'),
	density: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	thickness: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	materialType: z.string().min(1, 'Поле обязательно для заполнения'),
	region: z.string().min(1, 'Поле обязательно для заполнения'),
	type: z.string().min(1, 'Поле обязательно для заполнения'),
	manufacturer: z.string().min(1, 'Поле обязательно для заполнения'),
	image: z.object({
		name: z.string().min(1, 'Логотип не выбран'),
		data: z.union([z.string(), z.instanceof(ArrayBuffer)]).optional(),
		url: z.string().optional(),
	}),
	materialCoefficient: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	speedOfSound: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	lossFactor: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	youngModulus: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	damping: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	solid: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля')
		.refine((value) => +value < 100, 'Значение должно быть меньше ста'),
});

export const MaterialsFilterDataSchema = z.object({
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	density: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	thickness: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	materialType: z.string().min(1, 'Поле обязательно для заполнения'),
});

export type MaterialsAddAndEditData = z.infer<typeof MaterialsAddAndEditDataSchema>;
export type MaterialsFilterData = z.infer<typeof MaterialsFilterDataSchema>;
