import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import { TableHeaderCell } from '../../../../core/presentation/components/table/table-header-cell.component';
import { MaterialsAddFormDefaultValues, MaterialsFilterFormDefaultValues } from '../../constants';
import { HeaderFormTypes, MaterialFormTypes } from '../../types';
import { useHeaderForm } from '../../utils';
import { GuidbookPageHeaderWrapper, MaterialsAddAndEdit, MaterialsFilter } from '../components';

const testData = [
	{
		id: 123,
		name: 'name',
		plice: 'police',
		addv: 'sad',
	},
	{
		id: 124,
		name: 'name',
		plice: 'police',
		addv: 'sad',
	},
];

const createColumns = (): ColumnDef<any>[] => {
	return [
		{
			accessorKey: 'id',
			header: () => <TableHeaderCell text={'id'} showSortIcon />,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'name',
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'plice',
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'addv',
			cell: (info) => info.getValue(),
		},
	];
};

export const MaterialsPage = () => {
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
	const columns = createColumns();
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
			{/* <GuidbookPageTableWrapper />
			<SimpleTable columns={columns} data={testData} /> */}
		</div>
	);
};
