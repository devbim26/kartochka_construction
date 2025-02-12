import {
	ConstructionsAdd,
	ConstructionsAddConfig,
	ConstructionsEdit,
	ConstructionsEditConfig,
	ConstructionsFilter,
	ConstructionsFilterConfig,
	GuidbookPageHeaderWrapper,
	useHeaderForm,
} from '@features';
import { useCallback } from 'react';

const ConstructionsScreen = () => {
	const forms = useHeaderForm(
		{
			filter: ConstructionsFilterConfig.defaultValues,
			edit: ConstructionsEditConfig.defaultValues,
			add: ConstructionsAddConfig.defaultValues,
		},
		{
			filter: ConstructionsFilterConfig.schema,
			edit: ConstructionsEditConfig.schema,
			add: ConstructionsAddConfig.schema,
		},
	);

	const onSaveHandle = useCallback(() => {}, []);
	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={onSaveHandle}
				titles={{
					pageTitle: 'Конструкции',
					editTitle: 'Редактирование конструкции',
					addTitle: 'Добавление конструкции',
				}}
				forms={forms}
				formElements={{
					filter: ConstructionsFilter,
					add: ConstructionsAdd,
					edit: ConstructionsEdit,
				}}
			/>
			{/* <GuidbookPageTableWrapper /> */}
		</div>
	);
};

export default ConstructionsScreen;
