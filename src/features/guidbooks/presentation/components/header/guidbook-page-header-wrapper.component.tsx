import { Button, CleanUpIcon, useAppNavigate } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { guidbookHeaderTitlesMap } from '../../../constants';
import { HeaderFormTypes, type HeaderFormElements, type HeaderFormTitles } from '../../../types';

interface GuidbookPageHeaderWrapperProps {
	titles: HeaderFormTitles;
	onSave: () => void;
	forms: {
		filterForm: UseFormReturn<any, any, any>;
		addForm: UseFormReturn<any, any, any>;
		editForm: UseFormReturn<any, any, any>;
	};
	formElements: HeaderFormElements<any>;
}

export const GuidbookPageHeaderWrapper = memoize(
	({ titles, forms, formElements, onSave }: GuidbookPageHeaderWrapperProps) => {
		const currentForm = useRef<UseFormReturn>(forms.filterForm);
		const [currentHeaderFormType, setCurrentHeaderFormType] = useState<HeaderFormTypes>(
			HeaderFormTypes.filter,
		);

		const navigate = useAppNavigate();
		const [search] = useSearchParams();
		const onCancelHandle = useCallback(() => {
			currentForm.current.reset();
			window.history.back(), setCurrentHeaderFormType(HeaderFormTypes.filter);
		}, []);

		const onClearHandle = useCallback(() => {
			currentForm.current.reset();
		}, []);

		const onAddHandle = useCallback(() => {
			navigate('', { add: 'true' });
			setCurrentHeaderFormType(HeaderFormTypes.add);
		}, []);

		useEffect(() => {
			search.get('add')
				? setCurrentHeaderFormType(HeaderFormTypes.add)
				: search.get('edit')
					? setCurrentHeaderFormType(HeaderFormTypes.edit)
					: setCurrentHeaderFormType(HeaderFormTypes.filter);
		}, [search.get('add'), search.get('edit')]);

		useEffect(() => {
			currentForm.current =
				currentHeaderFormType === HeaderFormTypes.add
					? forms.addForm
					: currentHeaderFormType === HeaderFormTypes.filter
						? forms.filterForm
						: forms.editForm;
		}, [currentHeaderFormType]);

		const submitHandle = useCallback(() => {
			console.log(123);
			currentForm.current.handleSubmit(() => currentForm.current.getValues())();
		}, []);

		const formComponent = useMemo(() => {
			return (
				<FormProvider {...currentForm.current}>
					{currentHeaderFormType == HeaderFormTypes.filter ? (
						<formElements.filter
							control={currentForm.current.control}
							setValue={currentForm.current.setValue}
							formState={currentForm.current.formState}
						/>
					) : currentHeaderFormType == HeaderFormTypes.edit ? (
						<formElements.edit
							control={currentForm.current.control}
							setValue={currentForm.current.setValue}
							formState={currentForm.current.formState}
						/>
					) : (
						<formElements.add
							control={currentForm.current.control}
							setValue={currentForm.current.setValue}
							formState={currentForm.current.formState}
						/>
					)}
				</FormProvider>
			);
		}, [currentForm.current]);

		console.log(currentForm.current.getValues());

		return (
			<div className="flex w-full flex-col gap-[14px]">
				<div
					className={twMerge(
						'flex',
						currentHeaderFormType === HeaderFormTypes.filter
							? 'flex-row justify-between'
							: 'justify-start',
					)}
				>
					<p className="font-sans text-base font-semibold leading-4">
						{titles.pageTitle}
					</p>
					{currentHeaderFormType === HeaderFormTypes.filter && (
						<Button
							className="flex w-fit flex-row items-center gap-[4px] px-[16px] py-[6px]"
							onClick={onAddHandle}
						>
							<FaPlus fill="white" width={'16px'} height={'16px'} />
							<p className="font-sans text-base font-semibold leading-4 text-white">
								Добавить
							</p>
						</Button>
					)}
				</div>
				<div className="flex flex-col rounded-xl border border-solid bg-white">
					<p className="flex justify-center pt-[16px] font-sans text-base font-semibold leading-4">
						{guidbookHeaderTitlesMap.get(currentHeaderFormType)!(titles)}
					</p>
					<div className="flex flex-wrap gap-[16px] border-b border-solid px-[16px] pb-[24px] pt-[16px]">
						{formComponent}
					</div>
					<div className="flex flex-row justify-end gap-[30px] pb-[25px] pr-[16px] pt-[12px]">
						{currentHeaderFormType !== HeaderFormTypes.filter && (
							<Button
								className="group flex w-fit flex-row items-center gap-[4px] border border-solid border-primary bg-background-button-secondary px-[16px] py-[6px] group-hover:bg-primary"
								onClick={submitHandle}
							>
								<p className="border-primary font-sans text-base font-semibold leading-4 text-primary group-hover:text-white">
									{currentHeaderFormType === HeaderFormTypes.add
										? 'Сохранить'
										: 'Сохранить изменения'}
								</p>
							</Button>
						)}
						<Button
							className="group flex w-fit flex-row items-center gap-[4px] border border-solid border-primary bg-background-button-secondary px-[16px] py-[6px] group-hover:bg-primary"
							onClick={
								currentHeaderFormType === HeaderFormTypes.filter
									? onClearHandle
									: onCancelHandle
							}
						>
							<CleanUpIcon width={'16px'} height={'16px'} />
							<p className="border-primary font-sans text-base font-semibold leading-4 text-primary group-hover:text-white">
								{currentHeaderFormType === HeaderFormTypes.filter
									? 'Очистить'
									: 'Отмена'}
							</p>
						</Button>
					</div>
				</div>
			</div>
		);
	},
	'GuidbookPageHeaderWrapper',
);
