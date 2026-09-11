import { Button, CleanUpIcon, useAppNavigate, useI18n } from '@core';
import type { HeaderFormElements, HeaderFormTitles } from '@features/guidbooks/types';
import { HeaderFormTypes } from '@features/guidbooks/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { useSearchParams } from 'react-router-dom';

interface NewsPageHeaderWrapperProps {
	titles: HeaderFormTitles;
	onSave: (data: any) => void;
	forms: {
		filterForm: UseFormReturn<any, any, any>;
		addForm: UseFormReturn<any, any, any>;
		editForm: UseFormReturn<any, any, any>;
	};
	formElements: HeaderFormElements<any>;
}

export const NewsPageHeaderWrapper = ({
	titles,
	forms,
	formElements,
	onSave,
}: NewsPageHeaderWrapperProps) => {
	const { t } = useI18n();
	const [currentHeaderFormType, setCurrentHeaderFormType] = useState<HeaderFormTypes>(
		HeaderFormTypes.filter,
	);
	const prevHeaderFormTypeRef = useRef<HeaderFormTypes | null>(null);

	const navigate = useAppNavigate();
	const [search] = useSearchParams();

	const currentForm =
		currentHeaderFormType === HeaderFormTypes.add
			? forms.addForm
			: currentHeaderFormType === HeaderFormTypes.edit
				? forms.editForm
				: forms.filterForm;

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
		if (search.get('add')) {
			setCurrentHeaderFormType(HeaderFormTypes.add);
		} else if (search.get('edit')) {
			setCurrentHeaderFormType(HeaderFormTypes.edit);
		} else {
			setCurrentHeaderFormType(HeaderFormTypes.filter);
		}
	}, [search]);

	useEffect(() => {
		const prev = prevHeaderFormTypeRef.current;
		prevHeaderFormTypeRef.current = currentHeaderFormType;

		if (currentHeaderFormType === HeaderFormTypes.add && prev !== HeaderFormTypes.add) {
			forms.addForm.reset();
			return;
		}
		if (
			currentHeaderFormType === HeaderFormTypes.filter &&
			prev != null &&
			prev !== HeaderFormTypes.filter
		) {
			forms.filterForm.reset();
		}
	}, [currentHeaderFormType, forms.addForm, forms.filterForm]);

	const submitHandle = useCallback(() => {
		void currentForm.handleSubmit((data) => {
			onSave(data);
		})();
	}, [currentForm, onSave]);

	const FormElement =
		currentHeaderFormType === HeaderFormTypes.filter
			? formElements.filter
			: currentHeaderFormType === HeaderFormTypes.edit
				? formElements.edit
				: formElements.add;

	const subTitle =
		currentHeaderFormType === HeaderFormTypes.add
			? t(titles.addTitleKey)
			: currentHeaderFormType === HeaderFormTypes.edit
				? t(titles.editTitleKey)
				: '';

	return (
		<div className="flex w-full flex-col gap-[14px]">
			<div className="flex items-center justify-between">
				<p className="font-sans text-lg font-semibold leading-6">{t(titles.pageTitleKey)}</p>
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
						<FormElement
							control={currentForm.control}
							setValue={currentForm.setValue}
							formState={currentForm.formState}
						/>
					</FormProvider>
				</div>
				<div className="flex flex-row justify-end gap-[30px] px-[16px] py-[13px]">
					{currentHeaderFormType !== HeaderFormTypes.filter && (
						<Button
							type="button"
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
						type="button"
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
};
