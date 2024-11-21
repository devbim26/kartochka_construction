import { Button, Input, LogoIcon, LogoTextIcon } from '@core';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AUTH_ROUTES } from '../../../constants';
import { ApproveFormData } from '../../../types';
import { ApproveFormDataConfig } from '../../../utils';

export const RegistrationPage = () => {
	const navigate = useNavigate();

	const ApproveButton = () => {
		return (
			<Button
				disabled={!!formState.errors.phoneNumber?.message}
				variant="primary"
				className="absolute right-[2px] h-[36px]"
			>
				Подтвердить номер телефона
			</Button>
		);
	};
	const form = useForm<ApproveFormData>({
		resolver: zodResolver(ApproveFormDataConfig.schema),
		defaultValues: ApproveFormDataConfig.defaultValues,
	});
	const onSubmit = (data: ApproveFormData) => {
		console.log(form);
		navigate('/auth/' + AUTH_ROUTES.company_registration.route);
	};
	const { formState } = form;

	return (
		<FormProvider {...form}>
			<div className="flex w-[508px] flex-col gap-[23px] rounded-[12px] border border-gray-border bg-white px-[32px] py-[23px]">
				<div className="flex h-[64px] flex-row items-center justify-center gap-[10px]">
					<LogoIcon />
					<LogoTextIcon />
				</div>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-[20px]">
						<Input
							label={formState.errors.phoneNumber?.message || 'Номер телефона'}
							labelClassName={
								formState.errors.phoneNumber?.message ? 'text-error' : ''
							}
							{...form.register('phoneNumber')}
							placeholder="+375 (29) 21-21-21"
							mask="+375 (99) 999-99-99"
							Button={ApproveButton}
							error={formState.errors.phoneNumber?.message}
						/>
						<Input
							label={formState.errors.code?.message || 'Код подтверждения'}
							placeholder="0-0-0-0"
							mask="9-9-9-9"
							{...form.register('code')}
							labelClassName={formState.errors.code?.message ? 'text-error' : ''}
							error={formState.errors.code?.message}
						/>
						<Button variant="primary" type="submit" className="h-[36px]">
							Продолжить
						</Button>
					</div>
				</form>
				<div className="flex items-center justify-center gap-[2px] font-sans text-[14px]">
					<p>Есть аккаунт?</p>
					<p
						onClick={() => navigate('/auth/' + AUTH_ROUTES.login.route)}
						className="cursor-pointer font-semibold underline-offset-auto hover:underline"
					>
						Авторизироваться
					</p>
				</div>
			</div>
		</FormProvider>
	);
};
