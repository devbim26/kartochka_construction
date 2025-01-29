import { LogoBelniis, LogoIcon, LogoTextIcon } from '@core';

export const AboutUsComponent = () => {
	return (
		<div className="flex w-[73.18%] flex-col bg-white py-[50px]" id="aboutUs">
			<div className="mb-[20px] flex font-montserrat text-[20px] font-normal leading-[24px]">
				О нас
			</div>
			<div className="flex flex-row gap-[82px]">
				<div className="flex flex-col">
					<div className="mb-[13px] flex font-montserrat text-[40px] font-semibold leading-[49px]">
						«ТрансАкустик» объединяет экспертов
					</div>
					<div className="flex font-montserrat text-[20px] leading-[24px]">
						с многолетним опытом и глубокой экспертизой в области теоретических
						исследований и практического применения строительных решений на реальных
						объектах. Все наши решения подтверждены аккредитованными лабораториями, что
						гарантирует высокое качество и эффективное управление бюджетом
					</div>
				</div>
				<div className="flex flex-col items-center">
					<div className="mb-[23px] flex flex-row items-center gap-[12px]">
						<LogoIcon className="h-[67px] w-[65px]" />
						<LogoTextIcon className="h-[88px] w-[232px]" />
					</div>
					<LogoBelniis className="mb-[11px]" />
					<div className="flex text-center font-montserrat text-[14px] leading-[12px]">
						&quot;Республиканский научно-исследовательский институт в отрасли
						строительства. Беларусь&quot;
					</div>
				</div>
			</div>
		</div>
	);
};
