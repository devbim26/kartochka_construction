import { ColumnCell, ColumnHeader, mapColumns, TableColumn, VTable } from '@core';
import { useCallback, useMemo, useState } from 'react';
import { MaterialsAddFormDefaultValues, MaterialsFilterFormDefaultValues } from '../../constants';
import { HeaderFormTypes, type MaterialFormTypes } from '../../types';
import { useHeaderForm } from '../../utils';
import { GuidbookPageHeaderWrapper, MaterialsAddAndEdit, MaterialsFilter } from '../components';

const tData = [
	{ id: '1', name: 'lol1', age: 12 },
	{ id: '1', name: 'lol1', age: 12 },
	{ id: '1', name: 'lol1', age: 12 },
	{ id: '3', name: 'lol3', age: 12 },
	{ id: '3', name: 'lol3', age: 12 },
	{ id: '3', name: 'lol3', age: 12 },
	{ id: '3', name: 'lol3', age: 12 },
	{ id: '3', name: 'lol3', age: 12 },
	{ id: '3', name: 'lol3', age: 12 },
	{ id: '3', name: 'lol3', age: 12 },
	{ id: '3', name: 'lol3', age: 12 },
	{ id: '3', name: 'lol3', age: 12 },
	{ id: '3', name: 'lol3', age: 12 },
];

interface TData {
	id: string;
	name: string;
	age: number;
}

const createColumns = (data: TData[]): TableColumn<TData>[] => {
	if (data.length === 0) return [];
	const columns: TableColumn<TData>[] = [
		{
			dataKey: 'id',
			label: 'ID',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[100px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[100px]' }),
		},
		{
			dataKey: 'name',
			label: 'Имя',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[100px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[100px]' }),
		},
		{
			dataKey: 'age',
			label: 'Возраст',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[100px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[100px]' }),
		},
	];
	return mapColumns(columns);
};

const MaterialsPage = () => {
	const [currentHeaderFormType, setCurrentHeaderFormType] = useState<HeaderFormTypes>(
		HeaderFormTypes.filter,
	);
	const form = useHeaderForm<MaterialFormTypes>(
		{
			filter: MaterialsFilterFormDefaultValues,
			edit: MaterialsAddFormDefaultValues,
			add: MaterialsAddFormDefaultValues,
		},
		currentHeaderFormType,
	);

	const onSaveHandle = useCallback(() => {}, []);
	const columns = useMemo(() => createColumns(tData), [tData]);
	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={onSaveHandle}
				titles={{
					pageTitle: 'Материалы',
					editTitle: 'Редактировать материал',
					addTitle: 'Добавить материал',
				}}
				formType={currentHeaderFormType}
				setFormType={setCurrentHeaderFormType}
				form={form}
				formElements={{
					filter: MaterialsFilter,
					add: MaterialsAddAndEdit,
					edit: MaterialsAddAndEdit,
				}}
			/>
			<VTable data={tData} columns={columns} />
		</div>
	);
};

export default MaterialsPage;
