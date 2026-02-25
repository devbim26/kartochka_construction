import { Switch } from '@core';
import { LandingSections } from '@features/landing/constants';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export const AboutUsComponent = () => {
	const [isPlatformSwitch, setIsPlatformSwitch] = useState<boolean>(true);

	return (
		<div
			className="w-full bg-white px-6 py-8 xs:px-8 sm:px-12 md:px-14 lg:px-20"
			id={LandingSections.aboutUs.id}
		>
			<div className="mx-auto max-w-screen-xl py-[100px]">
				<div className="flex w-full gap-[20px] bg-white">
					<div className="flex flex-col gap-[15px]">
						<div className="flex flex-col gap-[2px]">
							<span
								className={twMerge(
									'text-right text-[20px] font-bold text-gray-text',
									isPlatformSwitch && 'text-primary',
								)}
							>
								ПЛАТФОРМА
							</span>
							<span
								className={twMerge(
									'text-right text-[20px] font-bold italic text-gray-text',
									isPlatformSwitch && 'text-primary',
								)}
							>
								Проектирование и расчеты конструкций
							</span>
						</div>
						<span
							className={twMerge(
								'text-right text-[20px] font-bold italic text-gray-text',
								isPlatformSwitch && 'text-black',
							)}
						>
							Автоматизирует звукоизоляционные расчёты по СН 2.04.01.-2020.Предлагает
							оптимальные конструкции и экономит бюджет.Формирует отчёт в PDF для
							передачи в экспертизу.
						</span>
					</div>
					<div className="flex flex-col items-center justify-center gap-[15px]">
						<Switch onChange={() => setIsPlatformSwitch((prev) => !prev)} />
						<div className="h-[80px] w-[2px] bg-gray-text"></div>
					</div>
					<div className="flex flex-col gap-[15px]">
						<div className="flex flex-col gap-[2px]">
							<span
								className={twMerge(
									'text-[20px] font-bold text-gray-text',
									!isPlatformSwitch && 'text-primary',
								)}
							>
								AI mode
							</span>
							<span
								className={twMerge(
									'text-[20px] font-bold italic text-gray-text',
									!isPlatformSwitch && 'text-primary',
								)}
							>
								Визуализация и консультирование
							</span>
						</div>
						<span
							className={twMerge(
								'text-[20px] font-bold italic text-gray-text',
								!isPlatformSwitch && 'text-black',
							)}
						>
							Создает изображений фасадов и интерьеров. Анализирует документы, нормы и
							расчёты в чате. Проверяет соответствие проектных решений требованиям.
							Глубокий поиск информации в интернете.
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
