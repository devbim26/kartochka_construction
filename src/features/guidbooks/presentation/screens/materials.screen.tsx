import { useCallback, useState } from 'react';

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
		</div>
	);
};
