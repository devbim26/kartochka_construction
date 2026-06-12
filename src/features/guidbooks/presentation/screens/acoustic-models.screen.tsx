import {
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
import {
	AcousticModelAddEdit,
	AcousticModelFilter,
	GuidbookPageHeaderWrapper,
} from '@features';
import { convertAcousticModelToClient } from '@features/guidbooks/converters/acoustic-models';
import {
	deleteAcousticModel,
	getAcousticModels,
	saveAcousticModel,
} from '@features/guidbooks/services/acoustic-model.services';
import type { AcousticModel, AcousticModelFilters } from '@features/guidbooks/types/acoustic-models';
import {
	AcousticModelAddAndEditConfig,
	AcousticModelFilterConfig,
	useHeaderForm,
} from '@features/guidbooks/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';

const hasSavedCoefficient = (model: AcousticModel) =>
	model.coefficient !== '' && !Number.isNaN(+model.coefficient);

const AcousticModelsScreen = () => {
	const navigate = useAppNavigate();
	const { t } = useI18n();
	const [search] = useSearchParams();
	const [tableData, setTableData] = useState<AcousticModel[]>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);
	const [itemToDelete, setItemToDelete] = useState({ id: '', name: '' });

	const form = useHeaderForm<AcousticModel>(
		{
			filter: AcousticModelFilterConfig.defaultValues,
			edit: AcousticModelAddAndEditConfig.defaultValues,
			add: AcousticModelAddAndEditConfig.defaultValues,
		},
		{
			filter: AcousticModelFilterConfig.schema,
			edit: AcousticModelAddAndEditConfig.schema,
			add: AcousticModelAddAndEditConfig.schema,
		},
	);

	const [filterName] = form.filterForm.watch(['name']);

	useEffect(() => {
		if (search.get('edit') && search.get('entityId')) {
			handleGetOneTableData(search.get('entityId')!);
		}
	}, [search, tableData]);

	useEffect(() => {
		handleGetTableData(form.filterForm.getValues());
	}, [filterName]);

	const handleGetTableData = (filters: AcousticModelFilters) => {
		from(getAcousticModels(filters))
			.pipe(
				switchMap((response) => {
					const items = (response.data ?? []).map(convertAcousticModelToClient);
					return from([items]);
				}),
				tap((items) => {
					setTableData(items);
					setPaginationState({
						pageNumber: 1,
						pageSize: Math.max(10, items.length),
						totalCount: items.length,
						totalPages: 1,
						hasNextPage: false,
						hasPreviousPage: false,
					});
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(
							error.response?.data?.message || t('guides.acousticModels.loadError'),
						);
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const handleSaveTableData = (data: AcousticModel) => {
		from(saveAcousticModel(data))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(
							error.response?.data?.message || t('guides.acousticModels.saveError'),
						);
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(form.filterForm.getValues());
					toast.success(t('guides.acousticModels.saveSuccess'));
					navigate('');
				}
			});
	};

	const handleDeleteTableData = (openRouterModelId: string) => {
		from(deleteAcousticModel(openRouterModelId))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(
							error.response?.data?.message || t('guides.acousticModels.deleteError'),
						);
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(form.filterForm.getValues());
					toast.success(t('guides.acousticModels.deleteSuccess'));
				}
			});
	};

	const handleGetOneTableData = (entityId: string) => {
		const model = tableData.find((item) => item.openRouterModelId === entityId);
		if (model) {
			form.editForm.reset(model);
		}
	};

	const onSaveHandle = useCallback(() => {
		handleSaveTableData(form.addForm.getValues());
	}, [form.addForm]);

	const onEditHandle = useCallback(() => {
		handleSaveTableData(form.editForm.getValues());
	}, [form.editForm]);

	const columns = useMemo<ColumnDef<AcousticModel>[]>(
		() => [
			{
				id: 'name',
				accessorKey: 'name',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.acousticModels.columns.name')} />
				),
				cell: (info) => <SimpleTableCell content={(info.getValue() as string) || '—'} />,
			},
			{
				id: 'openRouterModelId',
				accessorKey: 'openRouterModelId',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.acousticModels.columns.modelId')} />
				),
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				id: 'coefficient',
				accessorKey: 'coefficient',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.acousticModels.columns.coefficient')} />
				),
				cell: (info) => {
					const value = info.getValue() as string;
					return <SimpleTableCell content={value !== '' ? value : '—'} />;
				},
			},
			{
				id: 'actions',
				accessorKey: 'openRouterModelId',
				header: () => <SimpleTableHeaderCell text={t('common.actions')} />,
				cell: (info) => {
					const row = info.row.original;
					const canManage = hasSavedCoefficient(row);
					return (
						<SimpleTableCell
							content={
								<div className="flex gap-2">
									{canManage ? (
										<EditIcon
											onClick={() => {
												navigate('', {
													entityId: row.openRouterModelId,
													edit: 'true',
												});
											}}
										/>
									) : null}
									{canManage ? (
										<DeleteIcon
											onClick={() => {
												setItemToDelete({
													id: row.openRouterModelId,
													name: row.name || row.openRouterModelId,
												});
												navigate('', {
													entityId: row.openRouterModelId,
													delete: 'true',
												});
											}}
										/>
									) : null}
								</div>
							}
						/>
					);
				},
			},
		],
		[navigate, t],
	);

	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={search.get('add') ? onSaveHandle : onEditHandle}
				titles={{
					pageTitleKey: 'guides.acousticModels.pageTitle',
					editTitleKey: 'guides.acousticModels.editTitle',
					addTitleKey: 'guides.acousticModels.addTitle',
				}}
				forms={form}
				formElements={{
					filter: AcousticModelFilter,
					add: AcousticModelAddEdit,
					edit: AcousticModelAddEdit,
				}}
			/>
			<SimpleTable
				data={tableData}
				columns={columns}
				paginationState={paginationState}
				onChangePaginationState={(newState) => {
					setPaginationState((prev) => ({ ...prev, ...newState }));
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
				{t('guides.deleteModal.acousticModelQuestion')} {itemToDelete.name}
			</DeleteModal>
		</div>
	);
};

export default AcousticModelsScreen;
