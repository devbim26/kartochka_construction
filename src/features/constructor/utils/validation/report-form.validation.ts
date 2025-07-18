import { z } from 'zod';

export const NamedConstructionFlags = z.object({
	reportConstructionId: z.string().optional(),
	constructionName: z.string().optional().nullable(),
	takeConstruction: z.boolean().optional(),
	takeSoundInsulationCalculation: z.boolean().optional(),
	takeLaboratoryDataAnalisys: z.boolean().optional(),
});

export const BaseReportInfoFlags = z.object({
	namedConstructionFlags: z.array(NamedConstructionFlags).optional().nullable(),
	floorNumber: z.string().optional().nullable(),
	takeFloor: z.boolean().optional(),
});

export const GeneralCharacteristics = z.object({
	takeRoomCharacteristic: z.boolean().optional(),
	takeWallMaterialsVolumesCalculation: z.boolean().optional(),
	takeFloorMaterialsVolumesCalculation: z.boolean().optional(),
});

export const SoundInsulationCalculation = z.object({
	takeEnclosingStructuresSoundInsulationCalculation: z.boolean().optional(),
	baseReportInfoFlags: z.array(BaseReportInfoFlags).optional().nullable(),
});

export const ThermalInsulationCalculation = z.object({
	takeDetailedCalculatingMethod: z.boolean().optional(),
	baseReportInfoFlags: z.array(BaseReportInfoFlags).optional().nullable(),
});

export const FloorDocumentsFlags = z.object({
	takeTitleList: z.boolean().optional(),
	takeContent: z.boolean().optional(),
	takeIntroduction: z.boolean().optional(),
	generalCharacteristics: GeneralCharacteristics.optional(),
	soundInsulationCalculation: SoundInsulationCalculation.optional(),
	thermalInsulationCalculation: ThermalInsulationCalculation.optional(),
	takeConclusion: z.boolean().optional(),
	takeUsedLiteratureList: z.boolean().optional(),
	takeSupplementSoundInsulationProtocolsWithCalculation: z.boolean().optional(),
	takeSupplementThermalInsulationProtocolsWithCalculation: z.boolean().optional(),
});

export const FormReportSchema = z.object({
	reportInfoId: z.string(),
	customerName: z.string().min(1, 'Поле обязательно для заполнения'),
	projectName: z.string().min(1, 'Поле обязательно для заполнения'),
	objectDescription: z.string().min(1, 'Поле обязательно для заполнения'),
	creatorFullName: z.string().min(1, 'Поле обязательно для заполнения'),
	code: z.string().min(1, 'Поле обязательно для заполнения'),
	country: z.string().min(1, 'Поле обязательно для заполнения'),
	director: z.string().min(1, 'Поле обязательно для заполнения'),
	logo: z
		.any()
		.refine((file) => file instanceof File && file.size > 0, 'Поле обязательно для заполнения'),
	logoValue: z.string().min(1, 'Поле обязательно для заполнения'),
	commonProjectName: z.string().min(1, 'Поле обязательно для заполнения'),
	date: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => !value.includes('_'), 'Неверный формат даты')
		.refine((value) => {
			const [year, month, day] = value.split('-').map(Number);
			const date = new Date(year, month - 1, day);
			return (
				date.getFullYear() === year &&
				date.getMonth() === month - 1 &&
				date.getDate() === day
			);
		}, 'Дата указана некорректно'),
	floorDocumentsFlags: FloorDocumentsFlags,
});

export type FormReportSchemaType = z.infer<typeof FormReportSchema>;

export type FloorDocumentsFlagsSchemaType = z.infer<typeof FloorDocumentsFlags>;
