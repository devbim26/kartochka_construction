import { Input } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { MaterialParametrs } from '@features/constructor';
import type { ConstructionFieldTypesProps } from '@features/guidbooks/types';
import { twMerge } from 'tailwind-merge';

const positionMap: Record<'Left' | 'Center' | 'Right', string> = {
	Left: 'leftConstruction',
	Center: 'centerConstruction',
	Right: 'rightConstruction',
};

export const WidthRacksStepFieldsType = memoize(
	({
		fieldIndex,
		constructionPosition,
		currentForm,
	}: Omit<ConstructionFieldTypesProps, 'constructionIndex'> & {
		constructionPosition: 'Left' | 'Center' | 'Right';
	}) => {
		const { formState, register, getValues } = currentForm;

		const basePath = `constructionTypeObject.${positionMap[constructionPosition]}.${fieldIndex}.materialTypeValue`;
		const values = getValues(basePath) || [];

		const widthIndex = values.findIndex(
			(v: any) => v.materialParameters === MaterialParametrs.Width,
		);
		const rackStepIndex = values.findIndex(
			(v: any) => v.materialParameters === MaterialParametrs.RackStep,
		);

		const getError = (index: number) =>
			(formState.errors as any)?.constructionTypeObject?.[
				positionMap[constructionPosition]
			]?.[fieldIndex]?.materialTypeValue?.[index]?.value?.message;

		return (
			<div className="flex flex-wrap gap-[16px]">
				{widthIndex !== -1 && (
					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
							getError(widthIndex) ? 'text-error' : '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
						wrapperClassName="flex-row items-center gap-[16px]"
						label={getError(widthIndex) || 'Ширина, мм'}
						error={getError(widthIndex)}
						placeholder="Введите ширину"
						{...register(`${basePath}.${widthIndex}.value`)}
						type="number"
					/>
				)}

				{rackStepIndex !== -1 && (
					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
							getError(rackStepIndex) ? 'text-error' : '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
						wrapperClassName="flex-row items-center gap-[16px]"
						label={getError(rackStepIndex) || 'Шаг стоек, мм'}
						error={getError(rackStepIndex)}
						placeholder="Введите шаг стоек"
						{...register(`${basePath}.${rackStepIndex}.value`)}
						type="number"
					/>
				)}
			</div>
		);
	},
	'WidthRacksStepFieldsType',
);
