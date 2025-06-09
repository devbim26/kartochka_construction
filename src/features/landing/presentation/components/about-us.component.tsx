import { LogoBelniis, LogoIcon, LogoTextIcon } from '@core';
import { LandingSections } from '@features/landing/constants';

export const AboutUsComponent = () => {
	return (
		<div
			className="w-full bg-white px-4 py-8 sm:px-6 md:px-8 xl:px-20"
			id={LandingSections.aboutUs.id}
		>
			<div className="mx-auto max-w-screen-xl">
				<div className="mb-5 font-montserrat text-base leading-snug sm:text-lg md:text-xl">
					О нас
				</div>
				<div className="flex flex-col gap-10 lg:flex-row lg:gap-[82px]">
					<div className="flex flex-1 flex-col">
						<div className="mb-4 font-montserrat text-2xl font-semibold leading-snug sm:text-3xl md:text-4xl">
							«ТрансАкустик» объединяет экспертов
						</div>
						<div className="font-montserrat text-base leading-relaxed sm:text-lg md:text-xl">
							с многолетним опытом и глубокой экспертизой в области теоретических
							исследований и практического применения строительных решений на реальных
							объектах. Все наши решения подтверждены аккредитованными лабораториями,
							что гарантирует высокое качество и эффективное управление бюджетом
						</div>
					</div>
					<div className="flex shrink-0 flex-col items-center">
						<div className="mb-6 flex flex-row items-center gap-3">
							<LogoIcon className="size-12 sm:h-[67px] sm:w-[65px]" />
							<LogoTextIcon className="h-10 w-40 sm:h-[88px] sm:w-[232px]" />
						</div>
						<LogoBelniis className="mb-3 w-40 sm:w-auto" />
						<div className="text-center font-montserrat text-xs leading-tight sm:text-sm">
							&quot;Республиканский научно-исследовательский институт в отрасли
							строительства. Беларусь&quot;
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
