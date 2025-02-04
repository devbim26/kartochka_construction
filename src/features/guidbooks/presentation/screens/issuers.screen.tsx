import { useCallback, useState } from 'react';
import { IssuersDataConfig, useHeaderForm } from '../../utils';
import { Issuer } from '@features/guidbooks/types/issuer/issuers.types';
import { GuidbookPageHeaderWrapper } from '../components';
import { IssuersAddEdit } from '../components/header/forms/issuers';
import { IssuersFilter } from '../components/header/forms/issuers/issuers-filter.component';

const IssuersPage = () => {

	const form = useHeaderForm<Issuer>(
		{
			filter: IssuersDataConfig.defaultValues,
			edit: IssuersDataConfig.defaultValues,
			add: IssuersDataConfig.defaultValues,
		},
		{
			filter: IssuersDataConfig.schema,
			edit: IssuersDataConfig.schema,
			add: IssuersDataConfig.schema,
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
