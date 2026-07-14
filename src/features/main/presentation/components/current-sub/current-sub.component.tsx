import { fetchApi } from '@api-gen';
import {
	Button,
	convertToPaginatedType,
	getPluralForm,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
	useI18n,
} from '@core';
import { getCurrentUser, ensureCompanyRequisitesFilled } from '@features/account/services';
import {
	convertSubscriptionToClient,
	getPaginatedSubscriptions,
	resolveActiveSubscription,
	shouldShowSubscriptionPrice,
	shouldShowSubscriptionTariffPlan,
	type ActiveSubscriptionPayload,
	type Subscription,
} from '@features/subscriptions';
import { AxiosError } from 'axios';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { SubImage } from './images';

type Props = {
	className?: string;
};

export const CurrentSub = ({ className }: Props) => {
	const [subscription, setSubscription] = useState<Subscription>();
	const [subscriptions, setSubscriptions] = useState<Array<Subscription>>([]);
	const [search] = useSearchParams();
	const userData = useAppSelector((store) => store.userData);
	const { t, locale } = useI18n();
	const navigate = useAppNavigate();
	const dispatch = useAppDispatch();

	const handleChangePlan = async () => {
		const filled = await ensureCompanyRequisitesFilled(dispatch);
		if (!filled) {
			toast.error(t('subscription.requisitesRequired'));
			return;
		}
		navigate('', { subSelectModal: 'true', changePlanFlow: 'true' });
	};

	const handleGetTableData = () => {
		from(
			getPaginatedSubscriptions({
				data: { description: '', name: '', numberOfReports: '', price: '' },
				pagination: { pageNumber: 1, pageSize: 999999 },
			}),
		)
			.pipe(
				switchMap((response) => {
					const res = convertToPaginatedType(convertSubscriptionToClient)({
						items: response.data.items ?? [],
						pageNumber: response.data.pageNumber ?? 1,
						totalPages: response.data.totalPages ?? 0,
						totalCount: response.data.totalCount ?? 0,
						pageSize: response.data.pageSize ?? 10,
						hasPreviousPage: false,
						hasNextPage: false,
					});
					return from([res]);
				}),
				tap((res) => {
					setSubscriptions(res.items);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('errors.packagesLoad'));
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const handleGetCurrentSubscription = () => {
		from(fetchApi.api.userActiveUserSubscriptionList())
			.pipe(
				switchMap((response) => {
					if (response?.status !== 200 || !response.data) {
						return from([undefined]);
					}
					return from(
						resolveActiveSubscription(
							response.data as ActiveSubscriptionPayload,
							subscriptions,
						),
					);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
					}
					return from([undefined]);
				}),
			)
			.subscribe((activeSub) => {
				setSubscription(activeSub);
			});
	};

	useEffect(() => {
		handleGetCurrentSubscription();
	}, [subscriptions, search.get('changePlanFlow')]);

	useLayoutEffect(() => {
		dispatch(getCurrentUser());
		handleGetTableData();
	}, [dispatch]);

	return (
		<div
			className={twMerge(
				'flex min-h-[320px] w-full flex-col gap-[20px] rounded-xl border border-gray-border bg-white px-[18px] py-[15px]',
				className,
			)}
		>
			<div className="flex flex-row items-center justify-between">
				<p className="font-sans text-2xl font-semibold leading-4">
					{t('main.currentSub.title')}
				</p>
			</div>
			{subscription ? (
				<div className="flex h-full flex-row justify-between gap-[16px]">
					<div className="flex flex-1 flex-col justify-between">
						<div className="flex flex-col gap-[18px]">
							<div className="flex flex-row">
								<p className="font-sans text-2xl font-bold leading-7 text-primary">
									{subscription.name}
								</p>
							</div>
							{subscription.description ? (
								<p className="font-sans text-base italic leading-6 text-[#374151]">
									{subscription.description}
								</p>
							) : null}
							<div className="flex flex-col gap-[10px]">
								{shouldShowSubscriptionPrice(subscription.price) ? (
									<p className="font-sans text-base font-bold leading-6 text-[#111827]">
										{t('main.currentSub.price')}: {subscription.price}{' '}
										{t(
											`main.currentSub.credits.${getPluralForm(
												Number(subscription.price) || 0,
												locale,
											)}`,
										)}
									</p>
								) : null}
								{shouldShowSubscriptionTariffPlan(subscription.tariffPlanName) ? (
									<p className="font-sans text-base font-semibold leading-6 text-[#1f2937]">
										{t('subscription.tariffPlan')}: {subscription.tariffPlanName}
										{subscription.tariffPlanLimit
											? ` (${t('subscription.tariffLimit')}: ${subscription.tariffPlanLimit})`
											: ''}
									</p>
								) : null}
								<p className="font-sans text-base font-semibold leading-6 text-[#1f2937]">
									{t('main.currentSub.remainingReports')}:{' '}
									{userData.data?.dowloadReportsNumber ?? 0}
								</p>
								<p className="font-sans text-base font-semibold leading-6 text-[#1f2937]">
									{t('main.currentSub.remainingDownloads')}:{' '}
									{userData.data?.reportsNumber ?? 0}
								</p>
							</div>
						</div>
						<Button className="w-min px-[16px]" onClick={handleChangePlan}>
							<p className="font-sans text-sm font-semibold leading-4">
								{t('main.currentSub.changePlan')}
							</p>
						</Button>
					</div>
					<div className="flex shrink-0 items-start">
						<SubImage />
					</div>
				</div>
			) : (
				<div className="flex h-full flex-row justify-between gap-[16px]">
					<div className="flex flex-1 flex-col justify-between">
						<p className="font-sans text-base leading-6 text-[#374151]">
							{t('main.currentSub.noneActive')}
						</p>
						<Button className="w-min px-[16px]" onClick={handleChangePlan}>
							<p className="font-sans text-sm font-semibold leading-4">
								{t('subscription.buyPlan')}
							</p>
						</Button>
					</div>
					<div className="flex shrink-0 items-start">
						<SubImage />
					</div>
				</div>
			)}
		</div>
	);
};
