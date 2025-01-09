import { APP_ROUTES, Button } from '@core';
import { useNavigate } from 'react-router-dom';
import { AboutUsComponent } from './about-us.component';
import { HowOurServiceWorks } from './how-our-service-works.component';

export const LandingPage = () => {
	const navigate = useNavigate();
	const handleStartCalc = () => {
		navigate(APP_ROUTES.auth.route);
	};
	return (
		<div className="mt-[23px] flex w-[100%] flex-col items-center">
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
				<Button className="mb-[44px] text-[22px] leading-[27px]" onClick={handleStartCalc}>
					начать расчет
				</Button>
				<div className="flex h-[364px] w-[100%] bg-slate-600"></div>
			</div>
			<AboutUsComponent />
			<HowOurServiceWorks />
		</div>
	);
};
