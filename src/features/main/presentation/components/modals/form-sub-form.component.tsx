import { fetchApi } from '@api-gen';
import { Button, useAppNavigate, useI18n } from '@core';
import { convertBillToClient, deleteBill, type Bill } from '@features/bills';
import { LandingSections } from '@features/landing/constants';
import type { Subscription } from '@features/subscriptions';
import { convertSubscriptionToClient, getSubscriptionById } from '@features/subscriptions';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';

export const FormSubscription = () => {
	const [search] = useSearchParams();
	const [currentSub, setCurrentSub] = useState<Subscription>();
	const [bill, setBill] = useState<Bill>();
	const navigate = useAppNavigate();
	const { t } = useI18n();
	const handleSubscribe = (id: string) => {
		from(fetchApi.api.billCreate({ subscriptionId: id }))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data || t('subscription.checkout.error'));
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					setBill(convertBillToClient(response.data));
					toast.success(t('subscription.checkout.success'));
				}
			});
	};

	const handleDeleteTableData = (id: string) => {
		from(deleteBill(id))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					toast.success(t('bill.delete.success'));
				}
			});
	};

	const handleGetOneTableData = (id: string) => {
		from(getSubscriptionById(id))
			.pipe(
				switchMap((response) => {
					const data = convertSubscriptionToClient(response.data);
					return from([data]);
				}),
				tap((data) => {
					if (data) setCurrentSub(data);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	useEffect(() => {
		if (search.get('subId')) {
			handleSubscribe(search.get('subId')!);
			handleGetOneTableData(search.get('subId')!);
		}
	}, [search]);
	const handleDownloadFile = () => {
		if (bill) {
			const link = document.createElement('a');
			link.href = bill.fileUrl;
			const fileName = `${t('bill.filePrefix')}${bill.number}`;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else {
			toast.error(t('bill.notFound'));
		}
	};

	return (
		<div className="flex w-fit flex-col">
			{currentSub && (
				<div
					className={
						'flex w-[1000px] flex-col rounded-2xl border border-gray-border bg-white px-4 pb-4 pt-10 sm:px-6'
					}
				>
					<div className="flex items-center justify-between">
						<div className="flex w-fit flex-col items-center justify-between">
							<div className="mx-4 border-b-2 border-gray-border pb-2 font-montserrat text-xl font-bold text-primary sm:text-2xl">
								{currentSub.name}
							</div>
							<div className="mb-6 font-montserrat text-sm font-medium leading-[145%] sm:text-base">
								{currentSub.description}
							</div>
						</div>
						<div className="mb-4 font-montserrat text-lg font-medium text-primary sm:text-xl">
							{!!+currentSub.price ? currentSub.price : t('subscription.free')}
						</div>
						<Button
							onClick={() => {
								handleDeleteTableData(bill!.id);
								navigate('', { sectionId: LandingSections.subscription.id });
							}}
							className="mb-4 h-10 w-fit"
						>
							<p className="font-sans text-sm font-semibold leading-5 text-white sm:text-base">
								{t('main.currentSub.changePlan')}
							</p>
						</Button>
					</div>

					<div className="flex items-center justify-between">
						<div className={'flex w-full flex-col justify-between'}>
							<div className="mb-4 font-montserrat text-lg font-medium text-black sm:text-xl">
								{t('subscription.paymentData')}
							</div>
							<Button
								onClick={handleDownloadFile}
								className="mb-4 h-10 w-fit"
								variant="primary"
							>
								<p className="font-sans text-sm font-semibold leading-5 sm:text-base">
									{t('bill.downloadInvoice')}
								</p>
							</Button>
						</div>
						<Button
							onClick={() => {
								handleDeleteTableData(bill!.id);
								navigate('');
							}}
							className="mb-4 h-10 w-fit"
							variant="outline"
						>
							<p className="font-sans text-sm font-semibold leading-5 sm:text-base">
								{t('subscription.checkout.cancel')}
							</p>
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};
