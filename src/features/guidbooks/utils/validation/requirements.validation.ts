import { z } from 'zod';

const RequirementsSchema = z.object({
	id: z.string().optional(),
	region: z.string().min(1, 'Поле обязательно для заполнения'),
	constructionType: z.string().min(1, 'Поле обязательно для заполнения'),
	class: z.string().min(1, 'Поле обязательно для заполнения'),
	secondPlacementRoom: z.string().min(1, 'Поле обязательно для заполнения'),
	firstPlacementRoom: z.string().min(1, 'Поле обязательно для заполнения'),
	buildingType: z.string().min(1, 'Поле обязательно для заполнения'),
	standartValidityPeriod: z.string().min(1, 'Поле обязательно для заполнения'),
	standartShortName: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.max(50, 'Название не должно превышать 50 символов'),
	standartFullName: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.max(50, 'Название не должно превышать 50 символов'),
	noizeIsolationIndex: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value >= 0, 'Значение должно быть больше нуля'),
	noizeImpactIndex: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value >= 0, 'Значение должно быть больше нуля'),
	notice: z.string().optional(),
});

const RequirementsFilterSchema = z.object({
	region: z.string().min(1, 'Поле обязательно для заполнения'),
	constructionType: z.string().min(1, 'Поле обязательно для заполнения'),
	firstPlacementRoom: z.string().min(1, 'Поле обязательно для заполнения'),
	secondPlacementRoom: z.string().min(1, 'Поле обязательно для заполнения'),
	buildingType: z.string().min(1, 'Поле обязательно для заполнения'),
});

type RequirementsDataSchemaType = z.infer<typeof RequirementsSchema>;
type RequirementsFilterDataSchemaType = z.infer<typeof RequirementsFilterSchema>;

export {
	RequirementsSchema,
	RequirementsFilterSchema,
	type RequirementsDataSchemaType,
	type RequirementsFilterDataSchemaType,
};
