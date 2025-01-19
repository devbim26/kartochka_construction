import { Button, CleanUpIcon } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { useCallback } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { twMerge } from 'tailwind-merge';
import { guidbookHeaderTitlesMap } from '../../../constants';
import { HeaderFormTypes, type HeaderFormElements, type HeaderFormTitles } from '../../../types';

interface GuidbookPageHeaderWrapperProps {
	titles: HeaderFormTitles;
	onSave: () => void;
	formType: HeaderFormTypes;
	setFormType: (type: HeaderFormTypes) => void;
	form: UseFormReturn<any, any, any>;
	formElements: HeaderFormElements<any>;
}

export const GuidbookPageHeaderWrapper = memoize(
	({
		titles,
		formType,
		form,
		setFormType,
		formElements,
		onSave,
	}: GuidbookPageHeaderWrapperProps) => {
		const onCancelHandle = useCallback(() => {
			form.reset();
			setFormType(HeaderFormTypes.filter);
		}, []);

		const onClearHandle = useCallback(() => {
			form.reset();
		}, []);

		const onAddHandle = useCallback(() => {
			setFormType(HeaderFormTypes.add);
		}, []);

		return (
			<div className="flex w-full flex-col gap-[14px]">
				<div
					className={twMerge(
						'flex',
						formType === HeaderFormTypes.filter
							? 'flex-row justify-between'
							: 'justify-start',
					)}
				>
					<p className="font-sans text-base font-semibold leading-4">
						{titles.pageTitle}
					</p>
					{formType === HeaderFormTypes.filter && (
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
						{guidbookHeaderTitlesMap.get(formType)!(titles)}
					</p>
					<div className="flex flex-wrap gap-[16px] border-b border-solid px-[16px] pb-[24px] pt-[16px]">
						<FormProvider {...form}>
							{formType == HeaderFormTypes.filter ? (
								<formElements.filter
									control={form.control}
									setValue={form.setValue}
								/>
							) : formType == HeaderFormTypes.edit ? (
								<formElements.edit
									control={form.control}
									setValue={form.setValue}
								/>
							) : (
								<formElements.add control={form.control} setValue={form.setValue} />
							)}
						</FormProvider>
					</div>
					<div className="flex flex-row justify-end gap-[30px] pb-[25px] pr-[16px] pt-[12px]">
						{formType !== HeaderFormTypes.filter && (
							<Button
								className="group flex w-fit flex-row items-center gap-[4px] border border-solid border-primary bg-background-button-secondary px-[16px] py-[6px] group-hover:bg-primary"
								onClick={onSave}
							>
								<p className="border-primary font-sans text-base font-semibold leading-4 text-primary group-hover:text-white">
									{formType === HeaderFormTypes.add
										? 'Сохранить'
										: 'Сохранить изменения'}
								</p>
							</Button>
						)}
						<Button
							className="group flex w-fit flex-row items-center gap-[4px] border border-solid border-primary bg-background-button-secondary px-[16px] py-[6px] group-hover:bg-primary"
							onClick={
								formType === HeaderFormTypes.filter ? onClearHandle : onCancelHandle
							}
						>
							<CleanUpIcon width={'16px'} height={'16px'} />
							<p className="border-primary font-sans text-base font-semibold leading-4 text-primary group-hover:text-white">
								{formType === HeaderFormTypes.filter ? 'Очистить' : 'Отмена'}
							</p>
						</Button>
					</div>
				</div>
			</div>
		);
	},
	'GuidbookPageHeaderWrapper',
);
