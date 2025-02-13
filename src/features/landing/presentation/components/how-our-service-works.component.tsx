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
			<div className="flex w-[73.18%] flex-col py-[50px]">
				<div className="mb-[49px] flex font-montserrat text-[20px] font-normal leading-[24px]">
					Как работает наш сервис
				</div>
				<div className="flex flex-row gap-[30px]">
					<div className="flex w-1/2 flex-col">
						<div className="font-montserrat text-[25px] font-medium leading-[30px]">
							Этапы проектирования
						</div>
						<div className="mt-[50px] flex flex-col gap-[30px]">
							{steps.map((step, index) => (
								<div
									key={index}
									className="flex cursor-pointer flex-row justify-between gap-[30px]"
									onClick={() => handleStepClick(index)}
								>
									<div
										className={`flex cursor-pointer font-montserrat text-[20px] font-normal leading-[24px] ${
											selectedStep === index ? 'text-primary' : ''
										}`}
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
							'relative flex h-full w-1/2',
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
								'ease absolute inset-0 flex w-full flex-col gap-[24px] rounded-[20px] bg-white px-[20px] py-[30px] shadow-blue transition-opacity duration-200',
								isHover ? 'opacity-0' : 'opacity-1',
							)}
						>
							<div
								className={twMerge(
									'transition-opacity delay-100 duration-100 ease-in-out',
									isHover ? 'opacity-0' : 'opacity-1',
								)}
							>
								<div className="flex flex-row justify-between gap-[30px]">
									<div className="flex flex-row font-montserrat text-[20px] font-semibold leading-[24px]">
										{steps[selectedStep]}
									</div>
									<div className="flex">{numberImages[selectedStep]}</div>
								</div>
								<div className="whitespace-pre-wrap px-[7px] font-montserrat text-[20px] font-normal leading-[24px]">
									{stepDescriptions[selectedStep]}
								</div>
							</div>
						</div>
						<div
							className={twMerge(
								'absolute inset-0 flex w-full flex-col gap-[24px] rounded-[20px] bg-white px-[20px] py-[30px] shadow-blue transition-opacity duration-700 ease-in-out',
								isHover ? 'opacity-1' : 'opacity-0',
							)}
						>
							<div
								className={twMerge(
									'whitespace-pre-wrap px-[7px] font-montserrat text-[20px] font-normal leading-[24px] transition-opacity delay-700 duration-300 ease-in-out',
									isHover ? 'opacity-1' : 'invisible opacity-0',
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
