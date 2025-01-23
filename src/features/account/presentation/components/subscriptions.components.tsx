import { Button } from '@core';
import { SubscriptionImage } from '../images';

interface SubscriptionProps {
	subscription: any;
}

export const Subscription = ({ subscription }: SubscriptionProps) => {
	return (
		<div className="mb-[30px] flex w-[490px] flex-col gap-[26px] rounded-xl border-[1px] border-gray-border bg-white px-[18px] py-[15px]">
			<div className="flex flex-row items-center justify-between">
				<p className="font-sans text-2xl font-semibold leading-4">Подписка</p>
				<Button className="border-2 border-primary bg-white px-[16px] py-[4px] font-semibold text-primary enabled:hover:bg-inherit">
					Улучшить до PRO
				</Button>
			</div>
			<div className="flex flex-row justify-between">
				<div className="flex flex-col justify-between">
					<div className="flex flex-col gap-[25px]">
						<div className="flex flex-row">
							<p className="mr-[5px] font-sans text-xl font-normal leading-4">
								подписка
							</p>
							<p className="font-sans text-xl font-semibold leading-4 text-primary">
								{subscription.status}
							</p>
						</div>
						<div className="flex flex-row">
							<p className="mr-[5px] font-sans text-lg font-normal leading-4">
								дата окончания {subscription.endDate}
							</p>
						</div>
					</div>
					<Button className="w-min px-[16px] font-semibold">Продлить подписку</Button>
				</div>
				<SubscriptionImage />
			</div>
		</div>
	);
};
