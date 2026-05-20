import { Input, Select } from '@core';
import type { ConstructionsAddData } from '@features/guidbooks/types';
import { RuIndexTypeNamesSelectValues } from '@features/guidbooks/types';
import type { FieldErrors, FieldPath } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { FormSubTitle } from '../../form-sub-title.component';

export type ConstructionLaboratoryFieldsPrefix = 'airLaboratory' | 'impactLaboratory';

type Props = {
	/** Если true — только просмотр (блокировка полей) */
	readOnly?: boolean;
	namePrefix: ConstructionLaboratoryFieldsPrefix;
	/** Подзаголовок блока (например «Воздушный шум» / «Ударный шум» для перекрытий) */
	title?: string;
};

const fieldErrorMessage = (error: unknown): string | undefined => {
	if (error && typeof error === 'object' && 'message' in error) {
		const m = (error as { message: unknown }).message;
		return typeof m === 'string' ? m : undefined;
	}
	return undefined;
};

const pickNestedIssue = (
	errors: FieldErrors<ConstructionsAddData>,
	prefix: ConstructionLaboratoryFieldsPrefix,
	field: keyof ConstructionsAddData['airLaboratory'],
): unknown => {
	const block = errors[prefix];
	if (!block || typeof block !== 'object') return undefined;
	return (block as Record<string, unknown>)[field as string];
};

/**
 * Блок лабораторных полей (воздушный или ударный шум) для форм добавления и редактирования.
 */
export const ConstructionLaboratoryDataFields = ({ readOnly = false, namePrefix, title }: Props) => {
	const { formState, control, register } = useFormContext<ConstructionsAddData>();
	const ro = readOnly;
	const p = namePrefix;

	return (
		<>
			{title ? <FormSubTitle text={title} /> : null}
			<div className="flex flex-wrap gap-[16px]">
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						fieldErrorMessage(pickNestedIssue(formState.errors, p, 'labRTotal'))
							? 'text-error'
							: '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[468px]"
					label={fieldErrorMessage(pickNestedIssue(formState.errors, p, 'labRTotal')) || 'R_total'}
					error={fieldErrorMessage(pickNestedIssue(formState.errors, p, 'labRTotal'))}
					placeholder="Введите через запятую"
					{...register(`${p}.labRTotal` as FieldPath<ConstructionsAddData>)}
					type={'text'}
					disabled={ro}
				/>
				<Controller
					name={`${p}.labIndex` as FieldPath<ConstructionsAddData>}
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							isSearchable
							value={String(field.value ?? '')}
							options={RuIndexTypeNamesSelectValues}
							error={fieldErrorMessage(pickNestedIssue(formState.errors, p, 'labIndex'))}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px]',
								fieldErrorMessage(pickNestedIssue(formState.errors, p, 'labIndex'))
									? 'text-error'
									: '',
							)}
							wrapperClassname="w-[226px] ring-input-border-primary"
							buttonClassName="text-sm rounded-[8px]"
							label={fieldErrorMessage(pickNestedIssue(formState.errors, p, 'labIndex')) || 'Индекс'}
							placeholder="Выберите индекс"
							disabled={ro}
						/>
					)}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						fieldErrorMessage(pickNestedIssue(formState.errors, p, 'labIndexValue'))
							? 'text-error'
							: '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={
						fieldErrorMessage(pickNestedIssue(formState.errors, p, 'labIndexValue')) ||
						'Значение индекса, дБ'
					}
					error={fieldErrorMessage(pickNestedIssue(formState.errors, p, 'labIndexValue'))}
					placeholder="—"
					{...register(`${p}.labIndexValue` as FieldPath<ConstructionsAddData>)}
					type={'text'}
					disabled
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						fieldErrorMessage(pickNestedIssue(formState.errors, p, 'laboratoryTestSource'))
							? 'text-error'
							: '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={
						fieldErrorMessage(pickNestedIssue(formState.errors, p, 'laboratoryTestSource')) ||
						'Источник'
					}
					error={fieldErrorMessage(pickNestedIssue(formState.errors, p, 'laboratoryTestSource'))}
					placeholder="Введите источник"
					{...register(`${p}.laboratoryTestSource` as FieldPath<ConstructionsAddData>)}
					type={'text'}
					disabled={ro}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						fieldErrorMessage(pickNestedIssue(formState.errors, p, 'laboratoryC'))
							? 'text-error'
							: '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={fieldErrorMessage(pickNestedIssue(formState.errors, p, 'laboratoryC')) || 'C'}
					error={fieldErrorMessage(pickNestedIssue(formState.errors, p, 'laboratoryC'))}
					placeholder="—"
					{...register(`${p}.laboratoryC` as FieldPath<ConstructionsAddData>)}
					type={'text'}
					disabled
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						fieldErrorMessage(pickNestedIssue(formState.errors, p, 'laboratoryCtr'))
							? 'text-error'
							: '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={fieldErrorMessage(pickNestedIssue(formState.errors, p, 'laboratoryCtr')) || 'Ctr'}
					error={fieldErrorMessage(pickNestedIssue(formState.errors, p, 'laboratoryCtr'))}
					placeholder="—"
					{...register(`${p}.laboratoryCtr` as FieldPath<ConstructionsAddData>)}
					type={'text'}
					disabled
				/>
			</div>
		</>
	);
};
