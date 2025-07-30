import { fetchApi } from '@api-gen';
import { Button, convertToPaginatedType, SubImage } from '@core';
import {
	convertSubscriptionToClient,
	getPaginatedSubscriptions,
	type Subscription,
} from '@features/subscriptions';
import { AxiosError } from 'axios';
import { useEffect, useLayoutEffect, useState } from 'react';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';

export const CurrentSub = () => {
	const [subscription, setSubscription] = useState<Subscription>();
	const [subscriptions, setSubscriptions] = useState<Array<Subscription>>([]);

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

	const handleGetCurrentSubscription = () => {
		from(fetchApi.api.userActiveUserSubscriptionList())
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						//toast.error(error.response?.data?.message || 'Ошибка получения подписки');
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200 && response.data) {
					const activeSub = subscriptions.find(
						(sub) => sub.id === (response.data as any).subscriptionId, //TODO: any убрать
					);
					setSubscription(activeSub);
				}
			});
	};

	useEffect(() => {
		handleGetCurrentSubscription();
	}, [subscriptions]);

	useLayoutEffect(() => {
		handleGetTableData();
	}, []);

	return (
		<div className="flex w-1/2 flex-col gap-[26px] rounded-xl border border-gray-border bg-white px-[18px] py-[15px]">
			<div className="flex flex-row items-center justify-between">
				<p className="font-sans text-2xl font-semibold leading-4">Подписка</p>
				<Button className="border-2 border-primary bg-white px-[16px] py-[4px] font-semibold text-primary enabled:hover:bg-primary enabled:hover:text-white">
					<p className="font-sans text-sm font-semibold leading-4">Улучшить до PRO</p>
				</Button>
			</div>
			{subscription ? (
				<div className="flex flex-row justify-between">
					<div className="flex flex-col justify-between">
						<div className="flex flex-col gap-[25px]">
							<div className="flex flex-row">
								<p className="mr-[5px] font-sans text-xl font-normal leading-4">
									подписка
								</p>
								<p className="font-sans text-xl font-semibold leading-4 text-primary">
									{subscription.name}
								</p>
							</div>
							<div className="flex flex-row">
								<p className="mr-[5px] font-sans text-lg font-normal leading-4">
									цоличество скачиваний: {subscription.numberOfReports}
								</p>
							</div>
							<div className="flex flex-row">
								<p className="mr-[5px] font-sans text-lg font-normal leading-4">
									цена: {subscription.price}
								</p>
							</div>
						</div>
						<Button className="w-min px-[16px]">
							<p className="font-sans text-sm font-semibold leading-4">
								Продлить подписку
							</p>
						</Button>
					</div>
					<SubImage />
				</div>
			) : (
				<></>
			)}
		</div>
	);
};
