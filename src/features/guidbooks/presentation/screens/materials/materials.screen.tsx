import {
	GuidbookPageHeaderWrapper,
	MaterialsAddAndEdit,
	MaterialsAddAndEditDataConfig,
	MaterialsFilter,
	MaterialsFilterDataConfig,
	useHeaderForm,
} from '@features';
import { useCallback } from 'react';

const MaterialsScreen = () => {
	const forms = useHeaderForm(
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
	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={onSaveHandle}
				titles={{
					pageTitle: 'Материалы',
					editTitle: 'Редактирование материала',
					addTitle: 'Добавление материала',
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

export default MaterialsScreen;
