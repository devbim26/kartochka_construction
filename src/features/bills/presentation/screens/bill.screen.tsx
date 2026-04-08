import type { PaginationState } from '@core';
import {
	convertToPaginatedType,
	DeleteIcon,
	DownloadIcon,
	EditIcon,
	paginationStateDefault,
	Select,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAccessValidator,
	useAppNavigate,
	useI18n,
	UserRoles,
} from '@core';
import { convertBillToClient } from '@features/bills/converters';
import { createBillByAdmin, deleteBill, getPaginatedBills } from '@features/bills/services';
import { getPaginatedSubscriptions } from '@features/subscriptions/services';
import type { Bill, BillFilter } from '@features/bills/types';
import { getPaginatedUsers } from '@features/users/services';
import { getBillColumns } from '@features/bills/utils';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { BillHeader, BillListActionModal, BillStatusChange } from '../components';

export const BillScreen = () => {
	const form = useForm<BillFilter>({
		defaultValues: { number: '', date: '', clientName: '', billType: undefined },
	});
	const { watch, getValues } = form;
	const [number, date, clientName, billType] = watch([
		'number',
		'date',
		'clientName',
		'billType',
	]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);
	const [tableData, setTableData] = useState<Array<Bill>>([]);
	const [search] = useSearchParams();
	const navigate = useAppNavigate();
	const { t } = useI18n();
	const { validate } = useAccessValidator();
	const isAdmin = validate(UserRoles.Admin);
	const [selectedUserId, setSelectedUserId] = useState('');
	const [selectedSubscriptionId, setSelectedSubscriptionId] = useState('');
	const [userOptions, setUserOptions] = useState<Array<{ label: string; value: string }>>([]);
	const [subscriptionOptions, setSubscriptionOptions] = useState<
		Array<{ label: string; value: string }>
	>([]);

	const handleGetTableData = (
		data: BillFilter,
		pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
	) => {
		from(
			getPaginatedBills({
				data,
				pagination,
			}),
		)
			.pipe(
				switchMap((response) => {
					const res = convertToPaginatedType(convertBillToClient)({
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
					setTableData(res.items);
					setPaginationState(res.pagination);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('bills.loadError'));
					}
					return from([null]);
				}),
			)
			.subscribe();
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
					handleGetTableData(getValues(), paginationState);
					toast.success(t('bills.deleteSuccess'));
					navigate('');
				}
			});
	};

	const handleDownloadFile = () => {
		const bill = tableData.find((bill) => bill.id === search.get('id'));
		if (bill) {
			const link = document.createElement('a');
			link.href = bill.fileUrl;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else {
			toast.error(t('bill.notFound'));
		}
	};

	const handleCreateBill = () => {
		if (!selectedUserId) {
			toast.error(t('bills.selectUser'));
			return;
		}
		if (!selectedSubscriptionId) {
			toast.error(t('bills.selectSubscription'));
			return;
		}

		from(
			createBillByAdmin({
				userId: selectedUserId,
				subscriptionId: selectedSubscriptionId,
			}),
		)
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('bills.createError'));
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					toast.success(t('bills.createSuccess'));
					handleGetTableData(getValues(), paginationState);
					setSelectedUserId('');
					setSelectedSubscriptionId('');
					navigate('');
				}
			});
	};

	useEffect(() => {
		handleGetTableData(getValues(), paginationState);
	}, [number, date, clientName, billType, search]);

	useEffect(() => {
		if (!isAdmin || !search.get('add')) return;

		from(
			Promise.all([
				getPaginatedUsers({ pageNumber: 1, pageSize: 100 }),
				getPaginatedSubscriptions({
					data: { name: '', description: 'all', numberOfReports: '1', price: '0' },
					pagination: { pageNumber: 1, pageSize: 100 },
				}),
			]),
		)
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('common.loadError'));
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (!response) return;
				const [usersResponse, subscriptionsResponse] = response;
				setUserOptions(
					(usersResponse.data.items ?? [])
						.filter((user) => !!user.id)
						.map((user) => ({
							value: user.id!,
							label: user.companyName || user.directorFullName || t('common.noTitle'),
						})),
				);
				setSubscriptionOptions(
					(subscriptionsResponse.data.items ?? [])
						.filter((subscription) => !!subscription.id)
						.map((subscription) => ({
							value: subscription.id!,
							label: subscription.name || t('common.noTitle'),
						})),
				);
			});
	}, [isAdmin, search]);

	return (
		<div className="flex w-full flex-col gap-[40px]">
			<FormProvider {...form}>
				<BillHeader />
			</FormProvider>{' '}
			<SimpleTable
				data={tableData}
				columns={[
					...getBillColumns(t),
					{
						id: 'actions',
						accessorKey: 'id',
						header: () => <SimpleTableHeaderCell text={t('common.actions')} />,
						cell: (info) => (
							<SimpleTableCell
								content={
									<div className="flex gap-2">
										<DownloadIcon
											onClick={() => {
												navigate('', {
													id: info.row.original.id,
													download: 'true',
												});
											}}
										/>
										<EditIcon
											onClick={() => {
												navigate('', {
													id: info.row.original.id,
													edit: 'true',
													status: info.row.original.billType,
													userId: info.row.original.userId,
												});
											}}
										/>
										<DeleteIcon
											onClick={() => {
												navigate('', {
													id: info.row.original.id,
													delete: 'true',
												});
											}}
										/>
									</div>
								}
							/>
						),
					},
				]}
				paginationState={paginationState}
				onChangePaginationState={(newState) => {
					handleGetTableData(getValues(), newState);
				}}
			/>
			<BillListActionModal
				onConfirm={handleCreateBill}
				confirmTitle={t('common.create')}
				headerTitle={t('bills.modal.createTitle')}
				onClose={() => {
					setSelectedUserId('');
					setSelectedSubscriptionId('');
					navigate('');
				}}
				isOpen={!!search.get('add')}
				contentClassName="visible min-w-[500px]"
			>
				<div className="flex flex-col gap-3">
					<Select
						label={t('bills.fields.user')}
						value={selectedUserId}
						onChange={(value) => setSelectedUserId((value as string) || '')}
						options={userOptions}
						placeholder={t('bills.placeholders.user')}
						wrapperClassname="ring-input-border-primary"
					/>
					<Select
						label={t('bills.fields.subscription')}
						value={selectedSubscriptionId}
						onChange={(value) => setSelectedSubscriptionId((value as string) || '')}
						options={subscriptionOptions}
						placeholder={t('bills.placeholders.subscription')}
						wrapperClassname="ring-input-border-primary"
					/>
				</div>
			</BillListActionModal>
			<BillListActionModal
				onConfirm={() => handleDeleteTableData(search.get('id')!)}
				confirmTitle={t('common.delete')}
				headerTitle={t('bills.modal.deleteTitle')}
				onClose={() => navigate('')}
				isOpen={!!search.get('id') && !!search.get('delete')}
			/>
			<BillListActionModal
				onConfirm={() => handleDeleteTableData(search.get('id')!)}
				confirmTitle={t('common.edit')}
				headerTitle={t('bills.modal.editTitle')}
				hasSubmitButton={false}
				onClose={() => navigate('')}
				isOpen={!!search.get('id') && !!search.get('edit') && !!search.get('status')}
				contentClassName="visible items-center"
			>
				<BillStatusChange />
			</BillListActionModal>
			<BillListActionModal
				onConfirm={handleDownloadFile}
				confirmTitle={t('common.download')}
				headerTitle={t('bills.modal.downloadTitle')}
				onClose={() => navigate('')}
				isOpen={!!search.get('id') && !!search.get('download')}
			/>
		</div>
	);
};
