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
import type { Country, MaterialsAddAndEditData, MaterialsFilterData } from '@features';
import {
	convertToClientMaterialsAddAndEditData,
	convertToServerMaterialsCreateData,
	convertToServerMaterialsEditData,
	convertToServerMaterialsFilterData,
	getGuidebooksCreate,
	getGuidebooksDelete,
	getGuidebooksDetail,
	getGuidebooksEdit,
	getGuidebooksPaginated,
	GuidbookPageHeaderWrapper,
	Guidebooks,
	MaterialsAddAndEdit,
	MaterialsAddAndEditConfig,
	MaterialsFilter,
	MaterialsFilterConfig,
	RuCountryNamesMap,
	RuMaterialTypeEnum,
	useHeaderForm,
} from '@features';

import type { ColumnDef } from '@tanstack/react-table';
import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';

const MaterialsScreen = () => {
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const [singleMaterial, setSingleMaterial] = useState<MaterialsAddAndEditData>();
	const [tableData, setTableData] = useState<Array<MaterialsAddAndEditData>>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [itemToDelete, setItemToDelete] = useState({
		id: '',
		name: '',
	});

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
				header: () => <SimpleTableHeaderCell text="Изображение" />,
				cell: (info) => {
					return (
						<SimpleTableCell
							contentClassName="h-[39px] w-[39px]"
							content={
								info.row.original.image ? (
									<img src={info.row.original.image} className="size-[39px]" />
								) : (
									''
								)
							}
						/>
					);
				},
			},
			{
				accessorKey: 'name',
				header: () => <SimpleTableHeaderCell text="Название" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'shortName',
				header: () => <SimpleTableHeaderCell text="Краткое название" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'description',
				header: () => <SimpleTableHeaderCell text="Описание" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'materialType',
				header: () => <SimpleTableHeaderCell text="Тип материала" />,
				cell: (info) => (
					<SimpleTableCell
						content={
							RuMaterialTypeEnum[
								`${info.getValue() as keyof typeof RuMaterialTypeEnum}`
							]
						}
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
				accessorKey: 'density',
				header: () => <SimpleTableHeaderCell text="Плотность" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'thickness',
				header: () => <SimpleTableHeaderCell text="Толщина" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'velocity',
				header: () => <SimpleTableHeaderCell text="Скорость звука" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'materialCoefficient',
				header: () => <SimpleTableHeaderCell text="Коэффициент материала" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'lossFactor',
				header: () => <SimpleTableHeaderCell text="Коэффициент потерь" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'youngModulus',
				header: () => <SimpleTableHeaderCell text="Модуль Юнга материала, ГПа" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'actions',
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
	}, []);

	const [filterName, filterMaterialType, filterDensity, filterThickness] = forms.filterForm.watch(
		['name', 'materialType', 'thickness', 'density'],
	);

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
				data: convertToServerMaterialsCreateData(data),
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
					toast.success('Материал успешно добавлен');
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
					toast.success('Материал успешно отредактирован');
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
					toast.success('Материал успешно удален ');
				}
			});
	};

	useEffect(() => {
		handleGetTableData(forms.filterForm.getValues() as MaterialsFilterData, paginationState);
	}, [filterDensity, filterName, filterThickness, filterMaterialType]);

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
				titles={{
					pageTitle: 'Материалы',
					editTitle: 'Редактирование материала',
					addTitle: 'Добавление материала',
				}}
				forms={forms}
				formElements={{
					filter: MaterialsFilter,
					add: MaterialsAddAndEdit,
					edit: MaterialsAddAndEdit,
				}}
			/>
			{!!tableData.length && (
				<SimpleTable
					data={tableData}
					columns={columns}
					paginationState={paginationState}
					onChangePaginationState={(newState) => {
						handleGetTableData(
							forms.filterForm.getValues() as MaterialsFilterData,
							newState,
						);
					}}
				/>
			)}
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
				Вы уверены, что хотите удалить материал {itemToDelete.name}?
			</DeleteModal>
		</div>
	);
};

export default MaterialsScreen;
