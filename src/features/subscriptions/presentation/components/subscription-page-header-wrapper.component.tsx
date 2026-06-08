import { Button, CleanUpIcon, useAppNavigate, useI18n } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import type { HeaderFormElements, HeaderFormTitles } from '@features/guidbooks/types';
import { HeaderFormTypes } from '@features/guidbooks/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { useSearchParams } from 'react-router-dom';

interface SubscriptionPageHeaderWrapperProps {
	titles: HeaderFormTitles;
	onSave: () => void;
	forms: {
		filterForm: UseFormReturn<any, any, any>;
		addForm: UseFormReturn<any, any, any>;
		editForm: UseFormReturn<any, any, any>;
	};
	formElements: HeaderFormElements<any>;
}

export const SubscriptionPageHeaderWrapper = memoize(
	({ titles, forms, formElements, onSave }: SubscriptionPageHeaderWrapperProps) => {
		const { addForm, editForm, filterForm } = forms;
		const { t } = useI18n();
		const [currentForm, setCurrentForm] = useState<UseFormReturn>(filterForm);
		const [currentHeaderFormType, setCurrentHeaderFormType] = useState<HeaderFormTypes>(
			HeaderFormTypes.filter,
		);

		const navigate = useAppNavigate();
		const [search] = useSearchParams();

		const onCancelHandle = useCallback(() => {
			navigate('');
		}, [navigate]);

		const onClearHandle = useCallback(() => {
			currentForm.reset();
		}, [currentForm]);

		const onAddHandle = useCallback(() => {
			navigate('', { add: 'true' });
		}, [navigate]);

		useEffect(() => {
			search.get('add')
				? setCurrentHeaderFormType(HeaderFormTypes.add)
				: search.get('edit')
					? setCurrentHeaderFormType(HeaderFormTypes.edit)
					: setCurrentHeaderFormType(HeaderFormTypes.filter);
		}, [search.get('add'), search.get('edit')]);

		useEffect(() => {
			if (currentHeaderFormType === HeaderFormTypes.add) {
				setCurrentForm(addForm);
				addForm.reset();
				return;
			}
			if (currentHeaderFormType === HeaderFormTypes.filter) {
				setCurrentForm(filterForm);
				filterForm.reset();
				return;
			}
			if (currentHeaderFormType === HeaderFormTypes.edit) {
				setCurrentForm(editForm);
			}
		}, [currentHeaderFormType, addForm, editForm, filterForm]);

		const submitHandle = useCallback(() => {
			currentForm.handleSubmit(() => onSave())();
		}, [currentForm, onSave]);

		const FormBody =
			currentHeaderFormType === HeaderFormTypes.filter
				? formElements.filter
				: currentHeaderFormType === HeaderFormTypes.edit
					? formElements.edit
					: formElements.add;

		const subTitle = useMemo(() => {
			switch (currentHeaderFormType) {
				case HeaderFormTypes.add:
					return t(titles.addTitleKey);
				case HeaderFormTypes.edit:
					return t(titles.editTitleKey);
				default:
					return '';
			}
		}, [currentHeaderFormType, titles, t]);

		return (
			<div className="flex w-full flex-col gap-[14px]">
				<div className="flex items-center justify-between">
					<p className="font-sans text-lg font-semibold leading-6">
						{t(titles.pageTitleKey)}
					</p>
					{currentHeaderFormType === HeaderFormTypes.filter && (
						<Button
							className="flex w-fit flex-row items-center gap-[4px] px-[16px] py-[6px]"
							onClick={onAddHandle}
						>
							<FaPlus fill="white" width={'16px'} height={'16px'} />
							<p className="font-sans text-sm font-semibold leading-[18px]">
								{t('common.add')}
							</p>
						</Button>
					)}
				</div>
				<div className="flex flex-col rounded-xl border border-solid bg-white">
					<p className="flex justify-center pt-[16px] font-sans text-base font-semibold leading-4">
						{subTitle}
					</p>
					<div className="flex flex-wrap gap-[16px] border-b border-solid px-[16px] pb-[24px] pt-[16px]">
						<FormProvider {...currentForm}>
							<FormBody
								control={currentForm.control}
								setValue={currentForm.setValue}
								formState={currentForm.formState}
							/>
						</FormProvider>
					</div>
					<div className="flex flex-row justify-end gap-[30px] px-[16px] py-[13px]">
						{currentHeaderFormType !== HeaderFormTypes.filter && (
							<Button
								onClick={submitHandle}
								className="group flex w-fit flex-row items-center gap-[6px] border border-solid border-primary bg-background-button-secondary px-[16px] py-[5px] hover:bg-primary"
							>
								<p className="font-sans text-sm font-semibold leading-[18px] text-primary group-hover:text-white">
									{currentHeaderFormType === HeaderFormTypes.add
										? t('common.save')
										: t('common.saveChanges')}
								</p>
							</Button>
						)}
						<Button
							className="group flex w-fit flex-row items-center gap-[4px] border border-solid border-primary bg-background-button-secondary px-[16px] py-[5px] hover:bg-primary"
							onClick={
								currentHeaderFormType === HeaderFormTypes.filter
									? onClearHandle
									: onCancelHandle
							}
						>
							<CleanUpIcon
								width={'16px'}
								height={'16px'}
								className="fill-primary group-hover:fill-white"
							/>
							<p className="font-sans text-sm font-semibold leading-[18px] text-primary group-hover:text-white">
								{currentHeaderFormType === HeaderFormTypes.filter
									? t('common.clear')
									: t('common.cancel')}
							</p>
						</Button>
					</div>
				</div>
			</div>
		);
	},
	'SubscriptionPageHeaderWrapper',
);
