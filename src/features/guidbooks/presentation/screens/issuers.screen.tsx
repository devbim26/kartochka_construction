import { Issuer } from '@features/guidbooks/types/issuer/issuers.types';
import { useCallback } from 'react';
import { IssuersDataConfig, IssuersFormCofig, useHeaderForm } from '../../utils';
import { GuidbookPageHeaderWrapper } from '../components';
import { IssuersAddEdit } from '../components/header/forms/issuers';
import { IssuersFilter } from '../components/header/forms/issuers/issuers-filter.component';

const IssuersPage = () => {
	const form = useHeaderForm<Issuer>(
		{
			filter: IssuersDataConfig.defaultValues,
			edit: IssuersFormCofig.defaultValues,
			add: IssuersFormCofig.defaultValues,
		},
		{
			filter: IssuersDataConfig.schema,
			edit: IssuersFormCofig.schema,
			add: IssuersFormCofig.schema,
		},
	);

	const onSaveHandle = useCallback(() => {}, []);
	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={onSaveHandle}
				titles={{
					pageTitle: 'Производители',
					editTitle: 'Редактировать производителя',
					addTitle: 'Добавить производителя',
				}}
				forms={form}
				formElements={{
					filter: IssuersFilter,
					add: IssuersAddEdit,
					edit: IssuersAddEdit,
				}}
			/>
			{/* <GuidbookPageTableWrapper /> */}
		</div>
	);
};

export default IssuersPage;
