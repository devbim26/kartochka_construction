import { z } from 'zod';

export const NamedConstructionFlags = z.object({
	reportConstructionId: z.string().optional(),
	constructionName: z.string().optional().nullable(),
	takeConstruction: z.boolean().optional(),
});

export const BaseReportInfoFlags = z.object({
	namedConstructionFlags: z.array(NamedConstructionFlags).optional().nullable(),
	floorNumber: z.string().optional().nullable(),
	takeFloor: z.boolean().optional(),
});

export const SoundInsulationCalculation = z.object({
	takeEnclosingStructuresSoundInsulationCalculation: z.boolean().optional(),
	baseReportInfoFlags: z.array(BaseReportInfoFlags).optional().nullable(),
});

export const FloorDocumentsFlags = z.object({
	takeTitleList: z.boolean().optional(),
	takeContent: z.boolean().optional(),
	takeIntroduction: z.boolean().optional(),
	soundInsulationCalculation: SoundInsulationCalculation.optional(),
	takeConclusion: z.boolean().optional(),
	takeUsedLiteratureList: z.boolean().optional(),
	takeSupplementSoundInsulationProtocolsWithCalculation: z.boolean().optional(),
	takeSupplementSoundInsulationAlternativeProtocols: z.boolean().optional(),
});

const optionalTextField = z.string().optional().or(z.literal(''));

export const FormReportSchema = z.object({
	reportInfoId: z.string(),
	customerName: optionalTextField,
	projectName: optionalTextField,
	objectDescription: optionalTextField,
	creatorFullName: optionalTextField,
	code: optionalTextField,
	country: optionalTextField,
	director: optionalTextField,
	logo: z.any().optional(),
	logoValue: optionalTextField,
	commonProjectName: optionalTextField,
	date: optionalTextField
		.refine((value) => !value || !value.includes('_'), 'Неверный формат даты')
		.refine((value) => {
			if (!value) return true;
			const [year, month, day] = value.split('-').map(Number);
			const date = new Date(year, month - 1, day);
			return (
				date.getFullYear() === year &&
				date.getMonth() === month - 1 &&
				date.getDate() === day
			);
		}, 'Дата указана некорректно'),
	floorDocumentFlags: FloorDocumentsFlags,
});

export type FormReportSchemaType = z.infer<typeof FormReportSchema>;

export type FloorDocumentsFlagsSchemaType = z.infer<typeof FloorDocumentsFlags>;
