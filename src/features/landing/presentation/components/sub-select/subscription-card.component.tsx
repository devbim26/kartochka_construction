import { Button, useI18n } from '@core';
import type { Subscription } from '@features/subscriptions';
import { CheckMarkImage } from './images';

type Props = {
	subscription: Subscription;
	onClick: (id: string) => void;
};

export const SubscriptionCard = ({ subscription, onClick }: Props) => {
	const { locale, t } = useI18n();
	const reportsCount = Number(subscription.numberOfReports);
	const reportLabelKey =
		locale === 'ru' ? (reportsCount === 1 ? 'subscription.reportPerMonth.one' : 'subscription.reportPerMonth.many')
		: reportsCount === 1 ? 'subscription.reportPerMonth.one' : 'subscription.reportPerMonth.many';

	return (
		<div
			key={subscription.id}
			className={
				'flex min-h-[500px] flex-col rounded-2xl border border-gray-border bg-white px-4 pb-4 pt-10 sm:px-6'
			}
		>
			<div className="mx-4 border-b-2 border-gray-border pb-2 font-montserrat text-xl font-bold text-primary sm:text-2xl">
				{subscription.name}
			</div>
			<div className="mb-6 font-montserrat text-sm font-medium leading-[145%] sm:text-base">
				{subscription.description}
			</div>
			<div className="mb-4 font-montserrat text-lg font-medium text-primary sm:text-xl">
				{!!+subscription.price ? subscription.price : t('subscription.free')}
			</div>
			<Button onClick={() => onClick(subscription.id!)} className="mb-4 h-10 w-full">
				<p className="font-sans text-sm font-semibold leading-5 text-white sm:text-base">
					{t('subscription.buyPlan')}
				</p>
			</Button>
			<div className="flex flex-col">
				<div className="mb-2 flex items-start gap-2">
					<span className="shrink-0 pt-1">
						<CheckMarkImage />
					</span>
					<span className="text-start font-montserrat text-sm leading-[145%] sm:text-base">
						{subscription.numberOfReports} {t(reportLabelKey)}
					</span>
				</div>
			</div>
		</div>
	);
};
