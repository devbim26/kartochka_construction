import { z } from 'zod';

const RequirementsSchema = z.object({
	id: z.string().optional(),
	region: z.string().min(1, 'Поле обязательно для заполнения'),
	construction: z.string().min(1, 'Поле обязательно для заполнения'),
	class: z.string().min(1, 'Поле обязательно для заполнения'),
	secondPlacementRoom: z.string().min(1, 'Поле обязательно для заполнения'),
	firstPlacementRoom: z.string().min(1, 'Поле обязательно для заполнения'),
	buildingType: z.string().min(1, 'Поле обязательно для заполнения'),
	standartShortName: z.string().min(1, 'Поле обязательно для заполнения'),
	standartFullName: z.string().min(1, 'Поле обязательно для заполнения'),
	noizeIsolationIndex: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value >= 0, 'Значение должно быть больше нуля'),
	noizeImpactIndex: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => +value >= 0, 'Значение должно быть больше нуля'),
	notice: z.string().optional(),
	standartValidityPeriod: z.string().min(1, 'Поле обязательно для заполнения'),
});

type RequirementsDataSchemaType = z.infer<typeof RequirementsSchema>;

export { RequirementsSchema, type RequirementsDataSchemaType };
