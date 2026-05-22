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
import { getDesignCalculationConstructionPurpose } from '@core/utils/helpers/design-calculation-mode.helper';
import { ConstructionPurpose } from '@api-gen';
import { RuConstructionPurposeLabels } from '@features/guidbooks/constants';
import {
	ConstructionsAdd,
	ConstructionsEdit,
	ConstructionsFilter,
	GuidbookPageHeaderWrapper,
} from '@features';
import {
	convertToClientConstructionsAddData,
	convertToClientConstructionsEditData,
	convertToServerConstructionsAddData,
	convertToServerConstructionsEditData,
	convertToServerConstructionsFilterData,
} from '@features/guidbooks/converters';
import { prepareConstructionEditDataForPersistence } from '@features/guidbooks/utils';
import {
	getGuidebooksCreate,
	getGuidebooksDelete,
	getGuidebooksDetail,
	getGuidebooksEdit,
	getGuidebooksPaginated,
} from '@features/guidbooks/services';
import {
	Guidebooks,
	getConstructionTypeLabel,
	RuCountryNamesMap,
	RuPriorityNamesSelectValues,
	type ConstructionsAddData,
	type ConstructionsEditData,
	type ConstructionsFilterData,
	type ConstructionTypeEnum,
	type Country,
} from '@features/guidbooks/types';
import {
	ConstructionsAddConfig,
	ConstructionsEditConfig,
	ConstructionsFilterConfig,
	useHeaderForm,
} from '@features/guidbooks/utils';
import type { ColumnDef } from '@tanstack/react-table';
import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';

