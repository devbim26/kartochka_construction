import { z } from 'zod';

const AboutBuildingSchema = z.object({
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	region: z.string().min(1, 'Поле обязательно для заполнения'),
	buildingPurpose: z.string().min(1, 'Поле обязательно для заполнения'),
	buildingType: z.string().min(1, 'Поле обязательно для заполнения'),
	maxHeight: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => Number.isInteger(Number(value)), 'Значение должно быть целым числом')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	comfortClass: z.string().min(1, 'Поле обязательно для заполнения'),
	isFloorPlan: z.boolean(),
	isBim: z.boolean(),
});

const FloorPlanSchema = z.object({
	floorPlanFile: z
		.any()
		.refine((file) => file instanceof File && file.size > 0, 'Поле обязательно для заполнения')
		.refine((file) => file.type === 'application/pdf', 'Файл должен быть в формате PDF'),
	floorPlanPdf: z.string().min(1, 'Поле обязательно дляя заполнения'),
});

type AboutBuildingDataSchemaType = z.infer<typeof AboutBuildingSchema>;
type FloorPlanSchemaType = z.infer<typeof FloorPlanSchema>;

export {
	AboutBuildingSchema,
	FloorPlanSchema,
	type AboutBuildingDataSchemaType,
	type FloorPlanSchemaType,
};
