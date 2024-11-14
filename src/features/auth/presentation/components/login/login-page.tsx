import { Button, Input, LogoIcon, LogoTextIcon } from '@core';
import { useState } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

export const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="flex h-[380px] w-[412px] flex-col gap-[23px] rounded-[12px] border-[1px] border-gray-border bg-white px-[32px] py-[21px]">
			<div className="flex h-[64px] flex-row items-center justify-center gap-[10px]">
				<LogoIcon />
				<LogoTextIcon />
			</div>
			<div className="flex flex-col gap-[24px]">
				<Input
					label="Номер телефона"
					placeholder="+375 (29) 21-21-21"
					mask="+375 (99) 999-99-99"
				/>
				<Input
					label="Пароль"
					type={showPassword ? 'password' : 'text'}
					placeholder="Введите пароль"
					Icon={showPassword ? IoMdEyeOff : IoMdEye}
					iconClassName="text-input-label-primary"
					iconPos="right"
					onIconClick={() => setShowPassword(!showPassword)}
				/>
				<Button variant="primary" className="h-[36px]">
					Войти
				</Button>
			</div>
			<div className="flex items-center justify-center gap-[2px] font-sans text-[14px]">
				<p>Нет аккаунта?</p>
				<p className="cursor-pointer font-semibold underline-offset-auto hover:underline">
					Зарегистрироваться
				</p>
			</div>
		</div>
	);
};
