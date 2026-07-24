import {
	isFloorConstructionType,
	ZPanelConstructionTypeValues,
} from '@features/guidbooks/types';
import { z } from 'zod';

const Z_PANEL_CONSTRUCTION_TYPES = new Set<string>(ZPanelConstructionTypeValues);

const isGeneralIssuerName = (name?: string | null) => {
	const n = (name ?? '').trim().toLowerCase();
	return n === 'общий' || n === 'general';
};

const zPanelRequiresBrandIssuerRefine = (
	data: { constructionType: string; issuerName?: string | null },
	ctx: z.RefinementCtx,
) => {
	if (!Z_PANEL_CONSTRUCTION_TYPES.has(data.constructionType)) {
		return;
	}
	if (isGeneralIssuerName(data.issuerName)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'guides.constructions.zPanelRequiresBrandIssuer',
			path: ['issuer'],
		});
	}
};

export const ConstructionsFilterSchema = z.object({
	name: z.string(),
	constructionType: z.string(),
	constructionPurpose: z.string().optional(),
	country: z.string(),
	priority: z.string(),
	rw: z.string(),
	lnw: z.string(),
});

export const MaterialTypeValues = z.object({
	value: z.string().min(1, 'validation.required'),
	materialParameters: z.string().min(1, 'validation.required'),
});

export const UserMaterial = z.object({
	materialId: z.string().min(1, 'validation.required'),
	materialName: z.string().optional(),
	positionId: z.string().min(1, 'validation.required'),
	additionalName: z.string().optional().nullable(),
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

const labRTotalFieldSchema = z
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
	}, 'validation.labRTotalNumbers');

export const laboratoryDataBlockSchema = z.object({
	labRTotal: labRTotalFieldSchema,
	labIndex: z.string().min(1, 'validation.required'),
	labIndexValue: z.string().optional(),
	laboratoryC: z.string().optional(),
	laboratoryCtr: z.string().optional(),
	laboratoryTestSource: z.string().min(1, 'validation.required'),
});

/** Для ударного блока на стенах поля могут быть пустыми — строгая проверка только для перекрытий. */
const laboratoryDataBlockLooseSchema = z.object({
	labRTotal: z.string(),
	labIndex: z.string(),
	labIndexValue: z.string().optional(),
	laboratoryC: z.string().optional(),
	laboratoryCtr: z.string().optional(),
	laboratoryTestSource: z.string(),
});

export const ConstructionTypeShema = z.object({
	constructionTypeEnum: z.string().min(1, 'validation.required'),
	leftConstruction: z.array(UserMaterial).optional().nullable(),
	centerConstruction: z.array(UserMaterial).optional().nullable(),
	rightConstruction: z.array(UserMaterial).optional().nullable(),
});

export type ConstructionTypeSchemaType = z.infer<typeof ConstructionTypeShema>;

export const ConstructionAdditionalInfoSchema = z.object({
	suppliers: z.string().optional(),
	standartName: z.string().optional(),
	composition: z.string().optional(),
	features: z.string().optional(),
	physicalCharacteristics: z.string().optional(),
	fireSafetyAndMore: z.string().optional(),
	installation: z.string().optional(),
	fileUrls: z
		.array(
			z.object({
				name: z.string().optional().nullable(),
				url: z.string().optional().nullable(),
			}),
		)
		.optional(),
	imageUrls: z
		.array(
			z.object({
				name: z.string().optional().nullable(),
				url: z.string().optional().nullable(),
			}),
		)
		.optional(),
	files: z.array(z.any()).optional(),
	images: z.array(z.any()).optional(),
});

const constructionsAddShape = z.object({
	id: z.string().optional(),
	name: z.string().optional().nullable(),
	description: z.string().min(1, 'validation.required'),
	priority: z.string().min(1, 'validation.required'),
	descriptionSource: z.string().min(1, 'validation.required'),
	country: z.array(z.string().min(1, 'validation.required')).min(1, 'validation.required'),
	constructionType: z.string().min(1, 'validation.required'),
	constructionPurpose: z.string().min(1, 'validation.required'),
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
	airLaboratory: laboratoryDataBlockSchema,
	impactLaboratory: laboratoryDataBlockLooseSchema,
	/** Поля списка (фильтр / таблица), при создании не отправляются на сервер */
	rw: z.string().optional(),
	lnw: z.string().optional(),
	/** Доступна ли конструкция бесплатному (default) пользователю — настройка в справочнике */
	isViewForDefaultUser: z.boolean().optional(),
	/** Доступна ли конструкция текущему пользователю в пагинированном списке (модалка) */
	isView: z.boolean().optional(),
	constructionTypeObject: ConstructionTypeShema,
	reportInfoId: z.string().optional(),
	additionalInfo: ConstructionAdditionalInfoSchema.optional(),
});

const impactLaboratoryRequiredForFloorsRefine = (
	data: z.infer<typeof constructionsAddShape>,
	ctx: z.RefinementCtx,
) => {
	if (!isFloorConstructionType(data.constructionType)) return;
	const parsed = laboratoryDataBlockSchema.safeParse(data.impactLaboratory);
	if (parsed.success) return;
	for (const issue of parsed.error.issues) {
		ctx.addIssue({ ...issue, path: ['impactLaboratory', ...issue.path] });
	}
};

export const ConstructionsAddSchema = constructionsAddShape
	.superRefine(zPanelRequiresBrandIssuerRefine)
	.superRefine(impactLaboratoryRequiredForFloorsRefine);

export const ConstructionsEditSchema = constructionsAddShape
	.merge(
		z.object({
			RCalcs: z.string().min(1, 'validation.required'),
			estimatedIndexValue: z.string().min(1, 'validation.required'),
		}),
	)
	.superRefine(zPanelRequiresBrandIssuerRefine)
	.superRefine(impactLaboratoryRequiredForFloorsRefine);

export type ConstructionsAddSchemaType = z.infer<typeof ConstructionsAddSchema>;
export type ConstructionsEditSchemaType = z.infer<typeof ConstructionsEditSchema>;
export type ConstructionsFilterSchemaType = z.infer<typeof ConstructionsFilterSchema>;
