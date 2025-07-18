import { ReportCategory } from '@features/constructor/types';
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
	requirement: z.string().min(1, 'Поле обязательно для заполнения'),
	isFloorPlan: z.nativeEnum(ReportCategory),
	isBim: z.boolean(),
});

export type AboutBuildingSchemaType = z.infer<typeof AboutBuildingSchema>;
