import { z } from 'zod';

export const MaterialsAddAndEditSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	description: z.string().min(1, 'Поле обязательно для заполнения'),
	shortName: z.string().min(1, 'Поле обязательно для заполнения'),
	/** true — на сервер уйдёт новый файл; false — оставить текущее изображение. */
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
	/** Имя производителя из списка (не обязательно в форме создания). */
	issuerName: z.string().optional(),
	/** Изображение материала необязательно. */
	imageUrl: z.string().optional().nullable(),
	imageFile: z.any().optional().nullable(),
	/** Остальные физ. параметры опциональны — при пустом значении на сервер уходит 0. */
	relativeCompression: z.string().optional(),
	edin: z.string().optional(),
	materialCoefficient: z.string().optional(),
	velocity: z.string().optional(),
	lossFactor: z.string().optional(),
	youngModulus: z.string().optional(),
	damping: z.string().optional(),
	solid: z.string().optional(),
	fb: z.string().optional(),
	fc: z.string().optional(),
	rb: z.string().optional(),
	rc: z.string().optional(),
});

export const MaterialsFilterSchema = z.object({
	name: z.string().optional(),
	density: z.string().optional(),
	thickness: z.string().optional(),
	materialType: z.string().optional(),
	materialPurpose: z.string().optional(),
	/** null — все; true — только общий производитель; false — только брендовые. */
	isCommonMaterials: z.boolean().nullable().optional(),
});

export type MaterialsAddAndEditSchemaType = z.infer<typeof MaterialsAddAndEditSchema>;
export type MaterialsFilterSchemaType = z.infer<typeof MaterialsFilterSchema>;
