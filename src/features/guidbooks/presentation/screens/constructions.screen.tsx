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
import {
	getGuidebooksCreate,
	getGuidebooksDelete,
	getGuidebooksDetail,
	getGuidebooksEdit,
	getGuidebooksPaginated,
} from '@features/guidbooks/services';
import {
	Guidebooks,
	RuConstructionTypesMap,
	RuCountryNamesMap,
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';

const ConstructionsScreen = () => {
	const navigate = useAppNavigate();
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

	const columns = useMemo(() => {
		const cols: ColumnDef<ConstructionsAddData>[] = [
			{
				accessorKey: 'name',
				header: () => <SimpleTableHeaderCell text="Код" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'description',
				header: () => <SimpleTableHeaderCell text="Название" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'descriptionSource',
				header: () => <SimpleTableHeaderCell text="Источник" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'maxHeight',
				header: () => <SimpleTableHeaderCell text="Максимальная высота" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'issuerName',
				header: () => <SimpleTableHeaderCell text="Производитель" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'constructionType',
				header: () => <SimpleTableHeaderCell text="Тип конструкции" />,
				cell: (info) => (
					<SimpleTableCell
						content={RuConstructionTypesMap[info.getValue() as ConstructionTypeEnum]}
					/>
				),
			},
			{
				accessorKey: 'country',
				header: () => <SimpleTableHeaderCell text="Страна" />,
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
				header: () => <SimpleTableHeaderCell text="Действия" />,
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
	}, []);

	const [filterName, filterConstructionType, filterDescription, filterRegion] =
		forms.filterForm.watch(['name', 'constructionType', 'description', 'country']);

	useEffect(() => {
		handleGetTableData(
			forms.filterForm.getValues() as ConstructionsFilterData,
			paginationState,
		);
	}, [filterName, filterConstructionType, filterDescription, filterRegion]);

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
					const data = convertToClientConstructionsEditData(response.data);
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
					toast.success('Конструкция успешно добавлена');
					navigate('');
				}
			});
	};

	const handleEditTableData = (data: ConstructionsEditData) => {
		from(
			getGuidebooksEdit({
				data: convertToServerConstructionsEditData(data),
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
					toast.success('Конструкция успешно отредактирована');
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
					toast.success('Конструкция успешно удалена');
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
					pageTitle: 'Конструкции',
					editTitle: 'Редактирование конструкции',
					addTitle: 'Добавление конструкции',
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
				headerTitle="Подтвердите действие"
			>
				Вы уверены, что хотите удалить конструкцию {itemToDelete.name}?
			</DeleteModal>
		</div>
	);
};

export default ConstructionsScreen;
