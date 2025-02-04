import { Requirement } from '@features/guidbooks/types/requirements';
import { useCallback } from 'react';
import { RequirementsDataConfig, useHeaderForm } from '../../utils';
import { GuidbookPageHeaderWrapper } from '../components';
import {
	RequirementsAddAndEdit,
	RequirementsFilter,
} from '../components/header/forms/requirements';

export const RequirementsPage = () => {
	const form = useHeaderForm<Requirement>(
		{
			filter: RequirementsDataConfig.defaultValues,
			edit: RequirementsDataConfig.defaultValues,
			add: RequirementsDataConfig.defaultValues,
		},
		{
			filter: RequirementsDataConfig.schema,
			edit: RequirementsDataConfig.schema,
			add: RequirementsDataConfig.schema,
		},
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
				forms={form}
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
