import { useCallback, useState } from 'react';

import { SimpleTable } from '@core';
import {
	MaterialsAddFormDefaultValues,
	MaterialsEditFormDefaultValues,
	MaterialsFilterFormDefaultValues,
} from '../../constants';
import { HeaderFormTypes, MaterialFormTypes } from '../../types';
import { useHeaderForm } from '../../utils';
import {
	GuidbookPageHeaderWrapper,
	GuidbookPageTableWrapper,
	MaterialsAdd,
	MaterialsEdit,
	MaterialsFilter,
} from '../components';

import type { ColumnDef } from '@tanstack/react-table';

const testData = [
	{
		id: 123,
	},
	{
		id: 123,
	},
];

const createColumns = (): ColumnDef<any>[] => {
	return [
		{
			accessorKey: 'id',
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
			edit: MaterialsEditFormDefaultValues,
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
					filterTitle: 'Материалы',
					editTitle: 'Редактировать материал',
					addTitle: 'Добавить материал',
				}}
				formType={currentHeaderFormType}
				setFormType={setCurrentHeaderFormType}
				form={form}
				formElements={{
					filter: MaterialsFilter,
					add: MaterialsAdd,
					edit: MaterialsEdit,
				}}
			/>
			<GuidbookPageTableWrapper />
			<SimpleTable columns={columns} data={testData}></SimpleTable>
		</div>
	);
};
