import { z } from 'zod';
import { isValidCompanyPhone, isValidPaymentAccount } from '../company-requisites.utils';

const accountPhoneRowSchema = z.object({
	id: z.string(),
	number: z.string(),
});

const refineAccountAdditionalPhones = (
	data: { phoneNumbers: { number: string }[] },
	ctx: z.RefinementCtx,
) => {
	data.phoneNumbers.forEach((p, index) => {
		const trimmed = p.number.trim();
		if (trimmed.length === 0) return;
		if (trimmed.includes('_')) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Неверный формат номера телефона',
				path: ['phoneNumbers', index, 'number'],
			});
		}
	});
};

const AccountDataSchema = z
	.object({
	id: z.string().optional(),
	email: z.string().email('Некорректный e-mail').optional(),
	mainPhoneNumber: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine((value) => !value.includes('_'), 'Неверный формат номера телефона')
		.refine(isValidCompanyPhone, 'Неверный формат номера телефона'),
	phoneNumbers: z.array(accountPhoneRowSchema),
	companyName: z.string().min(1, 'Поле обязательно для заполнения'),
	directorFullName: z.string().min(1, 'Поле обязательно для заполнения'),
	companyAddress: z.string().min(1, 'Поле обязательно для заполнения'),
	role: z.object({ id: z.string(), name: z.string() }).optional(),
	reportsNumber: z.number().optional(),
	dowloadReportsNumber: z.number().optional(),
	budgetRemaining: z.number().optional(),
	payersRegistrationNumber: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.min(9, 'УНП должен содержать 9 символов'),
	paymentAccount: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.refine(isValidPaymentAccount, 'Неверный формат расчетного счета'),
	bankIdNumber: z
		.string()
		.min(1, 'Поле обязательно для заполнения')
		.min(8, 'БИК должен содержать 8 символов'),
	bankAddress: z.string().min(1, 'Поле обязательно для заполнения'),
	compannyInfo: z.string().min(1, 'Поле обязательно для заполнения'),
	companyLogo: z.string().optional(),
	roleId: z.string().min(1, 'Поле обязательно для заполнения'),
	formFile: z.any().optional(),
})
	.superRefine(refineAccountAdditionalPhones);

type AccountDataSchemaType = z.infer<typeof AccountDataSchema>;

export { AccountDataSchema, type AccountDataSchemaType };
