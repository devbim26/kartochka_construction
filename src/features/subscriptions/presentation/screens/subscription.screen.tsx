import {
	convertToPaginatedType,
	DeleteIcon,
	DeleteModal,
	EditIcon,
	paginationStateDefault,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
	type PaginationState,
} from '@core';
import { useHeaderForm } from '@features/guidbooks/utils';
import { convertSubscriptionToClient } from '@features/subscriptions/converters';
import {
	createSubscription,
	deleteSubscription,
	getPaginatedSubscriptions,
	getSubscriptionById,
	updateSubscription,
} from '@features/subscriptions/services';
import type { Subscription, SubscriptionFilters } from '@features/subscriptions/types';
import {
	SubscriptionAddAndEditConfig,
	subscriptionColumns,
	SubscriptionFilterConfig,
} from '@features/subscriptions/utils';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import {
	SubscriptionAddEdit,
	SubscriptionFilter,
	SubscriptionPageHeaderWrapper,
} from '../components';

const SubscriptionScreen = () => {
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const [tableData, setTableData] = useState<Array<Subscription>>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);

	const form = useHeaderForm<Subscription>(
		{
			filter: SubscriptionFilterConfig.defaultValues,
			edit: SubscriptionAddAndEditConfig.defaultValues,
			add: SubscriptionAddAndEditConfig.defaultValues,
		},
		{
			filter: SubscriptionFilterConfig.schema,
			edit: SubscriptionAddAndEditConfig.schema,
			add: SubscriptionAddAndEditConfig.schema,
		},
	);

	const [filterName, filterNumberOfReports, filterPrice] = form.filterForm.watch([
		'name',
		'numberOfReports',
		'price',
	]);

	useEffect(() => {
		if (search.get('edit') && search.get('id')) {
			handleGetOneTableData(search.get('id')!);
		}
	}, [search]);

	useEffect(() => {
		handleGetTableData(form.filterForm.getValues(), paginationState);
	}, [filterName, filterNumberOfReports, filterPrice]);

	const handleGetTableData = (
		data: SubscriptionFilters,
		pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
	) => {
		from(getPaginatedSubscriptions({ data: data, pagination: pagination }))
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
					setTableData(res.items);
					setPaginationState(res.pagination);
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

	const handleAddTableData = (data: Subscription) => {
		from(createSubscription(data))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || 'Ошибка создания подписки');
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success('Подписка успешно добавлена');
					navigate('');
				}
			});
	};

	const handleDeleteTableData = (id: string) => {
		from(deleteSubscription(id))
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
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success('Подписка успешно удалена');
				}
			});
	};

	const handleEditTableData = (data: Subscription) => {
		from(updateSubscription(data))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(
							error.response?.data?.message || 'Ошибка редактирования подписки',
						);
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success('Подписка успешно отредактирована');
					navigate('');
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
					if (data) form.editForm.reset(data);
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

	const onSaveHandle = useCallback(() => {
		handleAddTableData(form.addForm.getValues());
	}, [handleAddTableData, form.addForm.getValues()]);

	const onEditHandle = useCallback(() => {
		handleEditTableData(form.editForm.getValues());
	}, [handleEditTableData, form.editForm.getValues()]);

	return (
		<div className="flex w-full flex-col gap-[40px]">
			<SubscriptionPageHeaderWrapper
				onSave={search.get('add') ? onSaveHandle : onEditHandle}
				titles={{
					pageTitle: 'Конструктор подписок',
					editTitle: 'Редактировать подписку',
					addTitle: 'Добавить подписку',
				}}
				forms={form}
				formElements={{
					filter: SubscriptionFilter,
					add: SubscriptionAddEdit,
					edit: SubscriptionAddEdit,
				}}
			/>
			<SimpleTable
				data={tableData}
				columns={[
					...subscriptionColumns,
					{
						id: 'actions',
						accessorKey: 'id',
						header: () => <SimpleTableHeaderCell text={'Действия'} />,
						cell: (info) => (
							<SimpleTableCell
								content={
									<div className="flex gap-2">
										<EditIcon
											onClick={() => {
												navigate('', {
													id: info.row.original.id!,
													edit: 'true',
												});
											}}
										/>
										<DeleteIcon
											onClick={() => {
												navigate('', {
													id: info.row.original.id!,
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
					handleGetTableData(form.filterForm.getValues(), newState);
				}}
			/>
			<DeleteModal
				isOpen={!!search.get('delete') && !!search.get('id')}
				onCancel={() => navigate('')}
				onClose={() => navigate('')}
				onConfirm={() => {
					handleDeleteTableData(search.get('id')!);
					navigate('');
				}}
				headerTitle="Подтвердите действие"
			>
				Вы уверены, что хотите удалить подписку?
			</DeleteModal>
		</div>
	);
};

export default SubscriptionScreen;
