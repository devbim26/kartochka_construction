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
		// <div className="flex w-full flex-col items-center bg-white">
		// 	<div className="mb-[15px] w-[90%] max-w-[600px]">
		// 		<span className="block text-center font-montserrat text-[24px] font-bold leading-[1.2] sm:text-[28px] md:text-[35px] lg:text-[35px] xl:text-[46px]">
		// 			Комплексные решения в строительстве
		// 		</span>
		// 	</div>
		// 	<div className="mb-4 flex w-full max-w-md px-4 sm:px-0">
		// 		<span className="block text-center font-montserrat text-[14px] leading-[1.2] sm:text-[16px] md:text-[20px] lg:text-[20px] xl:text-[24px]">
		// 			Автоматизация подбора конструкций и выполнение рутинных расчетов
		// 		</span>
		// 	</div>
		// 	<Button className="mb-[44px] text-[22px] leading-[27px]" onClick={handleStart}>
		// 		{isAuthenticated ? 'начать проектирование' : 'начать расчет'}
		// 	</Button>
		// 	<img src={LandingGif} alt="GIF" className="w-full object-cover" />
		// </div>
		<div className="relative flex min-h-[500px] w-full items-center overflow-hidden">
			{/* Гифка справа */}
			<img src={LandingGif} alt="GIF" className="absolute right-0 h-full w-3/4" />

			{/* Прозрачная плашка слева, наезжающая на гифку */}
			<div className="relative z-10 ml-[5%] flex h-full w-1/2 rounded-3xl bg-[#74b1f7]/20 p-[20px] backdrop-blur-sm">
				<div className="flex h-[400px] flex-col gap-[30px]">
					<span className="block font-montserrat text-[20px] font-bold leading-[1.2] text-black sm:text-[22px] md:text-[28px] lg:text-[28px] xl:text-[36px]">
						ИНЖЕНЕРНАЯ AI-ПЛАТФОРМА
					</span>
					<span className="block w-1/2 font-montserrat text-[16px] leading-[1.2] text-black sm:text-[18px] md:text-[22px] lg:text-[22px] xl:text-[28px]">
						Автоматизирует расчеты. Проверяет соответствие. Оптимизирует бюджеты.
						Экономит время проектировщиков, дизайнеров и девелоперов
					</span>
					<Button
						className="mt-[130px] w-fit bg-primary text-[25px] leading-[24px]"
						onClick={handleStart}
					>
						{isAuthenticated ? 'Начать' : 'Начать'}
					</Button>
				</div>
			</div>
		</div>
	);
};
