import { API_URL } from '@api-gen';
import {
	APP_ROUTES,
	LogoIcon,
	LogoTextIcon,
	phoneNumberMask,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
} from '@core';
import { getCurrentUser } from '@features/account/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMask } from '@react-input/mask';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa6';
import { AUTH_FETCH_ROUTES } from '../../../constants';
import { authLogin } from '../../../services';
import type { LoginFormData } from '../../../types';
import { LoginFormDataConfig } from '../../../utils';

const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useAppNavigate();
	const dispatch = useAppDispatch();
	const authData = useAppSelector((store) => store.authData);

	useEffect(() => {
		if (authData.fetch_data?.fetch_name === AUTH_FETCH_ROUTES.login.fetch_name) {
			dispatch(getCurrentUser());
			navigate(APP_ROUTES.landing.route);
		}
	}, [authData.fetch_data]);

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

	const phoneMaskRef = useMask(phoneNumberMask);

	return (
		<FormProvider {...form}>
			<div className="flex h-full w-[412px] flex-col items-center justify-center gap-[23px] rounded-[12px] border bg-white px-[32px] py-[21px]">
				<div className="flex h-[64px] flex-row items-center justify-center gap-[10px]">
					<LogoIcon />
					<LogoTextIcon />
				</div>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-[24px]">
						{/* <Input
							label={formState.errors.phoneNumber?.message || 'Номер телефона'}
							labelClassName={
								formState.errors.phoneNumber?.message ? 'text-error' : ''
							}
							placeholder="+375 (__) ___-__-__"
							ref={phoneMaskRef}
							onChange={(e) => form.setValue('phoneNumber', e.target.value)}
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
						/> */}
						<a
							href={`${API_URL}test-auth/devbim25@gmail.com`}
							//href={`/api/Auth/login-google`}
							className="flex h-[50px] w-full items-center gap-[10px] rounded-lg border-2 border-primary bg-primary px-[10px] font-montserrat text-[17px] text-white hover:opacity-80"
						>
							<FaGoogle className="size-[30px]" />
							продолжить с Google
						</a>
						{/* <Button variant="primary" type="submit" className="h-[36px]">
							Войти
						</Button> */}
					</div>
				</form>
				<div className="flex items-center justify-center gap-[2px] font-sans text-[14px]">
					<p
						onClick={() => navigate(APP_ROUTES.landing.route)}
						className="cursor-pointer font-semibold underline-offset-auto hover:underline"
					>
						На главную
					</p>
				</div>
			</div>
		</FormProvider>
	);
};

export default LoginPage;
