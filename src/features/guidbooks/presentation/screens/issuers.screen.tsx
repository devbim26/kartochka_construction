import { useCallback, useState } from 'react';
import { IssuersAddFormDefaultValues, IssuersFilterFormDefaultValues } from '../../constants/issuers/issuers.constants';
import { HeaderFormTypes } from '../../types';
import { useHeaderForm } from '../../utils';
import { IssuerFormTypes } from '@features/guidbooks/types/issuers.types';
import { GuidbookPageHeaderWrapper } from '../components';
import { IssuersAddAndEdit, IssuersFilter } from '../components/header/forms/issuers';

const IssuersPage = () => {
	const [currentHeaderFormType, setCurrentHeaderFormType] = useState<HeaderFormTypes>(
		HeaderFormTypes.filter,
	);
	const form = useHeaderForm<IssuerFormTypes>(
		{
			filter: IssuersFilterFormDefaultValues,
			edit: IssuersAddFormDefaultValues,
			add: IssuersAddFormDefaultValues,
		},
		currentHeaderFormType,
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
				formType={currentHeaderFormType}
				setFormType={setCurrentHeaderFormType}
				form={form}
				formElements={{
					filter: IssuersFilter,
					add: IssuersAddAndEdit,
					edit: IssuersAddAndEdit,
				}}
			/>
			{/* <GuidbookPageTableWrapper /> */}
		</div>
	);
};

export default IssuersPage;
