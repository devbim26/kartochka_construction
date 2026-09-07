import {
	convertToPaginatedType,
	DeleteIcon,
	DeleteModal,
	EditIcon,
	getAxiosErrorMessage,
	getAxiosErrorMessageSync,
	paginationStateDefault,
	Select,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
	useI18n,
	type PaginationState,
} from '@core';
import { getDesignCalculationConstructionPurpose } from '@core/utils/helpers/design-calculation-mode.helper';
import { ConstructionPurpose, type ConstructionAdditionalInfoDto } from '@api-gen';
import { getConstructionPurposeLabel } from '@features/guidbooks/constants';
import {
	ConstructionsAdd,
	ConstructionsEdit,
	ConstructionsFilter,
	GuidbookPageHeaderWrapper,
} from '@features';
import {
	convertToClientConstructionTypesList,
	convertToClientConstructionsAddData,
	convertToClientConstructionsEditData,
	convertToServerConstructionsAddData,
	convertToServerConstructionsEditData,
	convertToServerConstructionsFilterData,
	getConstructionAdditionalInfoFilesUpload,
	mergeConstructionAdditionalInfo,
} from '@features/guidbooks/converters';
import {
	prepareConstructionEditDataForPersistence,
	resolveExportDownloadAction,
	triggerDownloadAction,
	ConstructionsAddConfig,
	ConstructionsEditConfig,
	ConstructionsFilterConfig,
	useHeaderForm,
} from '@features/guidbooks/utils';
import {
	exportConstructions,
	getGuidebooksConstructionTypes,
	getGuidebooksCreate,
	getGuidebooksDelete,
	getGuidebooksDetail,
	getGuidebooksEdit,
	getGuidebooksPaginated,
	getConstructionAdditionalInfo,
	updateConstructionAdditionalInfoFiles,
} from '@features/guidbooks/services';
import {
	Guidebooks,
	getConstructionTypeLabel,
	getConstructionTypeTemplateEnum,
	getPriorityLabel,
	RuCountryNamesMap,
	type ConstructionsAddData,
	type ConstructionsEditData,
	type ConstructionsFilterData,
	type ConstructionTypeTemplate,
	type Country,
} from '@features/guidbooks/types';
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
	const defaultErrorMessage = t('error.somethingWentWrong.title');

	const showRequestError = (error: unknown, fallback = defaultErrorMessage) => {
		toast.error(getAxiosErrorMessageSync(error, fallback));
	};
	const [search] = useSearchParams();
	const [singleMaterial, setSingleMaterial] = useState<ConstructionsEditData>();
	const [tableData, setTableData] = useState<ConstructionsAddData[]>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isExporting, setIsExporting] = useState(false);
	const [exportConstructionType, setExportConstructionType] = useState('');
	const [exportConstructionTypes, setExportConstructionTypes] = useState<
		ConstructionTypeTemplate[]
	>([]);
	const [itemToDelete, setItemToDelete] = useState({
		id: '',
		name: '',
	});
	const fetchGenerationRef = useRef(0);
	const pageSizeRef = useRef(paginationState.pageSize);
	pageSizeRef.current = paginationState.pageSize;

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
					const raw = info.getValue() as string | number | null | undefined;
					return <SimpleTableCell content={getPriorityLabel(raw, locale === 'en' ? 'en' : 'ru')} />;
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
				cell: (info) => (
					<SimpleTableCell
						content={getConstructionPurposeLabel(
							info.getValue() as string,
							locale === 'en' ? 'en' : 'ru',
						)}
					/>
				),
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
	}, [t, locale, navigate]);

	const [
		filterName,
		filterConstructionType,
		filterConstructionPurpose,
		filterRegion,
		filterPriority,
		filterIssuer,
		filterRw,
		filterLnw,
	] = forms.filterForm.watch([
		'name',
		'constructionType',
		'constructionPurpose',
		'country',
		'priority',
		'issuer',
		'rw',
		'lnw',
	]);

	useEffect(() => {
		const pagination = {
			pageNumber: 1,
			pageSize: pageSizeRef.current || 10,
		};
		setPaginationState((prev) => ({ ...prev, ...pagination }));
		handleGetTableData(
			forms.filterForm.getValues() as ConstructionsFilterData,
			pagination,
		);
	}, [
		filterName,
		filterConstructionType,
		filterConstructionPurpose,
		filterRegion,
		filterPriority,
		filterIssuer,
		filterRw,
		filterLnw,
	]);

	const handleGetTableData = (
		data: ConstructionsFilterData,
		pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
	) => {
		const fetchId = ++fetchGenerationRef.current;
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
						pagination,
					);
					return from([res]);
				}),
				tap((res) => {
					if (fetchId !== fetchGenerationRef.current) return;
					setTableData(res.items);
					setPaginationState(res.pagination);
				}),
				catchError((error) => {
					if (fetchId !== fetchGenerationRef.current) return from([null]);
					console.error(error);
					showRequestError(error, 'Не удалось загрузить конструкции');
					return from([null]);
				}),
			)
			.subscribe();
	};

	const handleGetOneTableData = (id: string) => {
		from(
			Promise.all([
				getGuidebooksDetail({ id, guidebookType: Guidebooks.CONSTRUCTION }),
				getConstructionAdditionalInfo(id),
			]),
		)
			.pipe(
				switchMap(([response, additionalInfoResponse]: AxiosResponse[]) => {
					if (response?.status !== 200) {
						return from([null]);
					}

					const additionalInfo =
						additionalInfoResponse?.status === 200
							? (additionalInfoResponse.data as ConstructionAdditionalInfoDto)
							: null;

					const data = prepareConstructionEditDataForPersistence(
						mergeConstructionAdditionalInfo(
							convertToClientConstructionsEditData(response.data),
							additionalInfo,
						),
					);
					return from([data]);
				}),
				tap((data) => {
					if (data) setSingleMaterial(data);
				}),
				catchError((error) => {
					showRequestError(error);
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
				switchMap((response) => {
					if (response?.status !== 200) return from([response]);

					const constructionHeaderId = response.data?.id as string | undefined;
					const { files, images } = getConstructionAdditionalInfoFilesUpload(data);
					if (!constructionHeaderId || (!files.length && !images.length)) {
						return from([response]);
					}

					return from(
						updateConstructionAdditionalInfoFiles({
							constructionHeaderId,
							files,
							images,
						}),
					).pipe(
						catchError((error) => {
							showRequestError(error);
							return from([response]);
						}),
						switchMap(() => from([response])),
					);
				}),
				catchError((error) => {
					showRequestError(error);
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
				switchMap((response) => {
					if (response?.status !== 200) return from([response]);

					const { files, images } = getConstructionAdditionalInfoFilesUpload(prepared);
					if (!prepared.id || (!files.length && !images.length)) {
						return from([response]);
					}

					return from(
						updateConstructionAdditionalInfoFiles({
							constructionHeaderId: prepared.id,
							files,
							images,
						}),
					).pipe(
						catchError((error) => {
							showRequestError(error);
							return from([response]);
						}),
						switchMap(() => from([response])),
					);
				}),
				catchError((error) => {
					showRequestError(error);
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
					showRequestError(error);
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

	const handleExportTableData = async () => {
		setIsExporting(true);
		try {
			const filterQuery = convertToServerConstructionsFilterData(
				forms.filterForm.getValues() as ConstructionsFilterData,
			);
			const { constructionType: _filterConstructionType, ...restFilter } = filterQuery;
			const response = await exportConstructions({
				...restFilter,
				...(exportConstructionType ? { constructionType: exportConstructionType } : {}),
			});
			if (response.status !== 200) {
				toast.error(t('guides.export.error'));
				return;
			}

			const action = await resolveExportDownloadAction(
				response as AxiosResponse<unknown>,
				'constructions-export.json',
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
			} else {
				toast.error(t('guides.export.error'));
			}
		} finally {
			setIsExporting(false);
		}
	};

	useEffect(() => {
		from(getGuidebooksConstructionTypes())
			.pipe(
				catchError(() => from([null])),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					setExportConstructionTypes(
						convertToClientConstructionTypesList(response.data as any),
					);
				}
			});
	}, []);

	const exportConstructionTypeOptions = useMemo(
		() => [
			{ label: t('guides.export.constructionType.all'), value: '' },
			...exportConstructionTypes
				.map((item) => {
					const value = getConstructionTypeTemplateEnum(item);
					return {
						label: getConstructionTypeLabel(
							value || item.shortName || item.name,
							locale === 'en' ? 'en' : 'ru',
						),
						value,
					};
				})
				.filter((item) => item.value && item.label),
		],
		[exportConstructionTypes, locale, t],
	);

	const exportAccessory = useMemo(
		() => (
			<Select
				value={exportConstructionType}
				onChange={(value) => setExportConstructionType(value ? String(value) : '')}
				options={exportConstructionTypeOptions}
				isSearchable
				disabled={isExporting}
				placeholder={t('guides.export.constructionType.placeholder')}
				buttonClassName="h-[32px] min-w-[280px] max-w-[420px] rounded-[8px] font-sans text-sm font-normal"
				wrapperClassname="shadow-none ring-input-border-primary"
				optionsClassName="!min-w-[280px] max-w-[480px]"
			/>
		),
		[exportConstructionType, exportConstructionTypeOptions, isExporting, t],
	);

	const handleImportSuccess = useCallback(() => {
		handleGetTableData(
			forms.filterForm.getValues() as ConstructionsFilterData,
			{
				pageNumber: 1,
				pageSize: pageSizeRef.current || 10,
			},
		);
	}, [forms.filterForm]);

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
				onExport={handleExportTableData}
				isExporting={isExporting}
				exportAccessory={exportAccessory}
				onImportSuccess={handleImportSuccess}
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
					setPaginationState((prev) => ({ ...prev, ...newState }));
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
