import { z } from 'zod';

const AccountDataSchema = z.object({
	id: z.string().optional(),
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
	payersRegistrationNumber: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.min(9, 'УНП должен содержать 9 символов'),
	paymentAccount: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.min(28, 'Расчетный счет должен содержать 28 символов'),
	bankIdNumber: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.min(8, 'БИК должен содержать 8 символов'),
	bankAddress: z.string().min(1, 'Поле обязательно для заполнения'),
	compannyInfo: z.string().min(1, 'Поле обязательно для заполнения'),
	companyLogo: z.string().optional(),
	formFile: z.any().refine((file) => file instanceof File && file.size > 0, 'Логотип не выбран'),
	password: z
		.string()
		.regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
		.regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
		.regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
		.regex(/[@$!%*?&#]/, 'Пароль должен содержать хотя бы один специальный символ')
		.optional(),
	secondPassword: z.string().optional(),
});

type AccountDataSchemaType = z.infer<typeof AccountDataSchema>;

export { AccountDataSchema, type AccountDataSchemaType };
