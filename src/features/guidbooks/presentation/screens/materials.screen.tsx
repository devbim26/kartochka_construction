import {
	convertToPaginatedType,
	DeleteIcon,
	DeleteModal,
	EditIcon,
	getAxiosErrorMessage,
	paginationStateDefault,
	SafeImage,
	ShortenedTextCell,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
	useI18n,
	type PaginationState,
} from '@core';
import { GuidbookPageHeaderWrapper, MaterialsAddAndEdit, MaterialsFilter } from '@features';
import {
	convertToClientMaterialsAddAndEditData,
	convertToServerMaterialsAddData,
	convertToServerMaterialsEditData,
	convertToServerMaterialsFilterData,
} from '@features/guidbooks/converters';
import {
	exportMaterials,
	getGuidebooksCreate,
	getGuidebooksDelete,
	getGuidebooksDetail,
	getGuidebooksEdit,
	getGuidebooksPaginated,
} from '@features/guidbooks/services';
import { getMaterialPurposeLabel } from '@features/guidbooks/constants';
import {
	Guidebooks,
	getMaterialTypeLabel,
	RuCountryNamesMap,
	type Country,
	type MaterialsAddAndEditData,
	type MaterialsFilterData,
} from '@features/guidbooks/types';
import {
	MaterialsAddAndEditConfig,
	MaterialsFilterConfig,
	resolveExportDownloadAction,
	triggerDownloadAction,
	useHeaderForm,
} from '@features/guidbooks/utils';

import type { ColumnDef } from '@tanstack/react-table';
import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';

