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
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { AUTH_FETCH_ROUTES, AUTH_ROUTES } from '../../../constants';
import { authLogin } from '../../../services';
import { LoginFormData } from '../../../types';
import { LoginFormDataConfig } from '../../../utils';

export const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useAppNavigate();
	const dispatch = useAppDispatch();
	const authData = useAppSelector((store) => store.authData);

	useEffect(() => {
		authData.fetch_data?.fetch_name === AUTH_FETCH_ROUTES.login.fetch_name && navigate('/');
	}, [authData.fetch_data?.fetch_name]);

	useEffect(() => {
		console.log(authData);
	}, [authData]);

	const form = useForm<LoginFormData>({
		resolver: zodResolver(LoginFormDataConfig.schema),
		defaultValues: LoginFormDataConfig.defaultValues,
	});
	const onSubmit = () => {
		dispatch(
			authLogin({
				phoneNumber: form.getValues('phoneNumber').replaceAll(' ', ''),
				password: form.getValues('password'),
			}),
		);
	};
	const { formState } = form;

	return (
		<FormProvider {...form}>
			<div className="flex w-[412px] flex-col gap-[23px] rounded-[12px] border border-gray-border bg-white px-[32px] py-[21px]">
				<div className="flex h-[64px] flex-row items-center justify-center gap-[10px]">
					<LogoIcon />
					<LogoTextIcon />
				</div>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-[24px]">
						<Input
							label={formState.errors.phoneNumber?.message || 'Номер телефона'}
							labelClassName={
								formState.errors.phoneNumber?.message ? 'text-error' : ''
							}
							placeholder="+375 (29) 21-21-21"
							mask="+375 (99) 999-99-99"
							{...form.register('phoneNumber')}
							error={formState.errors.phoneNumber?.message}
						/>
						<Input
							label={formState.errors.password?.message || 'Пароль'}
							labelClassName={formState.errors.password?.message ? 'text-error' : ''}
							type={showPassword ? 'password' : 'text'}
							placeholder="Введите пароль"
							Icon={showPassword ? IoMdEyeOff : IoMdEye}
							iconClassName="text-input-label-primary"
							iconPos="right"
							onIconClick={() => setShowPassword(!showPassword)}
							{...form.register('password')}
							error={formState.errors.password?.message}
						/>
						<Button variant="primary" type="submit" className="h-[36px]">
							Войти
						</Button>
					</div>
				</form>
				<div className="flex items-center justify-center gap-[2px] font-sans text-[14px]">
					<p>Нет аккаунта?</p>
					<p
						onClick={() => navigate('/auth/' + AUTH_ROUTES.code_approve.route)}
						className="cursor-pointer font-semibold underline-offset-auto hover:underline"
					>
						Зарегистрироваться
					</p>
				</div>
			</div>
		</FormProvider>
	);
};
