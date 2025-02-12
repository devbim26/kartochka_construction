import { ColumnCell, ColumnHeader, mapColumns, TableColumn, VTable } from '@core';
import { convertToPaginatedType } from '@core/converters';
import {
	convertToClientMaterialsAddAndEditData,
	convertToServerMaterialsFilterData,
} from '@core/converters/materials/materials.converter';
import {
	getGuidebooksPaginated,
	GuidbookPageHeaderWrapper,
	Guidebooks,
	MaterialsAddAndEdit,
	MaterialsAddAndEditConfig,
	MaterialsAddAndEditData,
	MaterialsFilter,
	MaterialsFilterConfig,
	MaterialsFilterData,
	useHeaderForm,
} from '@features';
import { useCallback, useEffect, useMemo, useState } from 'react';

const createColumns = (data: MaterialsAddAndEditData[]): TableColumn<MaterialsAddAndEditData>[] => {
	if (!data) return [];
	const columns: TableColumn<MaterialsAddAndEditData>[] = [
		{
			dataKey: 'image',
			label: 'Изображение',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
		{
			dataKey: 'name',
			label: 'Название',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
		{
			dataKey: 'shortName',
			label: 'Краткое название',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
		{
			dataKey: 'description',
			label: 'Описание',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
		{
			dataKey: 'description',
			label: 'Описание',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
		//цвет
		//штриховка
		// {
		// 	dataKey: 'materialType',
		// 	label: 'Тип материала',
		// 	width: 0,
		// 	headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
		// 	cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		// },
		{
			dataKey: 'region',
			label: 'Регион',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
		{
			dataKey: 'density',
			label: 'Плотность материала',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
		{
			dataKey: 'thickness',
			label: 'Толщина материала',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
		{
			dataKey: 'speedOfSound',
			label: 'Скорость звука',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
		{
			dataKey: 'materialCoefficient',
			label: 'Коэффициент материала',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
		{
			dataKey: 'lossFactor',
			label: 'Коэффициент потерь',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
		//коэффициент для расчетов
		{
			dataKey: 'youngModulus',
			label: 'Модуль Юнга материала, ГПа',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
		//коэффициент затухания
		//процентная доля твердой массы
	];
	return mapColumns(columns);
};

const MaterialsScreen = () => {
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

	const [tableData, setTableData] = useState<Array<MaterialsAddAndEditData>>([]);

	const columns = useMemo(() => createColumns(tableData), [tableData]);

	const [filterName, filterDensity, filterThickness] = forms.filterForm.watch([
		'name',
		'thickness',
		'density',
	]);

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

	useEffect(() => {
		const values = forms.filterForm.getValues() as {
			name: string;
			density: string;
			thickness: string;
			materialType: { id: string; name: string };
		};
		handleGetTableData(values);
	}, [filterDensity, filterName, filterThickness]);

	const onSaveHandle = useCallback(() => {}, []);

	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={onSaveHandle}
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
