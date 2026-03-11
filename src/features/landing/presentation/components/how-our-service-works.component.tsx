import { AboutUs1, AboutUs2, AboutUs3, AboutUs4, AboutUs5 } from '@assets';
import { Chevron, useI18n } from '@core';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { stepDescriptions, steps } from '../../constants';
import {
	FifthNumberImage,
	FirstNumberImage,
	FourthNumberImage,
	SecondNumberImage,
	ThirdNumberImage,
} from '../images';

const numberImages = [
	<FirstNumberImage key="first" />,
	<SecondNumberImage key="second" />,
	<ThirdNumberImage key="third" />,
	<FourthNumberImage key="fourth" />,
	<FifthNumberImage key="fifth" />,
];

const aboutImages = [AboutUs1, AboutUs2, AboutUs3, AboutUs4, AboutUs5];

export const HowOurServiceWorks = () => {
	const [selectedStep, setSelectedStep] = useState(0);
	const [isHover, setIsHover] = useState<boolean | null>(null);
	const { t } = useI18n();

	const handleStepClick = (index: number) => {
		setSelectedStep(index);
	};

	return (
		<div className="flex w-full justify-center bg-background-primary">
			<div className="w-full max-w-screen-xl px-4 py-12 sm:px-6 md:px-8 xl:px-20">
				<div className="mb-8 text-center font-montserrat text-lg font-normal leading-snug sm:text-xl">
					{t('landing.how.title')}
				</div>

				<div className="flex flex-col items-center justify-center gap-10 xs:flex-row xs:flex-nowrap xs:items-center xs:justify-center">
					<div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
						<div className="mt-10 flex flex-col gap-6">
							{steps.map((step, index) => (
								<div
									key={index}
									className="flex cursor-pointer flex-row justify-between gap-4 sm:gap-6"
									onClick={() => handleStepClick(index)}
								>
									<div
										className={twMerge(
											'font-montserrat text-base font-normal leading-snug transition-colors sm:text-lg',
											selectedStep === index ? 'text-primary' : 'text-black',
										)}
									>
										{index + 1}. {t(step)}
									</div>
									<div className="flex">
										<Chevron
											color={selectedStep === index ? 'primary' : 'grey'}
											direction={selectedStep === index ? 'right' : 'down'}
										/>
									</div>
								</div>
							))}
						</div>
					</div>

					<div
						className="relative w-[299px] [perspective:1200px] sm:w-[299px] md:w-[479px] lg:w-[555px] xl:w-[839px]"
						onMouseEnter={() => setIsHover(true)}
						onMouseLeave={() => setIsHover(false)}
					>
						<div
							className={twMerge(
								'relative min-h-[260px] w-full md:h-[408px]',
								'transition-transform duration-700 ease-in-out [transform-style:preserve-3d]',
								isHover
									? '[transform:rotateY(180deg)]'
									: '[transform:rotateY(0deg)]',
							)}
						>
							<div
								className={twMerge(
									'absolute inset-0 flex min-h-[260px] w-full flex-col gap-6 rounded-2xl bg-white p-5 shadow-blue',
									'[backface-visibility:hidden]',
								)}
							>
								{/* Background number image */}
								<div className="absolute inset-0 flex justify-end p-5 text-[#0F6CAF38]">
									<div className="size-auto">{numberImages[selectedStep]}</div>
								</div>

								{/* Content over image */}
								<div className="relative z-10 flex flex-col gap-6">
									<div className="flex flex-row items-start justify-between gap-4 sm:gap-6">
										<div className="font-montserrat font-semibold leading-snug text-primary sm:text-lg">
											{t(steps[selectedStep])}
										</div>
										{/* Optional: show number on top as well */}
										{/* <div className="shrink-0">{numberImages[selectedStep]}</div> */}
									</div>
									<div className="whitespace-pre-wrap px-2 font-montserrat text-sm leading-relaxed sm:text-base">
										{t(stepDescriptions[selectedStep])}
									</div>
								</div>
							</div>

							<div
								className={twMerge(
									'absolute inset-0 flex h-full min-h-[260px] w-full flex-col gap-4 overflow-hidden rounded-2xl bg-white p-5 shadow-blue',
									'[backface-visibility:hidden] [transform:rotateY(180deg)]',
								)}
							>
								<div className="font-montserrat font-semibold leading-snug text-primary sm:text-lg">
									{t(steps[selectedStep])}
								</div>
								<div className="flex min-h-0 flex-1 items-center justify-center">
									<img
										src={aboutImages[selectedStep]}
										alt=""
										aria-hidden="true"
										loading="lazy"
										className="max-h-full max-w-full object-contain"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
