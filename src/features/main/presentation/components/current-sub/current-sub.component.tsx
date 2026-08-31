import { fetchApi } from '@api-gen';
import {
	Button,
	Carousel,
	CarouselSlide,
	convertToPaginatedType,
	getPluralForm,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
	useI18n,
} from '@core';
import { ensureCompanyRequisitesFilled, getCurrentUser } from '@features/account/services';
import {
	convertSubscriptionToClient,
	getPaginatedSubscriptions,
	resolveActiveSubscriptions,
	shouldShowSubscriptionCalculations,
	shouldShowSubscriptionCredits,
	shouldShowSubscriptionReports,
	type Subscription,
} from '@features/subscriptions';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { SubImage } from './images';

type Props = {
	className?: string;
	/** Для сетки с новостями: заголовок и белая карточка — отдельные ячейки одной высоты. */
	splitForGrid?: boolean;
};

const EMPTY_SUBSCRIPTION_FILTERS = {
	description: '',
	name: '',
	numberOfReports: '',
	price: '',
} as const;

const SUBSCRIPTION_CATALOG_PAGINATION = {
	pageNumber: 1,
	pageSize: 999999,
} as const;

export const CurrentSub = ({ className, splitForGrid = false }: Props) => {
	const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>([]);
	const [search] = useSearchParams();
	const userData = useAppSelector((store) => store.userData);
	const { t, locale } = useI18n();
	const navigate = useAppNavigate();
	const dispatch = useAppDispatch();
	const catalogRef = useRef<Subscription[]>([]);
	const changePlanFlow = search.get('changePlanFlow');

	const remainingCredits = userData.data?.budgetRemaining ?? 0;
	const remainingCalculations = userData.data?.dowloadReportsNumber ?? 0;
	const remainingReports = userData.data?.reportsNumber ?? 0;
	const hasManyCards = activeSubscriptions.length > 1;

	const handleChangePlan = async () => {
		const filled = await ensureCompanyRequisitesFilled(dispatch);
		if (!filled) {
			toast.error(t('subscription.requisitesRequired'));
			return;
		}
		navigate('', { subSelectModal: 'true', changePlanFlow: 'true' });
	};

	const loadActiveSubscriptions = useCallback((catalog: Subscription[]) => {
		from(fetchApi.api.userActiveUserSubscriptionList())
			.pipe(
				switchMap((response) => {
					if (response?.status !== 200 || !response.data) {
						return from([[] as Subscription[]]);
					}
					return from(resolveActiveSubscriptions(response.data as unknown, catalog));
				}),
				tap((activeSubs) => {
					setActiveSubscriptions(activeSubs);
				}),
				catchError(() => from([[] as Subscription[]])),
			)
			.subscribe();
	}, []);

	useLayoutEffect(() => {
		dispatch(getCurrentUser());

		const subscription = from(
			getPaginatedSubscriptions({
				data: EMPTY_SUBSCRIPTION_FILTERS,
				pagination: SUBSCRIPTION_CATALOG_PAGINATION,
			}),
		)
			.pipe(
				switchMap((response) => {
					const catalog = convertToPaginatedType(convertSubscriptionToClient)({
						items: response.data.items ?? [],
						pageNumber: response.data.pageNumber ?? 1,
						totalPages: response.data.totalPages ?? 0,
						totalCount: response.data.totalCount ?? 0,
						pageSize: response.data.pageSize ?? 10,
						hasPreviousPage: false,
						hasNextPage: false,
					}).items;

					catalogRef.current = catalog;

					return from(fetchApi.api.userActiveUserSubscriptionList()).pipe(
						switchMap((activeResponse) => {
							if (activeResponse?.status !== 200 || !activeResponse.data) {
								return from([[] as Subscription[]]);
							}
							return from(
								resolveActiveSubscriptions(activeResponse.data as unknown, catalog),
							);
						}),
					);
				}),
				tap((activeSubs) => {
					setActiveSubscriptions(activeSubs);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('errors.packagesLoad'));
					}
					return from([[] as Subscription[]]);
				}),
			)
			.subscribe();

		return () => subscription.unsubscribe();
	}, [dispatch, t]);

	useEffect(() => {
		if (!changePlanFlow || catalogRef.current.length === 0) return;
		loadActiveSubscriptions(catalogRef.current);
	}, [changePlanFlow, loadActiveSubscriptions]);

	const creditsLabel = (value: number) =>
		t(`main.currentSub.credits.${getPluralForm(value, locale)}`);

	const renderSubscriptionCard = (subscription: Subscription) => (
		<div className="flex h-full min-h-[320px] w-full flex-row justify-between gap-[16px] rounded-xl border border-gray-border bg-white px-[18px] py-[15px]">
			<div className="flex min-w-0 flex-1 flex-col justify-between gap-[16px]">
				<div className="flex flex-col gap-[18px]">
					<p className="font-sans text-2xl font-bold leading-7 text-primary">
						{subscription.name}
					</p>
					{subscription.description ? (
						<p className="font-sans text-base italic leading-6 text-[#374151]">
							{subscription.description}
						</p>
					) : null}
					<div className="flex flex-col gap-[10px]">
						{shouldShowSubscriptionCalculations(subscription.numberOfDowloadReports) ? (
							<p className="font-sans text-base font-semibold leading-6 text-[#1f2937]">
								{t('subscription.calculationsCount')}:{' '}
								{subscription.numberOfDowloadReports}
							</p>
						) : null}
						{shouldShowSubscriptionReports(subscription.numberOfReports) ? (
							<p className="font-sans text-base font-semibold leading-6 text-[#1f2937]">
								{t('subscription.reportsCount')}: {subscription.numberOfReports}
							</p>
						) : null}
						{shouldShowSubscriptionCredits(subscription.tariffPlanLimit) ? (
							<p className="font-sans text-base font-semibold leading-6 text-[#1f2937]">
								{t('subscription.creditsCount')}: {subscription.tariffPlanLimit}
							</p>
						) : null}
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
	);

	const header = (
		<div className="flex flex-col gap-[8px]">
			<p className="font-sans text-2xl font-semibold leading-7">
				{t('main.currentSub.title')}
			</p>
			<div className="flex flex-row flex-wrap items-center gap-x-6 gap-y-1">
				<p className="font-sans text-base font-semibold leading-6 text-[#1f2937]">
					{t('main.currentSub.remainingCredits')}: {remainingCredits}{' '}
					{creditsLabel(Number(remainingCredits) || 0)}
				</p>
				<p className="font-sans text-base font-semibold leading-6 text-[#1f2937]">
					{t('main.currentSub.remainingReports')}: {remainingCalculations}
				</p>
				<p className="font-sans text-base font-semibold leading-6 text-[#1f2937]">
					{t('main.currentSub.remainingDownloads')}: {remainingReports}
				</p>
			</div>
		</div>
	);

	const body =
		activeSubscriptions.length > 0 ? (
			<Carousel
				options={{
					align: 'start',
					loop: false,
					containScroll: 'trimSnaps',
				}}
				className="h-full min-h-[320px]"
				slidesClassName="h-full items-stretch"
				showPagination={false}
			>
				{activeSubscriptions.map((subscription) => (
					<CarouselSlide
						key={subscription.id}
						className={twMerge(
							'h-full w-auto',
							hasManyCards ? 'basis-full pr-3 md:basis-1/2' : 'basis-full',
						)}
					>
						{renderSubscriptionCard(subscription)}
					</CarouselSlide>
				))}
			</Carousel>
		) : (
			<div className="flex h-full min-h-[320px] w-full flex-row justify-between gap-[16px] rounded-xl border border-gray-border bg-white px-[18px] py-[15px]">
				<div className="flex flex-1 flex-col justify-between gap-[16px]">
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
		);

	if (splitForGrid) {
		return (
			<>
				<div className="col-start-2 row-start-1">{header}</div>
				<div className="col-start-2 row-start-2 h-full min-h-[320px]">{body}</div>
			</>
		);
	}

	return (
		<div className={twMerge('flex w-full flex-col gap-[20px]', className)}>
			{header}
			{body}
		</div>
	);
};
