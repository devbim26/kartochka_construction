import { z } from 'zod';

export const ConstructionsFilterSchema = z.object({
	name: z.string(),
	constructionType: z.string(),
	description: z.string(),
	country: z.string(),
});

export const MaterialTypeValues = z.object({
	value: z.string().min(1, 'Обязательно'),
	materialParameters: z.string().min(1, 'Поле обязательно для заполнения'),
});
export const UserMaterial = z.object({
	materialId: z.string().min(1, 'Поле обязательно для заполнения'),
	positionId: z.string().min(1, 'Поле обязательно для заполнения'),
	materialTypeValue: z.array(MaterialTypeValues).optional().nullable(),
	materialType: z.string().min(1, 'Поле обязательно для заполнения'),
});
export const UserMaterialType = z.object({
	positionId: z.string().min(1, 'Поле обязательно для заполнения'),
	value: z.string().min(1, 'Поле обязательно для заполнения'),
});
export const subConstructionSchema = z.object({
	contructionPosition: z.string().min(1, 'Поле обязательно для заполнения'),
	userMaterials: z.array(UserMaterial).optional().nullable(),
});
export const ConstructionTypeShema = z.object({
	constructionTypeEnum: z.string().min(1, 'Поле обязательно для заполнения'),
	constructions: z.array(subConstructionSchema).optional().nullable(),
});

export type ConstructionTypeSchemaType = z.infer<typeof ConstructionTypeShema>;

export const ConstructionsAddSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional().nullable(),
	description: z.string().min(1, 'Поле обязательно для заполнения'),
	priority: z.string().min(1, 'Поле обязательно для заполнения'),
	descriptionSource: z.string().min(1, 'Поле обязательно для заполнения'),
	country: z
		.array(z.string().min(1, 'Поле обязательно для заполнения'))
		.min(1, 'Поле обязательно для заполнения'),
	constructionType: z.string().min(1, 'Поле обязательно для заполнения'),
	issuer: z.string().min(1, 'Поле обязательно для заполнения'),
	issuerName: z.string().optional(),
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
	labIndex: z.string().min(1, 'Поле обязательно для заполнения'),
	labIndexValue: z.string().min(1, 'Поле обязательно для заполнения'),
	laboratoryTestSource: z.string().min(1, 'Поле обязательно для заполнения'),
	constructionTypeObject: ConstructionTypeShema,
});

export const ConstructionsEditSchema = ConstructionsAddSchema.merge(
	z.object({
		RCalcs: z.string().min(1, 'Поле обязательно для заполнения'),
		estimatedIndexValue: z.string().min(1, 'Поле обязательно для заполнения'),
	}),
);

export type ConstructionsAddSchemaType = z.infer<typeof ConstructionsAddSchema>;
export type ConstructionsEditSchemaType = z.infer<typeof ConstructionsEditSchema>;
export type ConstructionsFilterSchemaType = z.infer<typeof ConstructionsFilterSchema>;
