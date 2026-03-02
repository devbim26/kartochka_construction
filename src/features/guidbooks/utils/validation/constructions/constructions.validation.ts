import { z } from 'zod';

export const ConstructionsFilterSchema = z.object({
	name: z.string(),
	constructionType: z.string(),
	description: z.string(),
	country: z.string(),
});

export const MaterialTypeValues = z.object({
	value: z.string().min(1, 'validation.required'),
	materialParameters: z.string().min(1, 'validation.required'),
});

export const UserMaterial = z.object({
	materialId: z.string().min(1, 'validation.required'),
	materialName: z.string().optional(),
	positionId: z.string().min(1, 'validation.required'),
	materialTypeValue: z.array(MaterialTypeValues).optional().nullable(),
	materialType: z.string().min(1, 'validation.required'),
});

export const UserMaterialType = z.object({
	positionId: z.string().min(1, 'validation.required'),
	value: z.string().min(1, 'validation.required'),
});

export const subConstructionSchema = z.object({
	constructionPosition: z.string().min(1, 'validation.required'),
	userMaterials: z.array(UserMaterial).optional().nullable(),
});

export type SubConstructionTypeSchemaType = z.infer<typeof subConstructionSchema>;

export const ConstructionTypeShema = z.object({
	constructionTypeEnum: z.string().min(1, 'validation.required'),
	leftConstruction: z.array(UserMaterial).optional().nullable(),
	centerConstruction: z.array(UserMaterial).optional().nullable(),
	rightConstruction: z.array(UserMaterial).optional().nullable(),
});

export type ConstructionTypeSchemaType = z.infer<typeof ConstructionTypeShema>;

export const ConstructionsAddSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional().nullable(),
	description: z.string().min(1, 'validation.required'),
	priority: z.string().min(1, 'validation.required'),
	descriptionSource: z.string().min(1, 'validation.required'),
	country: z.array(z.string().min(1, 'validation.required')).min(1, 'validation.required'),
	constructionType: z.string().min(1, 'validation.required'),
	issuer: z.string().min(1, 'validation.required'),
	issuerName: z.string().optional(),
	maxHeight: z
		.string()
		.min(1, 'validation.required')
		.refine((value) => +value > 0, 'validation.positiveNumber'),
	fireResistance: z
		.string()
		.min(1, 'validation.required')
		.refine((value) => +value > 0, 'validation.positiveNumber'),
	propertySource: z.string().min(1, 'validation.required'),
	labRTotal: z
		.string()
		.min(1, 'validation.required')
		.refine((value) => {
			const numbers = value.split(',').map((num) => num.trim());
			const isValidCount = numbers.length === 16 || numbers.length === 21;
			return isValidCount;
		}, 'validation.labRTotalCount')
		.refine((value) => {
			const numbers = value.split(',').map((num) => num.trim());
			const areNumbers = numbers.every((num) => !isNaN(parseFloat(num)) && isFinite(+num));
			return areNumbers;
		}, 'validation.labRTotalNumbers'),
	labIndex: z.string().min(1, 'validation.required'),
	labIndexValue: z.string().optional(),
	laboratoryC: z.string().optional(),
	laboratoryCtr: z.string().optional(),
	laboratoryTestSource: z.string().min(1, 'validation.required'),
	constructionTypeObject: ConstructionTypeShema,
	reportInfoId: z.string().optional(),
});

export const ConstructionsEditSchema = ConstructionsAddSchema.merge(
	z.object({
		RCalcs: z.string().min(1, 'validation.required'),
		estimatedIndexValue: z.string().min(1, 'validation.required'),
	}),
);

export type ConstructionsAddSchemaType = z.infer<typeof ConstructionsAddSchema>;
export type ConstructionsEditSchemaType = z.infer<typeof ConstructionsEditSchema>;
export type ConstructionsFilterSchemaType = z.infer<typeof ConstructionsFilterSchema>;
