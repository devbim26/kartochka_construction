import { LandingGif } from '@assets';
import { APP_ROUTES, Button, useAppSelector } from '@core';
import { AUTH_ROUTES } from '@features/auth/constants';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { useNavigate } from 'react-router-dom';

export const PageTop = () => {
	const navigate = useNavigate();
	const isAuthenticated = useAppSelector((store) => store.authData.data?.isAuth);

	const handleStart = () => {
		if (isAuthenticated) {
			navigate(APP_ROUTES.designing.route + '/' + DESIGNING_ROUTES.main.route);
		} else {
			navigate(APP_ROUTES.auth.route + '/' + AUTH_ROUTES.login.route);
		}
	};

	return (
		<div className="flex w-full flex-col items-center bg-white">
			<div className="mb-[15px] w-[90%] max-w-[600px]">
				<span className="block text-center font-montserrat text-[24px] font-bold leading-[1.2] sm:text-[28px] md:text-[35px] lg:text-[35px] xl:text-[46px]">
					Комплексные решения в строительстве
				</span>
			</div>
			<div className="mb-4 flex w-full max-w-md px-4 sm:px-0">
				<span className="block text-center font-montserrat text-[14px] leading-[1.2] sm:text-[16px] md:text-[20px] lg:text-[20px] xl:text-[24px]">
					Автоматизация подбора конструкций и выполнение рутинных расчетов
				</span>
			</div>
			<Button className="mb-[44px] text-[22px] leading-[27px]" onClick={handleStart}>
				{isAuthenticated ? 'начать проектирование' : 'начать расчет'}
			</Button>
			<img src={LandingGif} alt="GIF" className="w-full object-cover" />
		</div>
	);
};
