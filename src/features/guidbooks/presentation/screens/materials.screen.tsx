import { useCallback, useState } from 'react';
import { MaterialsAddFormDefaultValues, MaterialsFilterFormDefaultValues } from '../../constants';
import { HeaderFormTypes, MaterialFormTypes } from '../../types';
import { useHeaderForm } from '../../utils';

const testData = [
	{
		id: 123,
		name: 'name1',
		plice: 'police1',
		addv: 'sad1',
	},
	{
		id: 124,
		name: 'name2',
		plice: 'police2',
		addv: 'sad2S',
	},
];

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
	return (
		<div className="flex w-full flex-col gap-[40px]">
			{/* <GuidbookPageHeaderWrapper
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
			/> */}
			{/* <GuidbookPageTableWrapper /> */}
		</div>
	);
};
