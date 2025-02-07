import { z } from 'zod';

const IssuersSchema = z.object({
	id: z.string().optional(),
	name: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.max(50, 'Название не должно превышать 50 символов')
		.nullable(),
	country: z.string().min(1, 'Поле обязательно для заполнения').nullable(),
	logoUrl: z.string().optional().nullable(),
	webSite: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.max(50, 'Ссылка не должна превышать 50 символов')
		.nullable(),
});

const FormIssuerSchema = z.object({
	id: z.string().optional(),
	name: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.max(50, 'Название не должно превышать 50 символов'),
	country: z.string().min(1, 'Поле обязательно для заполнения'),
	logoUrl: z.string(),
	webSite: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.max(50, 'Ссылка не должна превышать 50 символов'),
});

type IssuersDataSchemaType = z.infer<typeof IssuersSchema>;
type FormIssuerDataSchemaType = z.infer<typeof FormIssuerSchema>;
export {
	IssuersSchema,
	type IssuersDataSchemaType,
	type FormIssuerDataSchemaType,
	FormIssuerSchema,
};
