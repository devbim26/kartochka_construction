import { LogoBelniis, LogoIcon, LogoTextIcon } from '@core';
import { LandingSections } from '@features/landing/constants';

export const AboutUsComponent = () => {
	return (
		<div
			className="w-full bg-white px-6 py-8 xs:px-8 sm:px-12 md:px-14 lg:px-20"
			id={LandingSections.aboutUs.id}
		>
			<div className="mx-auto max-w-screen-xl">
				<div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-evenly sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8">
					<div className="w-full max-w-[600px]">
						<div className="mx-auto mb-5 font-montserrat text-base leading-snug xs:text-lg sm:text-xl md:text-2xl">
							О нас
						</div>

						<div className="mb-4 font-montserrat text-[24px] font-semibold leading-snug sm:text-[28px] md:text-[40px] xl:text-[50px]">
							«ТрансАкустик» объединяет экспертов
						</div>

						<div className="text-justify font-montserrat text-[18px] leading-relaxed md:text-[20px] xl:text-[24px]">
							с многолетним опытом и глубокой экспертизой в области теоретических
							исследований и практического применения строительных решений на реальных
							объектах. Все наши решения подтверждены аккредитованными лабораториями,
							что гарантирует высокое качество и эффективное управление бюджетом
						</div>
					</div>

					<div className="flex shrink-0 flex-col items-center">
						<div className="mb-6 flex flex-row items-center gap-3">
							<LogoIcon className="size-12 xs:h-[67px] xs:w-[65px]" />
							<LogoTextIcon className="h-10 w-40 xs:h-[88px] xs:w-[232px]" />
						</div>
						<LogoBelniis className="mb-3 w-40 xs:w-auto" />
						<div className="max-w-[250px] text-center font-montserrat text-xs leading-tight xs:text-sm sm:text-base">
							&quot;Республиканский научно-исследовательский институт в отрасли
							строительства. Беларусь&quot;
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
