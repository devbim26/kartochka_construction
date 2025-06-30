import { z } from 'zod';

const NewsSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(1, 'Поле обязательно для заполнения'),
	bodyText: z.string().min(1, 'Поле обязательно для заполнения'),
	publishDate: z.string().min(1, 'Поле обязательно для заполнения'),
	imageUrl: z.string().min(1, 'Поле обязательно для заполнения'),
	imageFile: z
		.any()
		.refine((file) => file instanceof File && file.size > 0, 'Поле обязательно для заполнения'),
});

type NewsDataSchemaType = z.infer<typeof NewsSchema>;
export { NewsSchema, type NewsDataSchemaType };
