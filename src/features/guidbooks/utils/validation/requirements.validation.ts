import { ConstructionClass } from '@features/guidbooks/types';
import { z } from 'zod';

const RequirementsSchema = z.object({
	id: z.string().optional(),
	countryType: z.string().min(1, 'Поле обязательно для заполнения'),
	constructionType: z.string().min(1, 'Поле обязательно для заполнения'),
	class: z.string().min(1, 'Поле обязательно для заполнения'),
	secondPlacementRoom: z.string().min(1, 'Поле обязательно для заполнения'),
	firstPlacementRoom: z.string().min(1, 'Поле обязательно для заполнения'),
	buildingType: z.string().min(1, 'Поле обязательно для заполнения'),
	standartValidityPeriod: z.string().min(1, 'Поле обязательно для заполнения'),
	standartShortName: z.string().min(1, 'Поле обязательно для заполнения'),
	standartFullName: z.string().min(1, 'Поле обязательно для заполнения'),
	requirementType: z.string().min(1, 'Поле обязательно для заполнения'),
	noizeIsolationIndex: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => Number.isInteger(Number(value)), 'Значение должно быть целым числом')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	noizeImpactIndex: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => Number.isInteger(Number(value)), 'Значение должно быть целым числом')
		.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
	notice: z.string().optional(),
});

const RequirementsFormSchema = z
	.object({
		id: z.string().optional(),
		countryType: z.string().min(1, 'Поле обязательно для заполнения'),
		constructionType: z.string().min(1, 'Поле обязательно для заполнения'),
		class: z.string().min(1, 'Поле обязательно для заполнения'),
		secondPlacementRoomId: z.string().min(1, 'Поле обязательно для заполнения'),
		requirementType: z.string().min(1, 'Поле обязательно для заполнения'),
		firstPlacementRoomId: z.string().min(1, 'Поле обязательно для заполнения'),
		buildingType: z.string().min(1, 'Поле обязательно для заполнения'),
		standartValidityPeriod: z
			.string()
			.min(1, 'Поле обязательно для заполнения')
			.refine((value) => !value.includes('_'), 'Неверный формат даты')
			.refine((value) => {
				const [year, month, day] = value.split('-').map(Number);
				const date = new Date(year, month - 1, day);
				return (
					date.getFullYear() === year &&
					date.getMonth() === month - 1 &&
					date.getDate() === day
				);
			}, 'Дата указана некорректно'),

		standartShortName: z.string().min(1, 'Поле обязательно для заполнения'),
		standartFullName: z.string().min(1, 'Поле обязательно для заполнения'),
		noizeIsolationIndex: z
			.string()
			.min(1, 'Поле обязательно для заполнения')
			.refine((value) => Number.isInteger(Number(value)), 'Значение должно быть целым числом')
			.refine((value) => +value > 0, 'Значение должно быть больше нуля'),
		noizeImpactIndex: z.string().optional(),
		notice: z.string().optional(),
	})
	.refine((data) => {
		if (data.constructionType == ConstructionClass.Floor) {
			const value = data.noizeImpactIndex;
			if (!value) {
				throw new z.ZodError([
					{
						message: 'Поле обязательно для заполнения',
						path: ['noizeImpactIndex'],
						code: 'custom',
					},
				]);
			}
			if (!Number.isInteger(Number(value))) {
				throw new z.ZodError([
					{
						message: 'Значение должно быть целым числом',
						path: ['noizeImpactIndex'],
						code: 'custom',
					},
				]);
			}
			if (+value <= 0) {
				throw new z.ZodError([
					{
						message: 'Значение должно быть больше нуля',
						path: ['noizeImpactIndex'],
						code: 'custom',
					},
				]);
			}
		}
		return true;
	});

const RequirementsFilterSchema = z.object({
	countryType: z.string(),
	firstPlacementRoom: z.string(),
	secondPlacementRoom: z.string(),
	buildingType: z.string(),
});

type RequirementsDataSchemaType = z.infer<typeof RequirementsSchema>;
type RequirementsFormDataSchemaType = z.infer<typeof RequirementsFormSchema>;
type RequirementsFilterDataSchemaType = z.infer<typeof RequirementsFilterSchema>;

export {
	RequirementsSchema,
	RequirementsFilterSchema,
	RequirementsFormSchema,
	type RequirementsFormDataSchemaType,
	type RequirementsDataSchemaType,
	type RequirementsFilterDataSchemaType,
};
