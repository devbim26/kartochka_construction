import { Chevron } from '@core';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { stepDescriptions, stepDetailDescriptions, steps } from '../../constants';
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

export const HowOurServiceWorks = () => {
	const [selectedStep, setSelectedStep] = useState(0);
	const [isHover, setIsHover] = useState<boolean | null>(null);

	const handleStepClick = (index: number) => {
		setSelectedStep(index);
	};

	return (
		<div className="flex w-full justify-center bg-background-primary">
			<div className="w-full max-w-screen-xl px-4 py-12 sm:px-6 md:px-8 xl:px-20">
				<div className="mb-8 text-center font-montserrat text-lg font-normal leading-snug sm:text-xl">
					Как работает наш сервис
				</div>

				<div className="flex flex-col items-center justify-center gap-10 xs:flex-row xs:flex-nowrap xs:items-center xs:justify-center">
					<div className="w-[320px] shrink-0">
						<div className="font-montserrat text-xl font-medium leading-snug sm:text-2xl">
							Этапы проектирования
						</div>
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
										{index + 1}. {step}
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
						className={twMerge(
							'relative flex w-[299px] sm:w-[299px] md:w-[479px] lg:w-[555px] xl:w-[839px]',
							isHover !== null
								? isHover
									? 'animate-turnOverTo'
									: 'animate-turnOverFrom'
								: '',
						)}
						onMouseEnter={() => setIsHover(true)}
						onMouseLeave={() => setIsHover(false)}
					>
						<div
							className={twMerge(
								'flex min-h-[260px] w-full flex-col gap-6 rounded-2xl bg-white p-5 shadow-blue transition-opacity duration-200',
								'md:h-[408px]',
								isHover ? 'opacity-0' : 'opacity-100',
							)}
						>
							<div className="flex flex-row items-start justify-between gap-4 sm:gap-6">
								<div className="font-montserrat text-base font-semibold leading-snug sm:text-lg">
									{steps[selectedStep]}
								</div>
								<div className="shrink-0">{numberImages[selectedStep]}</div>
							</div>
							<div className="mt-6 whitespace-pre-wrap px-2 font-montserrat text-sm leading-relaxed sm:text-base">
								{stepDescriptions[selectedStep]}
							</div>
						</div>

						<div
							className={twMerge(
								'absolute left-0 top-0 flex h-full w-full flex-col gap-6 rounded-2xl bg-white p-5 shadow-blue transition-opacity duration-700 ease-in-out',
								'md:h-[408px]',
								isHover ? 'opacity-100' : 'opacity-0',
							)}
						>
							<div
								className={twMerge(
									'mt-6 whitespace-pre-wrap px-2 font-montserrat text-sm leading-relaxed transition-opacity delay-700 duration-300 ease-in-out sm:text-base',
									isHover ? 'opacity-100' : 'invisible opacity-0',
								)}
							>
								{stepDetailDescriptions[selectedStep]}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
