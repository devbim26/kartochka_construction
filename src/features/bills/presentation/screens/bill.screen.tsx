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
	UserRoles,
} from '@core';
import { convertBillToClient } from '@features/bills/converters';
import { createBillByAdmin, deleteBill, getPaginatedBills } from '@features/bills/services';
import { getPaginatedSubscriptions } from '@features/subscriptions/services';
import type { Bill, BillFilter } from '@features/bills/types';
import { getPaginatedUsers } from '@features/users/services';
import { billColumns } from '@features/bills/utils';
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
						toast.error(error.response?.data?.message || 'Ошибка загрузки счетов');
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
					toast.success('Счет успешно удален');
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
			toast.error('Счет не найден');
		}
	};

	const handleCreateBill = () => {
		if (!selectedUserId) {
			toast.error('Выберите пользователя');
			return;
		}
		if (!selectedSubscriptionId) {
			toast.error('Выберите подписку');
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
						toast.error(error.response?.data?.message || 'Ошибка создания счета');
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					toast.success('Счет успешно создан');
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
						toast.error(error.response?.data?.message || 'Ошибка загрузки данных');
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
							label: user.companyName || user.directorFullName || 'Без названия',
						})),
				);
				setSubscriptionOptions(
					(subscriptionsResponse.data.items ?? [])
						.filter((subscription) => !!subscription.id)
						.map((subscription) => ({
							value: subscription.id!,
							label: subscription.name || 'Без названия',
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
					...billColumns,
					{
						id: 'actions',
						accessorKey: 'id',
						header: () => <SimpleTableHeaderCell text={'Действия'} />,
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
				confirmTitle="Создать"
				headerTitle="Создать счет?"
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
						label="Пользователь"
						value={selectedUserId}
						onChange={(value) => setSelectedUserId((value as string) || '')}
						options={userOptions}
						placeholder="Выберите пользователя"
						wrapperClassname="ring-input-border-primary"
					/>
					<Select
						label="Подписка"
						value={selectedSubscriptionId}
						onChange={(value) => setSelectedSubscriptionId((value as string) || '')}
						options={subscriptionOptions}
						placeholder="Выберите подписку"
						wrapperClassname="ring-input-border-primary"
					/>
				</div>
			</BillListActionModal>
			<BillListActionModal
				onConfirm={() => handleDeleteTableData(search.get('id')!)}
				confirmTitle="Удалить"
				headerTitle="Удалить cчет?"
				onClose={() => navigate('')}
				isOpen={!!search.get('id') && !!search.get('delete')}
			/>
			<BillListActionModal
				onConfirm={() => handleDeleteTableData(search.get('id')!)}
				confirmTitle="Редактировать"
				headerTitle="Редактировать cчет?"
				hasSubmitButton={false}
				onClose={() => navigate('')}
				isOpen={!!search.get('id') && !!search.get('edit') && !!search.get('status')}
				contentClassName="visible items-center"
			>
				<BillStatusChange />
			</BillListActionModal>
			<BillListActionModal
				onConfirm={handleDownloadFile}
				confirmTitle="Скачать"
				headerTitle="Скачать cчет?"
				onClose={() => navigate('')}
				isOpen={!!search.get('id') && !!search.get('download')}
			/>
		</div>
	);
};
