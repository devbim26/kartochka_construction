import { Button, Input, LogoIcon, LogoTextIcon } from '@core';
import { useNavigate } from 'react-router-dom';
import { AUTH_ROUTES } from '../../../constants';

export const RegistrationPage = () => {
	const navigate = useNavigate();

	const ApproveButton = () => {
		return (
			<Button variant="primary" className="absolute right-[2px] h-[36px]">
				Подтвердить номер телефона
			</Button>
		);
	};

	const handleRegistration = () => {
		navigate('/auth/' + AUTH_ROUTES.company_registration.route);
	};

	return (
		<div className="flex w-[508px] flex-col gap-[23px] rounded-[12px] border-[1px] border-gray-border bg-white px-[32px] py-[23px]">
			<div className="flex h-[64px] flex-row items-center justify-center gap-[10px]">
				<LogoIcon />
				<LogoTextIcon />
			</div>
			<div className="flex flex-col gap-[20px]">
				<Input
					label="Номер телефона"
					placeholder="+375 (29) 21-21-21"
					mask="+375 (99) 999-99-99"
					Button={ApproveButton}
				/>
				<Input label="Код подтверждения" placeholder="000-00000" mask="999-99999" />
				<Button variant="primary" onClick={handleRegistration} className="h-[36px]">
					Зарегистрироваться
				</Button>
			</div>
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
	);
};
