import {
	ConstructionsAddAndEdit,
	ConstructionsAddDataConfig,
	ConstructionsEditDataConfig,
	ConstructionsFilter,
	ConstructionsFilterDataConfig,
	GuidbookPageHeaderWrapper,
	useHeaderForm,
} from '@features';
import { useCallback } from 'react';

const ConstructionsScreen = () => {
	const forms = useHeaderForm(
		{
			filter: ConstructionsFilterDataConfig.defaultValues,
			edit: ConstructionsEditDataConfig.defaultValues,
			add: ConstructionsAddDataConfig.defaultValues,
		},
		{
			filter: ConstructionsFilterDataConfig.schema,
			edit: ConstructionsEditDataConfig.schema,
			add: ConstructionsAddDataConfig.schema,
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
					add: ConstructionsAddAndEdit,
					edit: ConstructionsAddAndEdit,
				}}
			/>
			{/* <GuidbookPageTableWrapper /> */}
		</div>
	);
};

export default ConstructionsScreen;
