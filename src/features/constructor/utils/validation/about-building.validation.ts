import { RequirementsSchema } from '@features/guidbooks/utils';
import { z } from 'zod';

export const AboutBuildingSchema = z.object({
	reportInfoId: z.string().optional(),
	name: z.string().min(1, 'validation.required'),
	region: z.string().min(1, 'validation.required'),
	commonDescription: z.string().nullable().optional(),
	buildingPurpose: z.string().min(1, 'validation.required'),
	buildingType: z.string().min(1, 'validation.required'),
	maxHeight: z
		.string()
		.min(1, 'validation.required')
		.refine((value) => Number.isInteger(Number(value)), 'validation.integer')
		.refine((value) => +value > 0, 'validation.positiveNumber'),
	comfortClass: z.string().min(1, 'validation.required'),
	regulatoryDocumentId: z.string().min(1, 'validation.required'),
	calculationDocumentId: z.string().min(1, 'validation.required'),
	isFloorPlan: z.boolean(),
	isConstruction: z.boolean(),
	isBim: z.boolean(),
});

export const ReportInfoShortScheme = z.object({
	reportInfoId: z.string().optional(),
	name: z.string().min(1, 'validation.required'),
	region: z.string().min(1, 'validation.required'),
	commonDescription: z.string().nullable().optional(),
	buildingPurpose: z.string().min(1, 'validation.required'),
	buildingType: z.string().min(1, 'validation.required'),
	maxHeight: z
		.string()
		.min(1, 'validation.required')
		.refine((value) => Number.isInteger(Number(value)), 'validation.integer')
		.refine((value) => +value > 0, 'validation.positiveNumber'),
	comfortClass: z.string().min(1, 'validation.required'),
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
