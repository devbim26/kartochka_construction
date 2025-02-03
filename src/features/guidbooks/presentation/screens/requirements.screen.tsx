import { useCallback, useState } from 'react';
import { RequirementsAddFormDefaultValues, RequirementsFilterFormDefaultValues } from '../../constants/requirements/requirements.constants';
import { HeaderFormTypes } from '../../types';
import { useHeaderForm } from '../../utils';
import { RequirementFormTypes } from '@features/guidbooks/types/requirements.types';
import { GuidbookPageHeaderWrapper } from '../components';
import { RequirementsAddAndEdit, RequirementsFilter } from '../components/header/forms/requirements';

export const RequirementsPage = () => {
	const [currentHeaderFormType, setCurrentHeaderFormType] = useState<HeaderFormTypes>(
			HeaderFormTypes.filter,
	);
	const form = useHeaderForm<RequirementFormTypes>(
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
					filter: RequirementsFilter,
					add: RequirementsAddAndEdit,
					edit: RequirementsAddAndEdit,
				}}
			/>
			{/* <GuidbookPageTableWrapper /> */}
		</div>
	);
};
