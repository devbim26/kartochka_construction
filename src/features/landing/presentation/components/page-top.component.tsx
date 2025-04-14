import { LandingGif } from '@assets';
import { APP_ROUTES, Button, useAppSelector } from '@core';
import { AUTH_ROUTES } from '@features/auth/constants';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useNavigate } from 'react-router-dom';

export const PageTop = () => {
	const navigate = useNavigate();
	const isAuthenticated = useAppSelector((store) => store.authData.data?.isAuth);
	console.log('isAuthenticated:', isAuthenticated);

	const handleStart = () => {
		if (isAuthenticated) {
			navigate(APP_ROUTES.designing.route + '/' + DESIGNING_ROUTES.main.route);
		} else {
			navigate(APP_ROUTES.auth.route + '/' + AUTH_ROUTES.login.route);
		}
	};

	return (
		<div className="flex w-full flex-col items-center bg-white">
			<div className="mb-[15px] flex w-[35.73%]">
				<span className="text-center font-montserrat text-[35px] font-bold leading-[43px]">
					Комплексные решения в строительстве
				</span>
			</div>
			<div className="mb-[40px] flex w-[35.73%]">
				<span className="text-center font-montserrat text-[20px] leading-[24px]">
					Автоматизация подбора конструкций и выполнение рутинных расчетов
				</span>
			</div>
			<Button className="mb-[44px] text-[22px] leading-[27px]" onClick={handleStart}>
				{isAuthenticated ? 'начать проектирование' : 'начать расчет'}
			</Button>
			<img src={LandingGif} alt="GIF" className="flex w-full" />
		</div>
	);
};
