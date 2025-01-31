import { z } from 'zod';

const MaterialsDataSchema = z.object({
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	description: z.string().min(1, 'Поле обязательно для заполнения'),
	shortName: z.string().min(1, 'Поле обязательно для заполнения'),
	density: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value >= 0, 'Значение должно быть не меньше нуля'),
	thickness: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value >= 0, 'Значение должно быть не меньше нуля'),
	materialType: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value >= 0, 'Значение должно быть не меньше нуля'),
	//тип материала
	//регион
	//тип
	manufacturer: z.string().min(1, 'Поле обязательно для заполнения'),
	// image: z.object({
	// 	name: z.string().min(1, 'Логотип не выбран'),
	// 	data: z.union([z.string(), z.instanceof(ArrayBuffer)]).optional(),
	// 	url: z.string().optional(),
	// }),
	materialCoefficient: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value >= 0, 'Значение должно быть не меньше нуля'),
	speedOfSound: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value >= 0, 'Значение должно быть не меньше нуля'),
	lossFactor: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value >= 0, 'Значение должно быть не меньше нуля'),
	youngModulus: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value >= 0, 'Значение должно быть не меньше нуля'),
	damping: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value >= 0, 'Значение должно быть не меньше нуля'),
	solid: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value >= 0, 'Значение должно быть не меньше нуля')
		.refine((value) => +value <= 100, 'Значение должно быть не больше ста'),
});

type MaterialsDataSchemaType = z.infer<typeof MaterialsDataSchema>;

export { MaterialsDataSchema, type MaterialsDataSchemaType };
