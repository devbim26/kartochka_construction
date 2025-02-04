import { z } from 'zod';

const IssuersSchema = z.object({
	id: z.string().optional(),
	name: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.max(50, 'Название не должно превышать 50 символов'),
	country: z.string().min(1, 'Поле обязательно для заполнения'),
	logoUrl: z.string().optional(),
	webSite: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.max(50, 'Ссылка не должна превышать 50 символов'),
});

const FormIssuerSchema = IssuersSchema.omit({
	logoUrl: true,
}).extend({
	logoUrl: z.string().min(1, 'Поле обязательно для заполнения'),
});

type IssuersDataSchemaType = z.infer<typeof IssuersSchema>;
type FormIssuerDataSchemaType = z.infer<typeof FormIssuerSchema>;
export {
	IssuersSchema,
	type IssuersDataSchemaType,
	type FormIssuerDataSchemaType,
	FormIssuerSchema,
};
