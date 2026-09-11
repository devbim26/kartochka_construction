import { z } from 'zod';
import { isRichTextEmpty } from '../html-text.utils';

const requiredMessage = 'Поле обязательно для заполнения';

const NewsSchema = z
	.object({
		id: z.string().optional(),
		title: z.string().min(1, requiredMessage),
		bodyText: z.string().refine((value) => !isRichTextEmpty(value), requiredMessage),
		publishDate: z
			.string()
			.min(1, requiredMessage)
			.refine((value) => !value.includes('_'), requiredMessage),
		imageUrl: z.union([z.string(), z.literal('')]).optional().nullable(),
		imageFile: z.any().optional().nullable(),
	})
	.superRefine((data, ctx) => {
		const hasFile = data.imageFile instanceof File && data.imageFile.size > 0;
		const hasUrl = typeof data.imageUrl === 'string' && data.imageUrl.trim().length > 0;
		if (!hasFile && !hasUrl) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: requiredMessage,
				path: ['imageUrl'],
			});
		}
	});

const NewsFilterSchema = z.object({
	title: z.string().optional(),
	publishDate: z.string().optional(),
});

type NewsDataSchemaType = z.infer<typeof NewsSchema>;
export { NewsFilterSchema, NewsSchema, type NewsDataSchemaType };