const MaterialsScreen = () => {
	const navigate = useAppNavigate();
	const { t, locale } = useI18n();
	const [search] = useSearchParams();
	const [singleMaterial, setSingleMaterial] = useState<MaterialsAddAndEditData>();
	const [tableData, setTableData] = useState<Array<MaterialsAddAndEditData>>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [itemToDelete, setItemToDelete] = useState({
		id: '',
		name: '',
	});
	const [isExporting, setIsExporting] = useState(false);

	const forms = useHeaderForm(
		{
			filter: MaterialsFilterConfig.defaultValues,
			edit: MaterialsAddAndEditConfig.defaultValues,
			add: MaterialsAddAndEditConfig.defaultValues,
		},
		{
			filter: MaterialsFilterConfig.schema,
			edit: MaterialsAddAndEditConfig.schema,
			add: MaterialsAddAndEditConfig.schema,
		},
	);

	const columns = useMemo(() => {
		const cols: ColumnDef<MaterialsAddAndEditData>[] = [
			{
				accessorKey: 'imageUrl',
				header: () => <SimpleTableHeaderCell text={t('guides.materials.columns.image')} />,
				cell: (info) => {
					return (
						<SimpleTableCell
							contentClassName="flex size-[80px] items-center"
							content={
								<SafeImage
									src={info.row.original.imageUrl}
									alt=""
									className="size-[80px] rounded-lg object-contain"
									fallbackClassName="size-[80px]"
								/>
							}
						/>
					);
				},
			},
			{
				accessorKey: 'name',
				header: () => <SimpleTableHeaderCell text={t('guides.materials.columns.name')} />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'shortName',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.materials.columns.shortName')} />
				),
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'description',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.materials.columns.description')} />
				),
				cell: (info) => (
					<ShortenedTextCell
						classNames={{
							textClassName: 'max-w-[100px]',
							containerClassName: 'justify-center',
						}}
						text={info.getValue() as string}
					/>
				),
			},
			{
				accessorKey: 'materialType',
				header: () => <SimpleTableHeaderCell text={t('guides.materials.columns.type')} />,
				cell: (info) => (
					<SimpleTableCell
						content={getMaterialTypeLabel(
							info.getValue() as string,
							locale === 'en' ? 'en' : 'ru',
						)}
					/>
				),
			},
			{
				accessorKey: 'materialPurpose',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.materials.columns.materialPurpose')} />
				),
				cell: (info) => (
					<SimpleTableCell
						content={getMaterialPurposeLabel(
							info.getValue() as string,
							locale === 'en' ? 'en' : 'ru',
						)}
					/>
				),
			},
			{
				accessorKey: 'country',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.materials.columns.country')} />
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
				accessorKey: 'density',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.materials.columns.density')} />
				),
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'thickness',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.materials.columns.thickness')} />
				),
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'velocity',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.materials.columns.velocity')} />
				),
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'materialCoefficient',
				header: () => (
					<SimpleTableHeaderCell
						text={t('guides.materials.columns.materialCoefficient')}
					/>
				),
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'lossFactor',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.materials.columns.lossFactor')} />
				),
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'youngModulus',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.materials.columns.youngModulus')} />
				),
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'damping',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.materials.columns.damping')} />
				),
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'solid',
				header: () => <SimpleTableHeaderCell text={t('guides.materials.columns.solid')} />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'actions',
				header: () => (
					<SimpleTableHeaderCell text={t('guides.materials.columns.actions')} />
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
													name: info.row.original.name,
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
			//цвет
			//штриховка
			//коэффициент для расчетов
			//коэффициент затухания
			//процентная доля твердой массы
		];
		return cols;
	}, [t, locale, navigate]);

	const [filterName, filterMaterialType, filterMaterialPurpose, filterDensity, filterThickness] =
		forms.filterForm.watch(['name', 'materialType', 'materialPurpose', 'density', 'thickness']);

	const handleGetTableData = (
		data: MaterialsFilterData,
		pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
	) => {
		from(
			getGuidebooksPaginated({
				data: convertToServerMaterialsFilterData(data),
				guidebookType: Guidebooks.MATERIAL,
				pagination,
			}),
		)
			.pipe(
				switchMap((response: AxiosResponse) => {
					const res = convertToPaginatedType(convertToClientMaterialsAddAndEditData)(
						response.data,
						pagination,
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
		from(getGuidebooksDetail({ id, guidebookType: Guidebooks.MATERIAL }))
			.pipe(
				switchMap((response: AxiosResponse) => {
					const data = convertToClientMaterialsAddAndEditData(response.data);
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

	const handleAddTableData = (data: MaterialsAddAndEditData) => {
		from(
			getGuidebooksCreate({
				data: convertToServerMaterialsAddData(data),
				guidebookType: Guidebooks.MATERIAL,
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

					handleGetTableData(forms.filterForm.getValues(), paginationState);
					toast.success(t('guides.materials.addSuccess'));
					navigate('');
				}
			});
	};

	const handleEditTableData = (data: MaterialsAddAndEditData) => {
		from(
			getGuidebooksEdit({
				data: convertToServerMaterialsEditData(data),
				guidebookType: Guidebooks.MATERIAL,
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
					handleGetTableData(forms.filterForm.getValues(), paginationState);
					toast.success(t('guides.materials.editSuccess'));
					navigate('');
				}
			});
	};

	const handleDeleteTableData = (id: string) => {
		from(getGuidebooksDelete({ data: { id: id }, guidebookType: Guidebooks.MATERIAL }))
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
					handleGetTableData(forms.filterForm.getValues(), paginationState);
					toast.success(t('guides.materials.deleteSuccess'));
				}
			});
	};

	const handleExportTableData = async () => {
		setIsExporting(true);
		try {
			const response = await exportMaterials(
				convertToServerMaterialsFilterData(forms.filterForm.getValues()),
			);
			if (response.status !== 200) {
				toast.error(t('guides.export.error'));
				return;
			}

			const action = await resolveExportDownloadAction(
				response as AxiosResponse<unknown>,
				'materials-export.xlsx',
			);
			if (!action) {
				toast.error(t('guides.export.error'));
				return;
			}
			await triggerDownloadAction(action);
			toast.success(t('guides.export.success'));
		} catch (error) {
			if (error instanceof AxiosError) {
				const message = await getAxiosErrorMessage(error, t('guides.export.error'));
				toast.error(message);
			}
		} finally {
			setIsExporting(false);
		}
	};

	useEffect(() => {
		handleGetTableData(forms.filterForm.getValues() as MaterialsFilterData, paginationState);
	}, [filterDensity, filterName, filterThickness, filterMaterialType, filterMaterialPurpose]);

	useEffect(() => {
		if (singleMaterial) forms.editForm.reset(singleMaterial);
	}, [singleMaterial]);

	useEffect(() => {
		if (search.get('edit') && search.get('entityId')) {
			handleGetOneTableData(search.get('entityId')!);
		}
	}, [search]);

	const onSaveHandle = useCallback(() => {
		handleAddTableData(forms.addForm.getValues() as MaterialsAddAndEditData);
	}, [handleAddTableData, forms.editForm.getValues()]);

	const onEditHandle = useCallback(() => {
		handleEditTableData(forms.editForm.getValues() as MaterialsAddAndEditData);
	}, [handleEditTableData, forms.editForm.getValues()]);

	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={!!search.get('add') ? onSaveHandle : onEditHandle}
				onExport={handleExportTableData}
				isExporting={isExporting}
				titles={{
					pageTitleKey: 'guides.materials.pageTitle',
					editTitleKey: 'guides.materials.editTitle',
					addTitleKey: 'guides.materials.addTitle',
				}}
				forms={forms}
				formElements={{
					filter: MaterialsFilter,
					add: MaterialsAddAndEdit,
					edit: MaterialsAddAndEdit,
				}}
			/>

			<SimpleTable
				data={tableData}
				columns={columns}
				paginationState={paginationState}
				onChangePaginationState={(newState) => {
					setPaginationState((prev) => ({ ...prev, ...newState }));
					handleGetTableData(
						forms.filterForm.getValues() as MaterialsFilterData,
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
				{t('guides.deleteModal.materialQuestion')} {itemToDelete.name}
			</DeleteModal>
		</div>
	);
};

export default MaterialsScreen;
