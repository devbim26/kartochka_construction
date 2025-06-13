import { z } from 'zod';

export const DesigningSchema = z.object({
	constructionTypeObject: z.object({
		constructionTypeEnum: z.string().min(1, 'Поле обязательно для заполнения'),
		constructions: z
			.array(
				z.object({
					constructionPosition: z.string().min(1, 'Поле обязательно для заполнения'),
					userMaterials: z
						.array(
							z.object({
								materialId: z.string().min(1, 'Поле обязательно для заполнения'),
								positionId: z.string().min(1, 'Поле обязательно для заполнения'),
								materialTypeValue: z
									.array(
										z.object({
											value: z.string().min(1, 'Обязательно'),
											materialParameters: z
												.string()
												.min(1, 'Поле обязательно для заполнения'),
										}),
									)
									.optional()
									.nullable(),
								materialType: z.string().min(1, 'Поле обязательно для заполнения'),
							}),
						)
						.optional()
						.nullable(),
				}),
			)
			.optional()
			.nullable(),
	}),
});

export type DesigningSchemaType = z.infer<typeof DesigningSchema>;
