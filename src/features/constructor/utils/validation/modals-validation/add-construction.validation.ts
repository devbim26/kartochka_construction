import { z } from 'zod';

export const AddConstructionSchema = z.object({
	cipher: z.string().min(1, 'Поле обязательно для заполнения'),
	constructionType: z.string().min(1, 'Поле обязательно для заполнения'),
	firstPlacementRoom: z.string().min(1, 'Поле обязательно для заполнения'),
	secondPlacementRoom: z.string().min(1, 'Поле обязательно для заполнения'),
});

export type AddConstructionSchemaType = z.infer<typeof AddConstructionSchema>;
