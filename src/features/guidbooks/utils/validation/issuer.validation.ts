import { z } from 'zod';

const IssuersSchema = z.object({
	id: z.string().optional(),
	name: z.string().nullable(),
	country: z.array(z.string().min(1, 'Поле обязательно для заполнения')),
	logoUrl: z
		.any()
		.refine((file) => file instanceof File && file.size > 0, 'Поле обязательно для заполнения'),
	webSite: z.string().nullable(),
});

const FormIssuerSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, 'Поле обязательно для заполнения'),
	country: z.string().min(1, 'Поле обязательно для заполнения'),
	logoUrl: z.string().min(1, 'Поле обязательно для заполнения'),
	webSite: z.string().min(1, 'Поле обязательно для заполнения'),
});

type IssuersDataSchemaType = z.infer<typeof IssuersSchema>;
type FormIssuerDataSchemaType = z.infer<typeof FormIssuerSchema>;
export {
	IssuersSchema,
	type IssuersDataSchemaType,
	type FormIssuerDataSchemaType,
	FormIssuerSchema,
};
