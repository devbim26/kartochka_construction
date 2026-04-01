import {
	APP_ROUTES,
	LogoIcon,
	LogoTextIcon,
	phoneNumberMask,
	selectIsUserLoggedIn,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
} from '@core';
import { getCurrentUser } from '@features/account/services';
import { DESIGNING_ROUTES } from '@features/home/constants';
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
	const isLoggedIn = useAppSelector(selectIsUserLoggedIn);

	useEffect(() => {
		dispatch(getCurrentUser());
	}, [dispatch]);

	useEffect(() => {
		if (authData.fetch_data?.fetch_name === AUTH_FETCH_ROUTES.login.fetch_name) {
			dispatch(getCurrentUser());
			navigate(`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`);
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
			<div className="flex h-full w-[412px] flex-col items-center justify-center gap-[32px] rounded-[16px] border border-[#e5e7eb] bg-white px-[36px] py-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
				<div className="flex flex-col items-center justify-center gap-[14px] pt-[4px]">
					<div className="flex h-[56px] flex-row items-center justify-center gap-[8px]">
						<LogoIcon className="h-[44px] w-auto" />
						<LogoTextIcon className="h-[18px] w-auto" />
					</div>
					<p className="font-montserrat text-[20px] font-bold tracking-[0.03em] text-[#4b5563]">
						Инженерная AI-платформа
					</p>
				</div>
				<form className="w-full pt-[10px]" onSubmit={form.handleSubmit(onSubmit)}>
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
							// href={`${API_URL}test-auth/anavarich29@gmail.com`}
							href={`/api/Auth/login-google`}
							className="flex h-[52px] w-full items-center justify-center gap-[10px] rounded-xl border-2 border-primary bg-primary px-[14px] font-montserrat text-[17px] font-medium text-white transition-opacity hover:opacity-85"
						>
							<FaGoogle className="size-[24px]" />
							продолжить с Google
						</a>
						{/* <Button variant="primary" type="submit" className="h-[36px]">
							Войти
						</Button> */}
					</div>
				</form>
				<div className="flex items-center justify-center gap-[2px] font-sans text-[14px]">
					<p
						onClick={() =>
							navigate(
								isLoggedIn
									? `${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.main.route}`
									: APP_ROUTES.landing.route,
							)
						}
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
