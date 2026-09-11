import { z } from 'zod';

const IssuersSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().min(1, 'Поле обязательно для заполнения'),
		countries: z
			.array(z.string().min(1, 'Поле обязательно для заполнения'))
			.min(1, 'Поле обязательно для заполнения'),
		logoUrl: z.string().optional().nullable(),
		logoFile: z.any().optional().nullable(),
		/** true — на сервер уйдёт новый файл; false — оставить текущий логотип. */
		editFile: z.boolean().optional().default(false),
		webSite: z.string().min(1, 'Поле обязательно для заполнения'),
	})
	.superRefine((data, ctx) => {
		const hasFile = data.logoFile instanceof File && data.logoFile.size > 0;
		const hasUrl = typeof data.logoUrl === 'string' && data.logoUrl.trim().length > 0;
		if (!hasFile && !hasUrl) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Поле обязательно для заполнения',
				path: ['logoUrl'],
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Поле обязательно для заполнения',
				path: ['logoFile'],
			});
		}
	});

const IssuersFilterSchema = z.object({
	name: z.string().optional(),
	countries: z.any().optional(),
	webSite: z.string().optional(),
});

type IssuersDataSchemaType = z.infer<typeof IssuersSchema>;
export { IssuersFilterSchema, IssuersSchema, type IssuersDataSchemaType };
