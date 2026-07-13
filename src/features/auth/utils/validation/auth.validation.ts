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

const phoneNumberRefine = (value: string) => !value.includes('_');

const registrationPhoneRowSchema = z.object({
	id: z.string(),
	number: z.string(),
});

const registrationFormDataObjectSchema = z.object({
	mainPhoneNumber: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine(phoneNumberRefine, 'Неверный формат номера телефона'),
	phoneNumbers: z.array(registrationPhoneRowSchema).default([]),
	email: z.string().email().min(1, 'Поле обязательно для заполнения'),
	companyName: z.string().optional().default(''),
	directorFullName: z.string().optional().default(''),
	companyAddress: z.string().optional().default(''),
	payersRegistrationNumber: z.string().optional().default(''),
	paymentAccount: z.string().optional().default(''),
	bankIdNumber: z.string().optional().default(''),
	bankAddress: z.string().optional().default(''),
	companyLogo: z.string().optional().default(''),
	formFile: z.any().optional(),
	compannyInfo: z.string().optional().default(''),
});

const refineRegistrationAdditionalPhones = (
	data: z.infer<typeof registrationFormDataObjectSchema>,
	ctx: z.RefinementCtx,
) => {
	data.phoneNumbers.forEach((p, index) => {
		const trimmed = p.number.trim();
		if (trimmed.length === 0) return;
		if (!phoneNumberRefine(p.number)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Неверный формат номера телефона',
				path: ['phoneNumbers', index, 'number'],
			});
		}
	});
};

/** Короткая регистрация: только email и основной телефон; остальное можно заполнить в ЛК. */
const RegistrationFormDataSchema = registrationFormDataObjectSchema.superRefine(
	refineRegistrationAdditionalPhones,
);

/** Полная регистрация: обязательны реквизиты компании; логотип и доп. телефоны — нет. */
const RegistrationFormFullSchema = registrationFormDataObjectSchema
	.merge(
		z.object({
			companyName: z.string().min(1, 'Поле обязательно для заполнения'),
			directorFullName: z.string().min(1, 'Поле обязательно для заполнения'),
			companyAddress: z.string().min(1, 'Поле обязательно для заполнения'),
			payersRegistrationNumber: z.string().min(1, 'Поле обязательно для заполнения'),
			paymentAccount: z.string().min(1, 'Поле обязательно для заполнения'),
			bankIdNumber: z.string().min(1, 'Поле обязательно для заполнения'),
			bankAddress: z.string().min(1, 'Поле обязательно для заполнения'),
			compannyInfo: z.string().min(1, 'Поле обязательно для заполнения'),
		}),
	)
	.superRefine(refineRegistrationAdditionalPhones);

type RegistrationFormDataSchemaType = z.infer<typeof RegistrationFormDataSchema>;
type RegistrationFormFullSchemaType = z.infer<typeof RegistrationFormFullSchema>;

export {
	ApproveFormDataSchema,
	LoginFormDataSchema,
	RegistrationFormDataSchema,
	RegistrationFormFullSchema,
	type ApproveFormDataSchemaType,
	type LoginFormDataSchemaType,
	type RegistrationFormDataSchemaType,
	type RegistrationFormFullSchemaType,
};
