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
		<div className="flex w-full flex-col items-center bg-white px-4 sm:px-6 lg:px-10">
			<div className="mb-[10px] w-full max-w-[1024px] text-center sm:mb-[15px]">
				<span className="font-montserrat text-[26px] font-bold leading-[32px] sm:text-[30px] sm:leading-[38px] md:text-[35px] md:leading-[43px]">
					Комплексные решения в строительстве
				</span>
			</div>
			<div className="mb-[25px] w-full max-w-[700px] text-center sm:mb-[40px]">
				<span className="font-montserrat text-[16px] leading-[20px] sm:text-[18px] sm:leading-[22px] md:text-[20px] md:leading-[24px]">
					Автоматизация подбора конструкций и выполнение рутинных расчетов
				</span>
			</div>
			<Button
				className="mb-[30px] text-[18px] leading-[22px] sm:mb-[44px] sm:text-[20px] sm:leading-[25px] md:text-[22px] md:leading-[27px]"
				onClick={handleStart}
			>
				{isAuthenticated ? 'начать проектирование' : 'начать расчет'}
			</Button>
			<img
				src={LandingGif}
				alt="GIF"
				className="max-h-[400px] w-full object-cover md:max-h-[500px]"
			/>
		</div>
	);
};
