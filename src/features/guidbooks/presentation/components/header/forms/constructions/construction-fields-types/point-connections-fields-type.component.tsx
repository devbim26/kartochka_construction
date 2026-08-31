import { Input, Select, useI18n } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { ConnectionTypeSelectValues, MaterialParametrs } from '@features/constructor';
import type { ConstructionFieldTypesProps } from '@features/guidbooks/types';
import { resolveFormErrorMessage } from '@features/guidbooks/utils/validation/resolve-form-error-message.utils';
import { Controller } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

const positionMap: Record<'Left' | 'Center' | 'Right', string> = {
	Left: 'leftConstruction',
	Center: 'centerConstruction',
	Right: 'rightConstruction',
};

export const PointConnectionsFieldsType = memoize(
	({
		fieldIndex,
		constructionPosition,
		currentForm,
	}: Omit<ConstructionFieldTypesProps, 'constructionIndex'> & {
		constructionPosition: 'Left' | 'Center' | 'Right';
	}) => {
		const { t } = useI18n();
		const { formState, register, getValues } = currentForm;

		const basePath = `constructionTypeObject.${positionMap[constructionPosition]}.${fieldIndex}.materialTypeValue`;
		const values = getValues(basePath) || [];

		const pointIndex = values.findIndex(
			(v: any) => v.materialParameters === MaterialParametrs.ConnectionNumber,
		);

		const typeIndex = values.findIndex(
			(v: any) => v.materialParameters === MaterialParametrs.ConnectionType,
		);

		const getError = (index: number) =>
			resolveFormErrorMessage(
				(formState.errors as any)?.constructionTypeObject?.[
					positionMap[constructionPosition]
				]?.[fieldIndex]?.materialTypeValue?.[index]?.value?.message,
				t,
			);

		return (
			<div className="flex flex-wrap gap-[16px]">
				{pointIndex !== -1 && (
					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
							getError(pointIndex) ? 'text-error' : '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
						wrapperClassName="flex-row items-center gap-[16px]"
						label={getError(pointIndex) || 'Количество точечных связей, шт/м²'}
						error={getError(pointIndex)}
						placeholder="Введите количество"
						{...register(`${basePath}.${pointIndex}.value`)}
						type="number"
					/>
				)}

				{typeIndex !== -1 && (
					<Controller
						name={`${basePath}.${typeIndex}.value`}
						control={currentForm.control}
						render={({ field }) => (
							<Select
								{...field}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
									getError(typeIndex) ? 'text-error' : '',
								)}
								wrapperClassname="flex-row w-[300px] ring-input-border-primary items-center gap-[16px]"
								label={getError(typeIndex) || 'Тип связи'}
								error={getError(typeIndex)}
								options={ConnectionTypeSelectValues}
							/>
						)}
					/>
				)}
			</div>
		);
	},
	'PointConnectionsFieldsType',
);
