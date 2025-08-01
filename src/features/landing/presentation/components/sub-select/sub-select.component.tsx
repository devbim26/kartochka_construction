import { APP_ROUTES, Carousel, CarouselSlide, convertToPaginatedType, useAppNavigate } from '@core';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { LandingSections } from '@features/landing/constants';
import type { Subscription } from '@features/subscriptions';
import { convertSubscriptionToClient, getPaginatedSubscriptions } from '@features/subscriptions';
import { AxiosError } from 'axios';
import { useLayoutEffect, useState } from 'react';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { SubscriptionCard } from './subscription-card.component';

interface SubSelectProps {
	wrapperClassName?: string;
	subContainerClassName?: string;
}

export const SubSelect = ({ wrapperClassName, subContainerClassName }: SubSelectProps) => {
	const [isPerMonth, setIsPerMonth] = useState(true);
	const [subscriptions, setSubscriptions] = useState<Array<Subscription>>([]);

	const navigate = useAppNavigate();

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
						toast.error(error.response?.data?.message || 'Ошибка загрузки подписок');
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const handleSubscribe = (id: string) => {
		navigate(APP_ROUTES.designing.route + '/' + DESIGNING_ROUTES.main.route, {
			subId: id,
			subModal: 'true',
		});
	};

	useLayoutEffect(() => {
		handleGetTableData();
	}, []);

	const handleToggle = () => setIsPerMonth((prev) => !prev);

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
					Пакеты
				</div>
			)}

			<div className="flex flex-col items-center text-center">
				{/* <Switch
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
				</div> */}

				<Carousel
					options={{
						align: 'start',
						loop: true,
						active: true,
					}}
				>
					{subscriptions.map((sub) => (
						<CarouselSlide key={sub.id} className="basis-1/3 px-3">
							<SubscriptionCard onClick={handleSubscribe} subscription={sub} />
						</CarouselSlide>
					))}
				</Carousel>
			</div>
		</div>
	);
};
