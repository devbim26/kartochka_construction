import {
	APP_ROUTES,
	Button,
	CheckMarkImage,
	crossedPoints,
	monthPrices,
	points,
	subscriptionDescriptions,
	Switch,
	titles,
	yearPrices,
} from '@core';
import { LandingSections } from '@features/landing/constants';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface SubSelectProps {
	wrapperClassName?: string;
	subContainerClassName?: string;
}

export const SubSelect = ({ wrapperClassName, subContainerClassName }: SubSelectProps) => {
	const [isPerMonth, setIsPerMonth] = useState(true);

	const handleToggle = () => {
		setIsPerMonth(!isPerMonth);
	};

	return (
		<div
			className={twMerge('flex w-[73.18%] flex-col py-[50px]', wrapperClassName)}
			id={LandingSections.subscription.id}
		>
			{location.pathname.startsWith(`/${APP_ROUTES.landing.route}`) && (
				<div className="mb-[34px] flex font-montserrat text-[20px] font-normal leading-[24px]">
					Подписки
				</div>
			)}
			<div className="flex flex-col items-center text-center">
				<Switch
					onText="год"
					offText="месяц"
					wrapperClassName="mb-[12px] h-[30px] w-[180px] p-[3px] bg-primary"
					textClassName="font-semibold font-montserrat text-[16px] leading-[20px]"
					unactiveTextClassName="text-white"
					activeTextClassName="text-primary"
					onChange={handleToggle}
				/>
				<div className="mb-[12px] font-montserrat text-[12px] font-normal">
					При покупке на год первые 3 месяца бесплатно
				</div>
				<div className="flex w-fit gap-[10px]">
					{titles.map((title, index) => (
						<div
							key={index}
							className={twMerge(
								subContainerClassName,
								'flex flex-1 flex-col rounded-[20px] border border-gray-border px-[16px] pb-[16px] pt-[41px]',
							)}
						>
							<div className="mx-[17px] border-b-2 border-b-gray-border pb-[9px] font-montserrat text-[25px] font-bold leading-[30px] text-primary">
								{title}
							</div>
							<div className="mb-[25px] font-montserrat text-[16px] font-medium leading-[145%]">
								{subscriptionDescriptions[index]}
							</div>
							<div className="mb-[18px] font-montserrat text-[20px] font-medium leading-[24px] text-primary">
								{isPerMonth ? monthPrices[index] : yearPrices[index]}
							</div>
							<Button className="mb-[14px] h-[40px] w-full">
								<p className="font-sans text-base font-semibold leading-5 text-white">
									Оформить подписку
								</p>
							</Button>
							<div className="flex flex-col">
								{points[index].map((point, index) => (
									<div key={index} className="mb-[10px] flex flex-row gap-[10px]">
										<span className="flex items-center">
											<CheckMarkImage />
										</span>
										<span className="flex text-start font-montserrat text-[18px] leading-[145%]">
											{point}
										</span>
									</div>
								))}
								{crossedPoints[index].map((point, index) => (
									<div
										key={index}
										className="mb-[10px] ml-[26px] flex flex-row gap-[10px] text-start font-montserrat text-[18px] font-semibold leading-[145%] text-gray-text line-through"
									>
										{point}
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
