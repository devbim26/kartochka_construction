import { z } from 'zod';
const LoginFormDataSchema = z.object({
	phoneNumber: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => !value.includes('_'), 'Неверный формат номера телефона'),
	password: z.string().min(1, 'Пароль обязателен для заполнения'),
});

type LoginFormDataSchemaType = z.infer<typeof LoginFormDataSchema>;

const ApproveFormDataSchema = z.object({
	phoneNumber: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.min(10, 'Неверный формат номера телефона')
		.refine((value) => !value.includes('_'), 'Неверный формат номера телефона'),
	code: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.min(4, 'Неверный формат кода подтверждения')
		.refine((value) => !value.includes('_'), 'Неверный формат кода подтверждения'),
});

type ApproveFormDataSchemaType = z.infer<typeof ApproveFormDataSchema>;

const RegistrationFormDataSchema = z
	.object({
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
		password: z
			.string()
			.min(1, 'Поле обязательно для заполнения')
			.min(8, 'Пароль должен содержать не менее 8 символов')
			.regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
			.regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
			.regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
			.regex(/[@$!%*?&#]/, 'Пароль должен содержать хотя бы один специальный символ'),
		secondPassword: z.string().min(1, 'Поле обязательно для заполнения'),
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
	})
	.superRefine(({ password, secondPassword }, ctx) => {
		if (password !== secondPassword) {
			ctx.addIssue({
				path: ['secondPassword'],
				code: z.ZodIssueCode.custom,
				message: 'Пароли должны совпадать',
			});
		}
	});

type RegistrationFormDataSchemaType = z.infer<typeof RegistrationFormDataSchema>;

export {
	LoginFormDataSchema,
	RegistrationFormDataSchema,
	ApproveFormDataSchema,
	type RegistrationFormDataSchemaType,
	type LoginFormDataSchemaType,
	type ApproveFormDataSchemaType,
};
