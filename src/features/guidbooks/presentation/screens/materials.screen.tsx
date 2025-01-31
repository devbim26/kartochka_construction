import { useCallback } from 'react';
import { MaterialsAddFormDefaultValues, MaterialsFilterFormDefaultValues } from '../../constants';
import { type MaterialFormTypes } from '../../types';
import { useHeaderForm } from '../../utils';
import { GuidbookPageHeaderWrapper, MaterialsAddAndEdit, MaterialsFilter } from '../components';

const MaterialsPage = () => {
	const forms = useHeaderForm<MaterialFormTypes>({
		filter: MaterialsFilterFormDefaultValues,
		edit: MaterialsAddFormDefaultValues,
		add: MaterialsAddFormDefaultValues,
	});
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
