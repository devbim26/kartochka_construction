import { RequirementsSchema } from '@features/guidbooks/utils';
import { z } from 'zod';

export const AboutBuildingSchema = z.object({
	reportInfoId: z.string().optional(),
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	region: z.string().min(1, 'Поле обязательно для заполнения'),
	commonDescription: z.string().nullable().optional(),
	buildingPurpose: z.string().min(1, 'Поле обязательно для заполнения'),
	buildingType: z.string().min(1, 'Поле обязательно для заполнения'),
	maxHeight: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => Number.isInteger(Number(value)), 'Значение должно быть целым числом')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	comfortClass: z.string().min(1, 'Поле обязательно для заполнения'),
	regulatoryDocumentId: z.string().min(1, 'Поле обязательно для заполнения'),
	calculationDocumentId: z.string().min(1, 'Поле обязательно для заполнения'),
	isFloorPlan: z.boolean(),
	isConstruction: z.boolean(),
	isBim: z.boolean(),
});

export const ReportInfoShortScheme = z.object({
	reportInfoId: z.string().optional(),
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	region: z.string().min(1, 'Поле обязательно для заполнения'),
	commonDescription: z.string().nullable().optional(),
	buildingPurpose: z.string().min(1, 'Поле обязательно для заполнения'),
	buildingType: z.string().min(1, 'Поле обязательно для заполнения'),
	maxHeight: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => Number.isInteger(Number(value)), 'Значение должно быть целым числом')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	comfortClass: z.string().min(1, 'Поле обязательно для заполнения'),
	calculationRequirement: RequirementsSchema.optional(),
	regulatoryRequirement: RequirementsSchema.optional(),

	regulatoryDocument: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			country: z.string().optional(),
			fullName: z.string().optional(),
		})
		.optional(),
	calculationDocument: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
			country: z.string().optional(),
			fullName: z.string().optional(),
		})
		.optional(),
	isFloorPlan: z.boolean(),
	isConstruction: z.boolean(),
	isBim: z.boolean(),
});
export type ReportInfoShort = z.infer<typeof ReportInfoShortScheme>;
export type AboutBuildingSchemaType = z.infer<typeof AboutBuildingSchema>;
