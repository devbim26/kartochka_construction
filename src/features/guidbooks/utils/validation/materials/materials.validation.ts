import { z } from 'zod';

export const MaterialsAddAndEditSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	description: z.string().min(1, 'Поле обязательно для заполнения'),
	shortName: z.string().min(1, 'Поле обязательно для заполнения'),
	editFile: z.boolean(),
	density: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	thickness: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	materialType: z.string().min(1, 'Поле обязательно для заполнения'),
	materialPurpose: z.string().min(1, 'Поле обязательно для заполнения'),
	country: z
		.array(z.string().min(1, 'Поле обязательно для заполнения'))
		.min(1, 'Поле обязательно для заполнения'),
	type: z.string().min(1, 'Поле обязательно для заполнения'),
	issuer: z.string().min(1, 'Поле обязательно для заполнения'),
	imageUrl: z.string().min(1, 'Поле обязательно для заполнения'),
	relativeCompression: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	edin: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	imageFile: z
		.any()
		.refine((file) => file instanceof File && file.size > 0, 'Поле обязательно для заполнения'),
	materialCoefficient: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	velocity: z
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
		.refine((value) => +value <= 100, 'Значение должно быть меньше или равно ста'),
	fb: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	fc: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	rb: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	rc: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
});

export const MaterialsFilterSchema = z.object({
	name: z.string().optional(),
	density: z.string().optional(),
	thickness: z.string().optional(),
	materialType: z.string().optional(),
	materialPurpose: z.string().optional(),
});

export type MaterialsAddAndEditSchemaType = z.infer<typeof MaterialsAddAndEditSchema>;
export type MaterialsFilterSchemaType = z.infer<typeof MaterialsFilterSchema>;
