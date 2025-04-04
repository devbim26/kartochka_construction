import { z } from 'zod';

export const FloorPlansSchema = z.object({
	floorPlanFile: z
		.any()
		.refine((file) => file instanceof File && file.size > 0, 'Поле обязательно для заполнения')
		.refine((file) => file.type === 'application/pdf', 'Файл должен быть в формате PDF'),
	floorPlanPdf: z.string().min(1, 'Поле обязательно для заполнения'),
});

export type FloorPlansSchemaType = z.infer<typeof FloorPlansSchema>;
