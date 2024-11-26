import {
	Button,
	Input,
	LogoIcon,
	LogoTextIcon,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
} from '@core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AUTH_FETCH_ROUTES, AUTH_ROUTES } from '../../../constants';
import { smsCodeApprove, smsCodeRequest } from '../../../services';
import { ApproveFormData } from '../../../types';
import { ApproveFormDataConfig } from '../../../utils';

export const CodeConfirmPage = () => {
	const navigate = useAppNavigate();
	const dispatch = useAppDispatch();
	const authData = useAppSelector((store) => store.authData);
	const ApproveButton = () => {
		return (
			<Button
				disabled={
					!!formState.errors.phoneNumber?.message ||
					form.watch('phoneNumber').length < 10 ||
					form.watch('phoneNumber').includes('_')
				}
				variant="primary"
				className="absolute right-[2px] h-[36px]"
				type="button"
				onClick={() => onSubmit('code')}
			>
				Подтвердить номер телефона
			</Button>
		);
	};

	const form = useForm<ApproveFormData>({
		resolver: zodResolver(ApproveFormDataConfig.schema),
		defaultValues: ApproveFormDataConfig.defaultValues,
	});

	useEffect(() => {
		authData.fetch_data?.fetch_name === AUTH_FETCH_ROUTES.smsApprove.fetch_name &&
			navigate(`/auth/${AUTH_ROUTES.company_registration.route}`, {
				phoneNumber: form.getValues('phoneNumber'),
			});
	}, [authData.fetch_data?.fetch_name]);

	const onSubmit = (type: string) => {
		type === 'code'
			? dispatch(smsCodeRequest(form.getValues('phoneNumber').replaceAll(' ', '')))
			: dispatch(
					smsCodeApprove({
						phoneNumber: form.getValues('phoneNumber').replaceAll(' ', ''),
						code: form.getValues('code').replaceAll('-', ''),
					}),
				);
		// navigate(`/auth/${AUTH_ROUTES.company_registration.route}`, {
		// 	phoneNumber: form.getValues('phoneNumber'),
		// });
	};
	const { formState } = form;

	return (
		<FormProvider {...form}>
			<div className="flex w-[508px] flex-col gap-[23px] rounded-[12px] border border-gray-border bg-white px-[32px] py-[23px]">
				<div className="flex h-[64px] flex-row items-center justify-center gap-[10px]">
					<LogoIcon />
					<LogoTextIcon />
				</div>
				<form onSubmit={form.handleSubmit(() => onSubmit('submit'))}>
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
