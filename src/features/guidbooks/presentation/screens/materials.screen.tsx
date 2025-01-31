import { useCallback, useState } from 'react';
import { MaterialsAddFormDefaultValues, MaterialsFilterFormDefaultValues } from '../../constants';
import { HeaderFormTypes, type MaterialFormTypes } from '../../types';
import { useHeaderForm } from '../../utils';
import { GuidbookPageHeaderWrapper, MaterialsAddAndEdit, MaterialsFilter } from '../components';

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
	console.log(currentHeaderFormType);
	const onSaveHandle = useCallback(() => {}, []);
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
			{/* <GuidbookPageTableWrapper /> */}
		</div>
	);
};

export default MaterialsPage;
