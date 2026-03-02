import { z } from 'zod';

export const CreateConstructionSchema = z.object({
	id: z.string().optional(),
	requirementId: z.string().optional(),
	name: z.string().min(1, 'validation.required'),
	constructionType: z.string().min(1, 'validation.required'),
	construction: z.string().min(1, 'validation.required'),
	firstPlacementRoom: z.string().min(1, 'validation.required'),
	secondPlacementRoom: z.string().min(1, 'validation.required'),
	area: z
		.string()
		.min(1, 'validation.required')
		.refine((value) => Number.isInteger(Number(value)), 'validation.integer')
		.refine((value) => +value > 0, 'validation.positiveNumber'),
	width: z
		.string()
		.min(1, 'validation.required')
		.refine((value) => Number.isInteger(Number(value)), 'validation.integer')
		.refine((value) => +value > 0, 'validation.positiveNumber'),
	length: z
		.string()
		.min(1, 'validation.required')
		.refine((value) => Number.isInteger(Number(value)), 'validation.integer')
		.refine((value) => +value > 0, 'validation.positiveNumber'),
});

export type CreateConstructionSchemaType = z.infer<typeof CreateConstructionSchema>;
