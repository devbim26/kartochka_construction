import { APP_ROUTES, Button, ChevronIcon, Switch } from '@core';
import { LandingSections } from '@features/landing/constants';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import {
	crossedPoints,
	monthPrices,
	points,
	subscriptionDescriptions,
	titles,
	yearPrices,
} from './constants';
import { CheckMarkImage } from './images';

interface SubSelectProps {
	wrapperClassName?: string;
	subContainerClassName?: string;
}

export const SubSelect = ({ wrapperClassName, subContainerClassName }: SubSelectProps) => {
	const [isPerMonth, setIsPerMonth] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleToggle = () => setIsPerMonth((prev) => !prev);
	const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + titles.length) % titles.length);
	const handleNext = () => setCurrentIndex((prev) => (prev + 1) % titles.length);

	return (
		<div
			className={twMerge(
				'mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 md:px-8',
				wrapperClassName,
			)}
			id={LandingSections.subscription.id}
		>
			{location.pathname.startsWith(`/${APP_ROUTES.landing.route}`) && (
				<div className="mb-6 font-montserrat text-base font-normal leading-snug sm:text-lg">
					Подписки
				</div>
			)}

			<div className="flex flex-col items-center text-center">
				<Switch
					onText="год"
					offText="месяц"
					wrapperClassName="mb-3 h-[30px] w-[180px] p-[3px] bg-primary"
					textClassName="font-semibold font-montserrat text-sm sm:text-base leading-5"
					unactiveTextClassName="text-white"
					activeTextClassName="text-primary"
					onChange={handleToggle}
				/>
				<div className="mb-3 font-montserrat text-xs font-normal sm:text-sm">
					При покупке на год первые 3 месяца бесплатно
				</div>

				<div className="hidden w-full gap-4 sm:grid sm:grid-cols-3">
					{titles.map((title, index) => (
						<div
							key={index}
							className={twMerge(
								subContainerClassName,
								'flex flex-col rounded-2xl border border-gray-border px-4 pb-4 pt-10 sm:px-6',
							)}
						>
							<div className="mx-4 border-b-2 border-gray-border pb-2 font-montserrat text-xl font-bold text-primary sm:text-2xl">
								{title}
							</div>
							<div className="mb-6 font-montserrat text-sm font-medium leading-[145%] sm:text-base">
								{subscriptionDescriptions[index]}
							</div>
							<div className="mb-4 font-montserrat text-lg font-medium text-primary sm:text-xl">
								{isPerMonth ? monthPrices[index] : yearPrices[index]}
							</div>
							<Button className="mb-4 h-10 w-full">
								<p className="font-sans text-sm font-semibold leading-5 text-white sm:text-base">
									Оформить подписку
								</p>
							</Button>
							<div className="flex flex-col">
								{points[index].map((point, i) => (
									<div key={i} className="mb-2 flex items-start gap-2">
										<span className="shrink-0 pt-1">
											<CheckMarkImage />
										</span>
										<span className="text-start font-montserrat text-sm leading-[145%] sm:text-base">
											{point}
										</span>
									</div>
								))}
								{crossedPoints[index].map((point, i) => (
									<div
										key={i}
										className="mb-2 ml-6 text-start font-montserrat text-sm font-semibold leading-[145%] text-gray-text line-through sm:text-base"
									>
										{point}
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				<div className="mt-6 flex w-full items-center justify-center gap-4 sm:hidden">
					<Button
						onClick={handlePrev}
						variant="primary"
						className="shrink-0 p-[10px]"
						aria-label="Предыдущая подписка"
					>
						<ChevronIcon className="rotate-90" fill="white" />
					</Button>

					<div
						className={twMerge(
							subContainerClassName,
							'flex h-[791px] w-[315px] flex-col rounded-2xl border border-gray-border px-4 pb-4 pt-10',
						)}
					>
						<div className="mx-4 border-b-2 border-gray-border pb-2 font-montserrat text-xl font-bold text-primary">
							{titles[currentIndex]}
						</div>
						<div className="mb-6 font-montserrat text-sm font-medium leading-[145%]">
							{subscriptionDescriptions[currentIndex]}
						</div>
						<div className="mb-4 font-montserrat text-lg font-medium text-primary">
							{isPerMonth ? monthPrices[currentIndex] : yearPrices[currentIndex]}
						</div>
						<Button className="mb-4 h-10 w-full">
							<p className="font-sans text-sm font-semibold leading-5 text-white">
								Оформить подписку
							</p>
						</Button>
						<div className="flex flex-col">
							{points[currentIndex].map((point, i) => (
								<div key={i} className="mb-2 flex items-start gap-2">
									<span className="shrink-0 pt-1">
										<CheckMarkImage />
									</span>
									<span className="text-start font-montserrat text-sm leading-[145%]">
										{point}
									</span>
								</div>
							))}
							{crossedPoints[currentIndex].map((point, i) => (
								<div
									key={i}
									className="mb-2 ml-6 text-start font-montserrat text-sm font-semibold leading-[145%] text-gray-text line-through"
								>
									{point}
								</div>
							))}
						</div>
					</div>

					<Button
						onClick={handleNext}
						variant="primary"
						className="shrink-0 p-[10px]"
						aria-label="Следующая подписка"
					>
						<ChevronIcon className="-rotate-90" fill="white" />
					</Button>
				</div>
			</div>
		</div>
	);
};