const ConstructionsScreen = () => {
	const navigate = useAppNavigate();
	const { t, locale } = useI18n();
	const [search] = useSearchParams();
	const [singleMaterial, setSingleMaterial] = useState<ConstructionsEditData>();
	const [tableData, setTableData] = useState<ConstructionsAddData[]>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [itemToDelete, setItemToDelete] = useState({
		id: '',
		name: '',
	});

	const forms = useHeaderForm(
		{
			filter: ConstructionsFilterConfig.defaultValues,
			edit: ConstructionsEditConfig.defaultValues,
			add: ConstructionsAddConfig.defaultValues,
		},
		{
			filter: ConstructionsFilterConfig.schema,
			edit: ConstructionsEditConfig.schema,
			add: ConstructionsAddConfig.schema,
		},
	);

	const didApplySessionConstructionPurpose = useRef(false);
	useEffect(() => {
		if (didApplySessionConstructionPurpose.current) return;
		didApplySessionConstructionPurpose.current = true;
		const purpose = getDesignCalculationConstructionPurpose();
		if (purpose) {
			forms.filterForm.setValue('constructionPurpose', purpose);
		}
	}, [forms.filterForm]);

	const columns = useMemo(() => {
		const cols: ColumnDef<ConstructionsAddData>[] = [
			{
				accessorKey: 'name',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.constructions.columns.code')} />
				),
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'description',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.constructions.columns.name')} />
				),
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'priority',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.constructions.columns.priority')} />
				),
				cell: (info) => {
					const v = info.getValue() as string;
					const label =
						RuPriorityNamesSelectValues.find((o) => o.value === v)?.label ?? v;
					return <SimpleTableCell content={label || '—'} />;
				},
			},
			{
				accessorKey: 'rw',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.constructions.columns.rw')} />
				),
				cell: (info) => (
					<SimpleTableCell content={(info.getValue() as string) || '—'} />
				),
			},
			{
				accessorKey: 'lnw',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.constructions.columns.lnw')} />
				),
				cell: (info) => (
					<SimpleTableCell content={(info.getValue() as string) || '—'} />
				),
			},
			{
				accessorKey: 'issuerName',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.constructions.columns.issuer')} />
				),
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'constructionType',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.constructions.columns.type')} />
				),
				cell: (info) => (
					<SimpleTableCell
						content={getConstructionTypeLabel(
							info.getValue() as string,
							locale === 'en' ? 'en' : 'ru',
						)}
					/>
				),
			},
			{
				accessorKey: 'constructionPurpose',
				header: () => (
					<SimpleTableHeaderCell
						text={t('guides.constructions.columns.constructionPurpose')}
					/>
				),
				cell: (info) => {
					const v = info.getValue() as string;
					const label =
						v && v in RuConstructionPurposeLabels
							? RuConstructionPurposeLabels[v as ConstructionPurpose]
							: '—';
					return <SimpleTableCell content={label} />;
				},
			},
			{
				accessorKey: 'country',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.constructions.columns.country')} />
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.row.original.country
							.map((ct) => RuCountryNamesMap[ct as Country])
							.join(', ')}
					/>
				),
			},
			{
				accessorKey: 'id',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.constructions.columns.actions')} />
				),
				cell: (info) => {
					return (
						<SimpleTableCell
							content={
								<div className="flex gap-2">
									<EditIcon
										onClick={() =>
											navigate('', {
												edit: 'true',
												entityId: info.row.original.id!,
											})
										}
									/>
									<DeleteIcon
										onClick={() => {
											{
												setItemToDelete({
													id: info.row.original.id!,
													name: info.row.original.name!,
												});
											}
											setIsModalOpen(true);
										}}
									/>
								</div>
							}
						/>
					);
				},
			},
		];
		return cols;
	}, [t, navigate]);

	const [
		filterName,
		filterConstructionType,
		filterConstructionPurpose,
		filterRegion,
		filterPriority,
		filterRw,
		filterLnw,
	] = forms.filterForm.watch([
		'name',
		'constructionType',
		'constructionPurpose',
		'country',
		'priority',
		'rw',
		'lnw',
	]);

	useEffect(() => {
		handleGetTableData(
			forms.filterForm.getValues() as ConstructionsFilterData,
			paginationState,
		);
	}, [
		filterName,
		filterConstructionType,
		filterConstructionPurpose,
		filterRegion,
		filterPriority,
		filterRw,
		filterLnw,
	]);

	const handleGetTableData = (
		data: ConstructionsFilterData,
		pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
	) => {
		from(
			getGuidebooksPaginated({
				data: convertToServerConstructionsFilterData(data),
				guidebookType: Guidebooks.CONSTRUCTION,
				pagination,
			}),
		)
			.pipe(
				switchMap((response: AxiosResponse) => {
					const res = convertToPaginatedType(convertToClientConstructionsAddData)(
						response.data,
					);
					return from([res]);
				}),
				tap((res) => {
					setTableData(res.items);
					setPaginationState(res.pagination);
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

	const handleGetOneTableData = (id: string) => {
		from(getGuidebooksDetail({ id, guidebookType: Guidebooks.CONSTRUCTION }))
			.pipe(
				switchMap((response: AxiosResponse) => {
					const data = prepareConstructionEditDataForPersistence(
						convertToClientConstructionsEditData(response.data),
					);
					return from([data]);
				}),
				tap((data) => setSingleMaterial(data)),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const handleAddTableData = (data: ConstructionsAddData) => {
		from(
			getGuidebooksCreate({
				data: convertToServerConstructionsAddData(data),
				guidebookType: Guidebooks.CONSTRUCTION,
			}),
		)
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
					Object.entries(data).forEach(([key, value]) => {
						if (!['noizeIsolationIndex', 'noizeImpactIndex', 'notice'].includes(key)) {
							sessionStorage.setItem(key, JSON.stringify(value));
						}
					});

					handleGetTableData(
						forms.filterForm.getValues() as ConstructionsFilterData,
						paginationState,
					);
					toast.success(t('guides.constructions.addSuccess'));
					navigate('');
				}
			});
	};

	const handleEditTableData = (data: ConstructionsEditData) => {
		const prepared = prepareConstructionEditDataForPersistence(data);
		from(
			getGuidebooksEdit({
				data: convertToServerConstructionsEditData(prepared),
				guidebookType: Guidebooks.CONSTRUCTION,
			}),
		)
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
					handleGetTableData(
						forms.filterForm.getValues() as ConstructionsFilterData,
						paginationState,
					);
					toast.success(t('guides.constructions.editSuccess'));
					navigate('');
				}
			});
	};

	const handleDeleteTableData = (id: string) => {
		from(getGuidebooksDelete({ data: { id }, guidebookType: Guidebooks.CONSTRUCTION }))
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
					handleGetTableData(
						forms.filterForm.getValues() as ConstructionsFilterData,
						paginationState,
					);
					toast.success(t('guides.constructions.deleteSuccess'));
				}
			});
	};

	useEffect(() => {
		if (singleMaterial) forms.editForm.reset(singleMaterial);
	}, [singleMaterial]);

	useEffect(() => {
		if (search.get('edit') && search.get('entityId')) {
			handleGetOneTableData(search.get('entityId')!);
		}
	}, [search]);

	const onSaveHandle = useCallback(() => {
		handleAddTableData(forms.addForm.getValues() as ConstructionsAddData);
	}, [handleAddTableData, forms.editForm.getValues()]);

	const onEditHandle = useCallback(() => {
		handleEditTableData(forms.editForm.getValues() as ConstructionsEditData);
	}, [handleEditTableData, forms.editForm.getValues()]);

	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={!!search.get('add') ? onSaveHandle : onEditHandle}
				titles={{
					pageTitleKey: 'guides.constructions.pageTitle',
					editTitleKey: 'guides.constructions.editTitle',
					addTitleKey: 'guides.constructions.addTitle',
				}}
				forms={forms}
				formElements={{
					filter: ConstructionsFilter,
					add: ConstructionsAdd,
					edit: ConstructionsEdit,
				}}
			/>
			<SimpleTable
				data={tableData}
				columns={columns}
				paginationState={paginationState}
				onChangePaginationState={(newState) => {
					handleGetTableData(
						forms.filterForm.getValues() as ConstructionsFilterData,
						newState,
					);
				}}
			/>
			<DeleteModal
				isOpen={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				onClose={() => setIsModalOpen(false)}
				onConfirm={() => {
					handleDeleteTableData(itemToDelete.id);
					setIsModalOpen(false);
				}}
				headerTitle={t('guides.deleteModal.title')}
			>
				{t('guides.deleteModal.constructionQuestion')} {itemToDelete.name}
			</DeleteModal>
		</div>
	);
};

export default ConstructionsScreen;
