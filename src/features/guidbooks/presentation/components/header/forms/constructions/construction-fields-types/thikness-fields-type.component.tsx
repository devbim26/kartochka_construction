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

export const ThicknessFieldsType = memoize(
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

		const thicknessIndex = values.findIndex(
			(v: any) => v.materialParameters === MaterialParametrs.Thickness,
		);

		const getError = (index: number) =>
			(formState.errors as any)?.constructionTypeObject?.[
				positionMap[constructionPosition]
			]?.[fieldIndex]?.materialTypeValue?.[index]?.value?.message;

		return (
			<div className="flex flex-wrap gap-[16px]">
				{thicknessIndex !== -1 && (
					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
							getError(thicknessIndex) ? 'text-error' : '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
						wrapperClassName="flex-row items-center gap-[16px]"
						label={getError(thicknessIndex) || 'Толщина, мм'}
						error={getError(thicknessIndex)}
						placeholder="Введите толщину"
						{...register(`${basePath}.${thicknessIndex}.value`)}
						type="number"
					/>
				)}
			</div>
		);
	},
	'ThicknessFieldsType',
);
