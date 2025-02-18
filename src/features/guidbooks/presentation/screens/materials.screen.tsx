import {
	convertToPaginatedType,
	DeleteIcon,
	EditIcon,
	mapColumns,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
} from '@core';
import {
	convertToClientMaterialsAddAndEditData,
	convertToServerMaterialsAddAndEditData,
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
	RuRegionNamesMap,
	useHeaderForm,
	type MaterialsAddAndEditData,
	type MaterialsFilterData,
	type Region,
} from '@features';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const MaterialsScreen = () => {
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const [singleMaterial, setSingleMaterial] = useState<MaterialsAddAndEditData>();
	const [tableData, setTableData] = useState<Array<MaterialsAddAndEditData>>([]);

	const createColumns = (
		data: MaterialsAddAndEditData[],
	): ColumnDef<MaterialsAddAndEditData>[] => {
		if (!data) return [];
		const columns: ColumnDef<MaterialsAddAndEditData>[] = [
			{
				accessorKey: 'imageUrl',
				header: () => <SimpleTableHeaderCell text="Изображение" />,
				cell: (info) => {
					const value = info.getValue() as string | null;
					return (
						<SimpleTableCell
							contentClassName="h-[39px] w-[39px]"
							content={
								value ? (
									<img src={info.getValue() as string} className="size-[39px]" />
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
				accessorKey: 'materialType.name',
				header: () => <SimpleTableHeaderCell text="Тип материала" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'region',
				header: () => <SimpleTableHeaderCell text="Регион" />,
				cell: (info) => (
					<SimpleTableCell content={RuRegionNamesMap[`${info.getValue() as Region}`]} />
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
					const entityId = info.row.original.id;
					return (
						<SimpleTableCell
							content={
								<div className="flex gap-2">
									<EditIcon
										onClick={() =>
											navigate('', { edit: 'true', entityId: entityId })
										}
									/>
									<DeleteIcon
										onClick={() =>
											handleDeleteTableData(info.getValue() as string)
										}
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
		return mapColumns(columns);
	};

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

	const columns = useMemo(() => createColumns(tableData), [tableData]);

	const [filterName, filterMaterialTypeId, filterDensity, filterThickness] =
		forms.filterForm.watch(['name', 'materialTypeId', 'thickness', 'density']);

	const handleGetTableData = async (data: MaterialsFilterData) => {
		try {
			const response = await getGuidebooksPaginated({
				data: convertToServerMaterialsFilterData(data),
				guidebookType: Guidebooks.MATERIAL,
			});
			const items = convertToPaginatedType(convertToClientMaterialsAddAndEditData)(
				response.data as any,
			);
			setTableData(items);
		} catch (error) {
			console.log('Error:', error);
		}
	};

	const handleGetOneTableData = useCallback(async (id: string) => {
		try {
			const response = await getGuidebooksDetail({
				id: id,
				guidebookType: Guidebooks.MATERIAL,
			});
			if (response.status === 200) {
				const data = convertToClientMaterialsAddAndEditData(response.data as any);
				setSingleMaterial(data);
			}
		} catch (error) {
			console.log('Error:', error);
		}
	}, []);

	const handleAddTableData = async (data: MaterialsAddAndEditData) => {
		try {
			const response = await getGuidebooksCreate({
				data: convertToServerMaterialsAddAndEditData(data),
				guidebookType: Guidebooks.MATERIAL,
			});
			if (response.status === 200) {
				handleGetTableData(forms.filterForm.getValues() as MaterialsFilterData);
			}
		} catch (error) {
			console.log('Error:', error);
		}
	};

	const handleEditTableData = async (data: MaterialsAddAndEditData) => {
		try {
			const response = await getGuidebooksEdit({
				data: convertToServerMaterialsAddAndEditData(data),
				guidebookType: Guidebooks.MATERIAL,
			});
			if (response.status === 200) {
				handleGetTableData(forms.filterForm.getValues() as MaterialsFilterData);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeleteTableData = async (id: string) => {
		try {
			const response = await getGuidebooksDelete({
				data: { id: id },
				guidebookType: Guidebooks.MATERIAL,
			});
			if (response.status === 200) {
				handleGetTableData(forms.filterForm.getValues() as MaterialsFilterData);
			}
		} catch (error) {
			console.log('Error:', error);
		}
	};

	useEffect(() => {
		handleGetTableData(forms.filterForm.getValues() as MaterialsFilterData);
	}, [filterDensity, filterName, filterThickness, filterMaterialTypeId]);

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
			{!!tableData.length && <SimpleTable pageSize={10} data={tableData} columns={columns} />}
		</div>
	);
};

export default MaterialsScreen;
