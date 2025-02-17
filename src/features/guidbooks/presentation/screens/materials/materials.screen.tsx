import {
	ColumnCell,
	ColumnHeader,
	DeleteIcon,
	EditIcon,
	mapColumns,
	TableColumn,
	useAppNavigate,
	VTable,
} from '@core';
import {
	convertToClientMaterialsAddAndEditData,
	convertToPaginatedType,
	convertToServerMaterialsAddAndEditData,
	convertToServerMaterialsFilterData,
} from '@core/converters';
import {
	getGuidebooksCreate,
	getGuidebooksDelete,
	getGuidebooksDetail,
	getGuidebooksEdit,
	getGuidebooksPaginated,
	GuidbookPageHeaderWrapper,
	Guidebooks,
	MaterialsAddAndEdit,
	MaterialsAddAndEditConfig,
	MaterialsAddAndEditData,
	MaterialsFilter,
	MaterialsFilterConfig,
	MaterialsFilterData,
	Region,
	RuRegionNamesMap,
	useHeaderForm,
} from '@features';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const MaterialsScreen = () => {
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const [singleMaterial, setSingleMaterial] = useState<MaterialsAddAndEditData>();
	const [tableData, setTableData] = useState<Array<MaterialsAddAndEditData>>([]);

	const createColumns = (
		data: MaterialsAddAndEditData[],
	): TableColumn<MaterialsAddAndEditData>[] => {
		if (!data) return [];
		const columns: TableColumn<MaterialsAddAndEditData>[] = [
			{
				dataKey: 'imageUrl',
				label: 'Изображение',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
			},
			{
				dataKey: 'name',
				label: 'Название',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
			},
			{
				dataKey: 'shortName',
				label: 'Краткое название',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
			},
			{
				dataKey: 'description',
				label: 'Описание',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
			},
			{
				dataKey: 'description',
				label: 'Описание',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
			},
			//цвет
			//штриховка
			{
				dataKey: 'materialType',
				label: 'Тип материала',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) =>
					ColumnCell({
						...props,
						containerClassName: 'w-[300px]',
					}),
			},
			{
				dataKey: 'region',
				label: 'Регион',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) =>
					ColumnCell({
						...props,
						containerClassName: 'w-[300px]',
						cellData: RuRegionNamesMap[`${props.cellData as Region}`],
					}),
			},
			{
				dataKey: 'density',
				label: 'Плотность материала',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
			},
			{
				dataKey: 'thickness',
				label: 'Толщина материала',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
			},
			{
				dataKey: 'velocity',
				label: 'Скорость звука',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
			},
			{
				dataKey: 'materialCoefficient',
				label: 'Коэффициент материала',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
			},
			{
				dataKey: 'lossFactor',
				label: 'Коэффициент потерь',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
			},
			//коэффициент для расчетов
			{
				dataKey: 'youngModulus',
				label: 'Модуль Юнга материала, ГПа',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
			},
			//коэффициент затухания
			//процентная доля твердой массы
			{
				dataKey: 'id',
				label: 'Действия',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) =>
					ColumnCell({
						...props,
						containerClassName: 'w-[300px]',
						cellData: (
							<div className="flex gap-2">
								<EditIcon
									onClick={() =>
										navigate('', { edit: 'true', entityId: props.cellData })
									}
								/>
								<DeleteIcon
									onClick={() => handleDeleteTableData(props.cellData as string)}
								/>
							</div>
						),
					}),
			},
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
			{!!tableData.length && <VTable pageSize={10} data={tableData} columns={columns} />}
		</div>
	);
};

export default MaterialsScreen;
