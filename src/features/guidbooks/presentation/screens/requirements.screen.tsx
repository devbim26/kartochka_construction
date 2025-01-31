import { useCallback, useState } from 'react';
import { RequirementsAddFormDefaultValues, RequirementsFilterFormDefaultValues } from '../../constants/requirements/requirements.constants';
import { HeaderFormTypes } from '../../types';
import { useHeaderForm } from '../../utils';

export const RequirementsPage = () => {
	const [currentHeaderFormType, setCurrentHeaderFormType] = useState<HeaderFormTypes>(
			HeaderFormTypes.filter,
	);
	const form = useHeaderForm<MaterialFormTypes>(
		{
			filter: RequirementsFilterFormDefaultValues,
			edit: RequirementsAddFormDefaultValues,
			add: RequirementsAddFormDefaultValues
		},
		currentHeaderFormType,
	);

	const onSaveHandle = useCallback(() => {}, []);
	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={onSaveHandle}
				titles={{
					pageTitle: 'Требования',
					editTitle: 'Редактировать требования',
					addTitle: 'Добавить требования',
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
