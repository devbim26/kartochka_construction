import { Input, useI18n } from '@core';
import type { AccountData } from '@features/account/types';
import { useFormContext } from 'react-hook-form';

export const UserFilter = () => {
	const form = useFormContext<AccountData>();
	const { register } = form;
	const { t } = useI18n();

	return (
		<>
			<Input
				{...register('companyName')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={t('account.form.companyName.label')}
				placeholder={t('account.form.companyName.placeholder')}
			/>
			<Input
				{...register('email')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={t('account.form.email.label')}
				placeholder={t('account.form.email.placeholder')}
			/>
			<Input
				{...register('directorFullName')}
				labelClassName={
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary'
				}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={t('account.form.directorFullName.label')}
				placeholder={t('account.form.directorFullName.placeholder')}
			/>
		</>
	);
};
