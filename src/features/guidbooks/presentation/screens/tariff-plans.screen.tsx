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
	useI18n,
	type PaginationState,
} from '@core';
import { GuidbookPageHeaderWrapper, TariffPlanAddEdit, TariffPlanFilter } from '@features';
import { convertTariffPlanToClient } from '@features/guidbooks/converters/tariff-plans';
import {
	createTariffPlan,
	deleteTariffPlan,
	getPaginatedTariffPlans,
	getTariffPlanById,
	updateTariffPlan,
} from '@features/guidbooks/services/tariff-plan.services';
import type { TariffPlan } from '@features/guidbooks/types/tariff-plans';
import {
	formatResetIntervalLabel,
	formatTariffPlanLimit,
	TariffPlanAddAndEditConfig,
	TariffPlanFilterConfig,
	useHeaderForm,
} from '@features/guidbooks/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';

const TariffPlansScreen = () => {
	const navigate = useAppNavigate();
	const { t } = useI18n();
	const [search] = useSearchParams();
	const [singleTariffPlan, setSingleTariffPlan] = useState<TariffPlan>();
	const [tableData, setTableData] = useState<TariffPlan[]>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);
	const [itemToDelete, setItemToDelete] = useState({ id: '', name: '' });

	const form = useHeaderForm<TariffPlan>(
		{
			filter: TariffPlanFilterConfig.defaultValues,
			edit: TariffPlanAddAndEditConfig.defaultValues,
			add: TariffPlanAddAndEditConfig.defaultValues,
		},
		{
			filter: TariffPlanFilterConfig.schema,
			edit: TariffPlanAddAndEditConfig.schema,
			add: TariffPlanAddAndEditConfig.schema,
		},
	);

	useEffect(() => {
		if (search.get('edit') && search.get('entityId')) {
			handleGetOneTableData(search.get('entityId')!);
		}
	}, [search]);

	useEffect(() => {
		if (singleTariffPlan) form.editForm.reset(singleTariffPlan);
	}, [singleTariffPlan]);

	useEffect(() => {
		handleGetTableData(paginationState);
	}, []);

	const handleGetTableData = (pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>) => {
		from(getPaginatedTariffPlans({ pagination }))
			.pipe(
				switchMap((response) => {
					const res = convertToPaginatedType(convertTariffPlanToClient)({
						...response.data,
						items: response.data.items ?? [],
						pageNumber: response.data.pageNumber ?? 1,
						totalPages: response.data.totalPages ?? 0,
						totalCount: response.data.totalCount ?? 0,
						pageSize: response.data.pageSize ?? 10,
						hasPreviousPage: response.data.hasPreviousPage ?? false,
						hasNextPage: response.data.hasNextPage ?? false,
					});
					return from([res]);
				}),
				tap((res) => {
					setTableData(res.items);
					setPaginationState(res.pagination);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('guides.tariffPlans.loadError'));
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const handleAddTableData = (data: TariffPlan) => {
		from(createTariffPlan(data))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('guides.tariffPlans.createError'));
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(paginationState);
					toast.success(t('guides.tariffPlans.addSuccess'));
					navigate('');
				}
			});
	};

	const handleDeleteTableData = (id: string) => {
		from(deleteTariffPlan(id))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('guides.tariffPlans.deleteError'));
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(paginationState);
					toast.success(t('guides.tariffPlans.deleteSuccess'));
				}
			});
	};

	const handleEditTableData = (data: TariffPlan) => {
		from(updateTariffPlan(data))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('guides.tariffPlans.editError'));
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(paginationState);
					toast.success(t('guides.tariffPlans.editSuccess'));
					navigate('');
				}
			});
	};

	const handleGetOneTableData = (id: string) => {
		from(getTariffPlanById(id))
			.pipe(
				switchMap((response) => from([convertTariffPlanToClient(response.data)])),
				tap((data) => setSingleTariffPlan(data)),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || t('guides.tariffPlans.loadError'));
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const onSaveHandle = useCallback(() => {
		handleAddTableData(form.addForm.getValues());
	}, [form.addForm]);

	const onEditHandle = useCallback(() => {
		handleEditTableData(form.editForm.getValues());
	}, [form.editForm]);

	const columns = useMemo<ColumnDef<TariffPlan>[]>(
		() => [
			{
				id: 'name',
				accessorKey: 'name',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.tariffPlans.columns.name')} />
				),
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				id: 'resetInterval',
				accessorKey: 'resetInterval',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.tariffPlans.columns.resetInterval')} />
				),
				cell: (info) => (
					<SimpleTableCell
						content={formatResetIntervalLabel(info.getValue() as string, t)}
					/>
				),
			},
			{
				id: 'credits',
				accessorKey: 'credits',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.tariffPlans.columns.credits')} />
				),
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				id: 'limit',
				header: () => <SimpleTableHeaderCell text={t('guides.tariffPlans.columns.limit')} />,
				cell: (info) => (
					<SimpleTableCell content={formatTariffPlanLimit(info.row.original.credits)} />
				),
			},
			{
				id: 'actions',
				accessorKey: 'id',
				header: () => <SimpleTableHeaderCell text={t('common.actions')} />,
				cell: (info) => (
					<SimpleTableCell
						content={
							<div className="flex gap-2">
								<EditIcon
									onClick={() => {
										navigate('', {
											entityId: info.row.original.id!,
											edit: 'true',
										});
									}}
								/>
								<DeleteIcon
									onClick={() => {
										setItemToDelete({
											id: info.row.original.id!,
											name: info.row.original.name,
										});
										navigate('', {
											entityId: info.row.original.id!,
											delete: 'true',
										});
									}}
								/>
							</div>
						}
					/>
				),
			},
		],
		[navigate, t],
	);

	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={search.get('add') ? onSaveHandle : onEditHandle}
				titles={{
					pageTitleKey: 'guides.tariffPlans.pageTitle',
					editTitleKey: 'guides.tariffPlans.editTitle',
					addTitleKey: 'guides.tariffPlans.addTitle',
				}}
				forms={form}
				formElements={{
					filter: TariffPlanFilter,
					add: TariffPlanAddEdit,
					edit: TariffPlanAddEdit,
				}}
			/>
			<SimpleTable
				data={tableData}
				columns={columns}
				paginationState={paginationState}
				onChangePaginationState={(newState) => {
					handleGetTableData(newState);
				}}
			/>
			<DeleteModal
				isOpen={!!search.get('delete') && !!search.get('entityId')}
				onCancel={() => navigate('')}
				onClose={() => navigate('')}
				onConfirm={() => {
					handleDeleteTableData(itemToDelete.id || search.get('entityId')!);
					navigate('');
				}}
				headerTitle={t('guides.deleteModal.title')}
			>
				{t('guides.deleteModal.tariffPlanQuestion')} {itemToDelete.name}
			</DeleteModal>
		</div>
	);
};

export default TariffPlansScreen;
