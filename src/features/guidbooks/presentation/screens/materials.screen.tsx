import { ColumnCell, ColumnHeader, mapColumns, VTable, type TableColumn } from '@core';
import { useCallback, useMemo } from 'react';
import { type MaterialFormTypes } from '../../types';
import {
	MaterialsAddAndEditDataConfig,
	MaterialsFilterDataConfig,
	useHeaderForm,
} from '../../utils';
import { GuidbookPageHeaderWrapper, MaterialsAddAndEdit, MaterialsFilter } from '../components';

const tData: TData[] = [
	{
		id: '1',
		name: 'lol1',
		age: 12,
		surname: 'aaa1',
		exp: 'aaaa23',
		some: 'ssdfsd',
		andr: 'sadasd',
		vanchez: 'sadsad',
		ni: 'asdsad',
		vlad: 'asd',
	},
	{
		id: '1',
		name: 'lol1',
		age: 12,
		surname: 'aaa1',
		exp: 'aaaa23',
		some: 'ssdfsd',
		andr: 'sadasd',
		vanchez: 'sadsad',
		ni: 'asdsad',
		vlad: 'asd',
	},
	{
		id: '1',
		name: 'lol1',
		age: 12,
		surname: 'aaa1',
		exp: 'aaaa23',
		some: 'ssdfsd',
		andr: 'sadasd',
		vanchez: 'sadsad',
		ni: 'asdsad',
		vlad: 'asd',
	},
	{
		id: '3',
		name: 'lol3',
		age: 12,
		surname: 'aaa1',
		exp: 'aaaa23',
		some: 'ssdfsd',
		andr: 'sadasd',
		vanchez: 'sadsad',
		ni: 'asdsad',
		vlad: 'asd',
	},
	{
		id: '3',
		name: 'lol3',
		age: 12,
		surname: 'aaa1',
		exp: 'aaaa23',
		some: 'ssdfsd',
		andr: 'sadasd',
		vanchez: 'sadsad',
		ni: 'asdsad',
		vlad: 'asd',
	},
	{
		id: '3',
		name: 'lol3',
		age: 12,
		surname: 'aaa1',
		exp: 'aaaa23',
		some: 'ssdfsd',
		andr: 'sadasd',
		vanchez: 'sadsad',
		ni: 'asdsad',
		vlad: 'asd',
	},
	{
		id: '3',
		name: 'lol3',
		age: 12,
		surname: 'aaa1',
		exp: 'aaaa23',
		some: 'ssdfsd',
		andr: 'sadasd',
		vanchez: 'sadsad',
		ni: 'asdsad',
		vlad: 'asd',
	},
	{
		id: '3',
		name: 'lol3',
		age: 12,
		surname: 'aaa1',
		exp: 'aaaa23',
		some: 'ssdfsd',
		andr: 'sadasd',
		vanchez: 'sadsad',
		ni: 'asdsad',
		vlad: 'asd',
	},
	{
		id: '3',
		name: 'lol3',
		age: 12,
		surname: 'aaa1',
		exp: 'aaaa23',
		some: 'ssdfsd',
		andr: 'sadasd',
		vanchez: 'sadsad',
		ni: 'asdsad',
		vlad: 'asd',
	},
	{
		id: '3',
		name: 'lol3',
		age: 12,
		surname: 'aaa1',
		exp: 'aaaa23',
		some: 'ssdfsd',
		andr: 'sadasd',
		vanchez: 'sadsad',
		ni: 'asdsad',
		vlad: 'asd',
	},
	{
		id: '3',
		name: 'lol3',
		age: 12,
		surname: 'aaa1',
		exp: 'aaaa23',
		some: 'ssdfsd',
		andr: 'sadasd',
		vanchez: 'sadsad',
		ni: 'asdsad',
		vlad: 'asd',
	},
	{
		id: '3',
		name: 'lol3',
		age: 12,
		surname: 'aaa1',
		exp: 'aaaa23',
		some: 'ssdfsd',
		andr: 'sadasd',
		vanchez: 'sadsad',
		ni: 'asdsad',
		vlad: 'asd',
	},
	{
		id: '3',
		name: 'lol3',
		age: 12,
		surname: 'aaa1',
		exp: 'aaaa23',
		some: 'ssdfsd',
		andr: 'sadasd',
		vanchez: 'sadsad',
		ni: 'asdsad',
		vlad: 'asd',
	},
];

interface TData {
	id: string;
	name: string;
	age: number;
	surname: string;
	exp: string;
	some: string;
	andr: string;
	vanchez: string;
	ni: string;
	vlad: string;
}

const createColumns = (data: TData[]): TableColumn<TData>[] => {
	if (data.length === 0) return [];
	const columns: TableColumn<TData>[] = [
		{
			dataKey: 'id',
			label: 'ID',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[200px]' }),
		},
		{
			dataKey: 'name',
			label: 'Имя',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[200px]' }),
		},
		{
			dataKey: 'age',
			label: 'Возраст',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[200px]' }),
		},
		{
			dataKey: 'surname',
			label: 'surname',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[200px]' }),
		},
		{
			dataKey: 'vanchez',
			label: 'vanchez',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[200px]' }),
		},
		{
			dataKey: 'andr',
			label: 'andr',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[200px]' }),
		},
		{
			dataKey: 'exp',
			label: 'exp',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[200px]' }),
		},
		{
			dataKey: 'ni',
			label: 'ni',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[200px]' }),
		},
		{
			dataKey: 'vlad',
			label: 'vlad',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[200px]' }),
		},
		{
			dataKey: 'some',
			label: 'some',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[200px]' }),
		},
	];
	return mapColumns(columns);
};

const MaterialsPage = () => {
	const forms = useHeaderForm<MaterialFormTypes>(
		{
			filter: MaterialsFilterDataConfig.defaultValues,
			edit: MaterialsAddAndEditDataConfig.defaultValues,
			add: MaterialsAddAndEditDataConfig.defaultValues,
		},
		{
			filter: MaterialsFilterDataConfig.schema,
			edit: MaterialsAddAndEditDataConfig.schema,
			add: MaterialsAddAndEditDataConfig.schema,
		},
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
				forms={forms}
				formElements={{
					filter: MaterialsFilter,
					add: MaterialsAddAndEdit,
					edit: MaterialsAddAndEdit,
				}}
			/>
			<VTable data={tData} columns={columns} pageSize={10} />
		</div>
	);
};

export default MaterialsPage;
