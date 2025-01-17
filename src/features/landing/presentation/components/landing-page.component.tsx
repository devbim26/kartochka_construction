import { LandingGif } from '@assets';
import { Button } from '@core';
import { useNavigate } from 'react-router-dom';
import { AboutUsComponent } from './about-us.component';
import { Contacts } from './contacts.component';
import { FAQ } from './faq.component';
import { Footer } from './footer.component';
import { HowOurServiceWorks } from './how-our-service-works.component';
import { Subscriptions } from './subscriptions.component';

export const LandingPage = () => {
	const navigate = useNavigate();
	const handleStartCalc = () => {
		navigate('/');
	};
	return (
		<div className="mt-[23px] flex w-full flex-col items-center">
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
				<img src={LandingGif} alt="GIF" className="flex w-full" />
			</div>
			<AboutUsComponent />
			<HowOurServiceWorks />
			<Subscriptions />
			<FAQ />
			<Contacts />
			<Footer />
		</div>
	);
};
