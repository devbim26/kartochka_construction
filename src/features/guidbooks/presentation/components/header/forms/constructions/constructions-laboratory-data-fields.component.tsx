import { Input, Select } from '@core';
import { RuIndexTypeNamesSelectValues } from '@features/guidbooks/types';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { FormSubTitle } from '../../form-sub-title.component';

type Props = {
	/** При редактировании конструкции — только просмотр */
	readOnly?: boolean;
};

const fieldErrorMessage = (error: unknown): string | undefined => {
	if (error && typeof error === 'object' && 'message' in error) {
		const m = (error as { message: unknown }).message;
		return typeof m === 'string' ? m : undefined;
	}
	return undefined;
};

/**
 * Общий блок «Лабораторные данные» для форм добавления и редактирования.
 */
export const ConstructionLaboratoryDataFields = ({ readOnly = false }: Props) => {
	const { formState, control, register } = useFormContext();
	const ro = readOnly;

	return (
		<>
			<FormSubTitle text="Лабораторные данные" />
			<div className="flex flex-wrap gap-[16px]">
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						fieldErrorMessage(formState.errors.labRTotal) ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[468px]"
					label={fieldErrorMessage(formState.errors.labRTotal) || 'R_total'}
					error={fieldErrorMessage(formState.errors.labRTotal)}
					placeholder="Введите через запятую"
					{...register('labRTotal')}
					type={'text'}
					disabled={ro}
				/>
				<Controller
					name="labIndex"
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							isSearchable
							value={field.value || ''}
							options={RuIndexTypeNamesSelectValues}
							error={fieldErrorMessage(formState.errors.labIndex)}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px]',
								fieldErrorMessage(formState.errors.labIndex) ? 'text-error' : '',
							)}
							wrapperClassname="w-[226px] ring-input-border-primary"
							buttonClassName="text-sm rounded-[8px]"
							label={fieldErrorMessage(formState.errors.labIndex) || 'Индекс'}
							placeholder="Выберите индекс"
							disabled={ro}
						/>
					)}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						fieldErrorMessage(formState.errors.labIndexValue) ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={fieldErrorMessage(formState.errors.labIndexValue) || 'Значение индекса, дБ'}
					error={fieldErrorMessage(formState.errors.labIndexValue)}
					placeholder="—"
					{...register('labIndexValue')}
					type={'text'}
					disabled
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						fieldErrorMessage(formState.errors.laboratoryTestSource) ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={fieldErrorMessage(formState.errors.laboratoryTestSource) || 'Источник'}
					error={fieldErrorMessage(formState.errors.laboratoryTestSource)}
					placeholder="Введите источник"
					{...register('laboratoryTestSource')}
					type={'text'}
					disabled={ro}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						fieldErrorMessage(formState.errors.laboratoryC) ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={fieldErrorMessage(formState.errors.laboratoryC) || 'C'}
					error={fieldErrorMessage(formState.errors.laboratoryC)}
					placeholder="—"
					{...register('laboratoryC')}
					type={'text'}
					disabled
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						fieldErrorMessage(formState.errors.laboratoryCtr) ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={fieldErrorMessage(formState.errors.laboratoryCtr) || 'Ctr'}
					error={fieldErrorMessage(formState.errors.laboratoryCtr)}
					placeholder="—"
					{...register('laboratoryCtr')}
					type={'text'}
					disabled
				/>
			</div>
		</>
	);
};
