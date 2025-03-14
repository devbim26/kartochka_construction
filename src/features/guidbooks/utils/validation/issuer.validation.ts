import { z } from 'zod';

const IssuersSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	countries: z
		.array(z.string().min(1, 'Поле обязательно для заполнения'))
		.min(1, 'Поле обязательно для заполнения'),
	logoUrl: z.string().min(1, 'Поле обязательно для заполнения'),
	logoFile: z
		.any()
		.refine((file) => file instanceof File && file.size > 0, 'Поле обязательно для заполнения'),
	webSite: z.string().min(1, 'Поле обязательно для заполнения'),
});

type IssuersDataSchemaType = z.infer<typeof IssuersSchema>;
export { IssuersSchema, type IssuersDataSchemaType };
