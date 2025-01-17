import { Button } from '@core';
import { useState } from 'react';
import { Switch } from '../../../../core/presentation/components/switch';
import {
	crossedPoints,
	monthPrices,
	points,
	subscriptionDescriptions,
	titles,
	yearPrices,
} from '../../constants';
import { CheckMarkImage } from '../images';

export const Subscriptions = () => {
	const [isPerMonth, setIsPerMonth] = useState(true);

	const handleToggle = () => {
		isPerMonth ? setIsPerMonth(false) : setIsPerMonth(true);
	};

	return (
		<div className="flex w-[73.18%] flex-col py-[50px]">
			<div className="font-montserrat mb-[34px] flex text-[20px] font-normal leading-[24px]">
				Подписки
			</div>
			<div className="flex flex-col items-center text-center">
				<Switch
					onText="год"
					offText="месяц"
					onColor="primary"
					offColor="primary"
					className="mb-[12px] h-[30px] w-[180px] p-[3px]"
					onTextClassName="font-semibold font-montserrat text-[16px] leading-[20px] right-[29px]"
					offTextClassName="font-semibold font-montserrat text-[16px] leading-[20px] left-[17px]"
					onChange={handleToggle}
				/>
				<div className="font-montserrat mb-[12px] text-[12px] font-normal">
					При покупке на год первые 3 месяца бесплатно
				</div>
				<div className="flex w-full gap-[10px]">
					{titles.map((title, index) => (
						<div
							key={index}
							className="border-grey-border flex flex-1 flex-col rounded-[20px] border px-[16px] pb-[16px] pt-[41px]"
						>
							<div className="border-b-grey-border font-montserrat mx-[17px] border-b-2 pb-[9px] text-[25px] font-bold leading-[30px] text-primary">
								{title}
							</div>
							<div className="font-montserrat mb-[25px] text-[16px] font-medium leading-[145%]">
								{subscriptionDescriptions[index]}
							</div>
							<div className="font-montserrat mb-[18px] text-[20px] font-medium leading-[24px] text-primary">
								{isPerMonth ? monthPrices[index] : yearPrices[index]}
							</div>
							<Button className="mb-[14px] w-full text-[16px]">
								Оформить подписку
							</Button>
							<div className="flex flex-col">
								{points[index].map((point, index) => (
									<div key={index} className="mb-[10px] flex flex-row gap-[10px]">
										<span className="flex items-center">
											<CheckMarkImage />
										</span>
										<span className="font-montserrat flex text-start text-[18px] leading-[145%]">
											{point}
										</span>
									</div>
								))}
								{crossedPoints[index].map((point, index) => (
									<div
										key={index}
										className="font-montserrat text-grey-text mb-[10px] ml-[26px] flex flex-row gap-[10px] text-start text-[18px] font-semibold leading-[145%] line-through"
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
