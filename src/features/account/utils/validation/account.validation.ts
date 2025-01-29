import { z } from 'zod';

const AccountDataSchema = z.object({
	mainPhoneNumber: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => !value.includes('_'), 'Неверный формат номера телефона'),
	phoneNumbers: z.array(
		z.object({
			number: z
				.string()
				.min(1, 'Поле обязательно для заполнения')
				.refine((value) => !value.includes('_'), 'Неверный формат номера телефона'),
			id: z.string(),
		}),
	),
	companyName: z.string().min(1, 'Поле обязательно для заполнения'),
	directorFullName: z.string().min(1, 'Поле обязательно для заполнения'),
	companyAddress: z.string().min(1, 'Поле обязательно для заполнения'),
	payersRegistrationNumber: z.string().min(1, 'Поле обязательно для заполнения'),
	paymentAccount: z.string().min(1, 'Поле обязательно для заполнения'),
	bankIdNumber: z.string().min(1, 'Поле обязательно для заполнения'),
	bankAddress: z.string().min(1, 'Поле обязательно для заполнения'),
	companyLogo: z.object({
		name: z.string().min(1, 'Логотип не выбран'),
		data: z.union([z.string(), z.instanceof(ArrayBuffer)]).optional(),
		url: z.string().optional(),
	}),
	compannyInfo: z.string().optional(),
});

type AccountDataSchemaType = z.infer<typeof AccountDataSchema>;

export { AccountDataSchema, type AccountDataSchemaType };
