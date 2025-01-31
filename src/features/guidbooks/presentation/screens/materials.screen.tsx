import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { HeaderFormTypes, type MaterialFormTypes } from '../../types';
import { MaterialsAddAndEditDataConfig, MaterialsFilterDataConfig, useHeaderForm } from '../../utils';
import { GuidbookPageHeaderWrapper, MaterialsAddAndEdit, MaterialsFilter } from '../components';

const MaterialsPage = () => {
	const [currentHeaderFormType, setCurrentHeaderFormType] = useState<HeaderFormTypes>(
		HeaderFormTypes.filter,
	);

	const form = useHeaderForm<MaterialFormTypes>(
		{
			filter: MaterialsFilterDataConfig.defaultValues,
			edit: MaterialsAddAndEditDataConfig.defaultValues,
			add: MaterialsAddAndEditDataConfig.defaultValues,
		},
		currentHeaderFormType,
		{ resolver: zodResolver(MaterialsAddAndEditDataConfig.schema) },
	);

	const onSaveHandle = useCallback(() => {
		console.log(123);
	}, []);
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
