import { z } from 'zod';

export const ThicknessDensityFieldsTypeSchema = z.object({
	thickness: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	density: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
});

export const PointConnectionsFieldsTypeSchema = z.object({
	pointConnections: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля')
		.refine((value) => Number.isInteger(value), 'Значение должно быть целым числом'),
});

export const WidthRacksStepFieldsTypeSchema = z.object({
	width: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	racksStep: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
});

export type ThicknessDensityFieldsTypeSchemaType = z.infer<typeof ThicknessDensityFieldsTypeSchema>;
export type PointConnectionsFieldsTypeSchemaType = z.infer<typeof PointConnectionsFieldsTypeSchema>;
export type WidthRacksStepFieldsTypeSchemaType = z.infer<typeof WidthRacksStepFieldsTypeSchema>;
