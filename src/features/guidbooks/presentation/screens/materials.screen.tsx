import { useCallback } from 'react';
import { type MaterialFormTypes } from '../../types';
import { MaterialsAddAndEditDataConfig, useHeaderForm } from '../../utils';
import { GuidbookPageHeaderWrapper, MaterialsAddAndEdit, MaterialsFilter } from '../components';

const MaterialsPage = () => {
	const forms = useHeaderForm<MaterialFormTypes>(
		{
			filter: MaterialsAddAndEditDataConfig.defaultValues,
			edit: MaterialsAddAndEditDataConfig.defaultValues,
			add: MaterialsAddAndEditDataConfig.defaultValues,
		},
		{
			filter: MaterialsAddAndEditDataConfig.schema,
			edit: MaterialsAddAndEditDataConfig.schema,
			add: MaterialsAddAndEditDataConfig.schema,
		},
	);

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
				forms={forms}
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
