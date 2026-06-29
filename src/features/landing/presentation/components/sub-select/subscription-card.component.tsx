import { Button, useI18n } from '@core';
import type { Subscription } from '@features/subscriptions';
import {
	shouldShowSubscriptionCalculations,
	shouldShowSubscriptionPrice,
	shouldShowSubscriptionReports,
	shouldShowSubscriptionTariffPlan,
} from '@features/subscriptions';
import { CheckMarkImage } from './images';

type Props = {
	subscription: Subscription;
	onClick: (id: string) => void;
	showActionButton?: boolean;
};

export const SubscriptionCard = ({ subscription, onClick, showActionButton = true }: Props) => {
	const { t } = useI18n();
	const showPrice = shouldShowSubscriptionPrice(subscription.price);
	const showCalculations = shouldShowSubscriptionCalculations(subscription.numberOfDowloadReports);
	const showReports = shouldShowSubscriptionReports(subscription.numberOfReports);
	const showTariffPlan = shouldShowSubscriptionTariffPlan(subscription.tariffPlanName);

	return (
		<div
			key={subscription.id}
			className={
				'flex min-h-[500px] flex-col rounded-2xl border border-gray-border bg-white px-4 pb-4 pt-6 shadow-[0_6px_18px_rgba(16,24,40,0.05)] sm:px-5'
			}
		>
			<div className="min-h-[72px] border-b border-gray-border pb-2 font-montserrat text-2xl font-bold text-primary sm:text-[28px]">
				{subscription.name}
			</div>
			<div className="mt-3 min-h-[68px] font-montserrat text-sm font-medium leading-[150%] text-[#374151] sm:text-base">
				{subscription.description}
			</div>
			{showPrice ? (
				<div className="mt-3 rounded-xl bg-[#eef5ff] px-3 py-2.5">
					<p className="font-montserrat text-sm font-semibold text-[#1f2937]">
						{t('subscription.subscriptionCost')}
					</p>
					<p className="mt-1 font-montserrat text-2xl font-bold text-primary sm:text-[28px]">
						{subscription.price} BYN
					</p>
				</div>
			) : null}
			{showActionButton ? (
				<Button onClick={() => onClick(subscription.id!)} className="mb-2 mt-2 h-11 w-full">
					<p className="font-sans text-sm font-semibold leading-5 text-white sm:text-base">
						{t('subscription.buyPlan')}
					</p>
				</Button>
			) : null}
			{showCalculations || showReports || showTariffPlan ? (
			<div className="mt-1 flex flex-col gap-2">
				{showCalculations ? (
					<div className="flex items-start gap-2">
						<span className="shrink-0 pt-1">
							<CheckMarkImage />
						</span>
						<span className="text-start font-montserrat text-base font-semibold leading-[145%] sm:text-lg">
							{t('subscription.calculationsCount')}: {subscription.numberOfDowloadReports}
						</span>
					</div>
				) : null}
				{showReports ? (
					<div className="flex items-start gap-2">
						<span className="shrink-0 pt-1">
							<CheckMarkImage />
						</span>
						<span className="text-start font-montserrat text-base font-semibold leading-[145%] sm:text-lg">
							{t('subscription.reportsCount')}: {subscription.numberOfReports}
						</span>
					</div>
				) : null}
				{showTariffPlan ? (
					<div className="flex items-start gap-2">
						<span className="shrink-0 pt-1">
							<CheckMarkImage />
						</span>
						<span className="text-start font-montserrat text-base font-semibold leading-[145%] sm:text-lg">
							{t('subscription.tariffPlan')}: {subscription.tariffPlanName}
							{subscription.tariffPlanLimit
								? ` (${t('subscription.tariffLimit')}: ${subscription.tariffPlanLimit})`
								: ''}
						</span>
					</div>
				) : null}
			</div>
			) : null}
		</div>
	);
};
