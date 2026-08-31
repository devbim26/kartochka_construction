import { Input, useI18n } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { MaterialParametrs, RuMaterialParametrs } from '@features/constructor';
import type { ConstructionFieldTypesProps } from '@features/guidbooks/types';
import { resolveFormErrorMessage } from '@features/guidbooks/utils/validation/resolve-form-error-message.utils';
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
		const { t, locale } = useI18n();
		const { formState, register, getValues } = currentForm;

		const basePath = `constructionTypeObject.${positionMap[constructionPosition]}.${fieldIndex}.materialTypeValue`;
		const values = getValues(basePath) || [];

		const thicknessIndex = values.findIndex(
			(v: any) =>
				v.materialParameters === MaterialParametrs.Thickness ||
				v.materialParameters === 'Width',
		);
		const rackStepIndex = values.findIndex(
			(v: any) => v.materialParameters === MaterialParametrs.RackStep,
		);

		const thicknessLabel =
			locale === 'en'
				? MaterialParametrs.Thickness
				: RuMaterialParametrs.Thickness;
		const rackStepLabel =
			locale === 'en' ? MaterialParametrs.RackStep : RuMaterialParametrs.RackStep;

		const getError = (index: number) =>
			resolveFormErrorMessage(
				(formState.errors as any)?.constructionTypeObject?.[
					positionMap[constructionPosition]
				]?.[fieldIndex]?.materialTypeValue?.[index]?.value?.message,
				t,
			);

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
						label={getError(thicknessIndex) || thicknessLabel}
						error={getError(thicknessIndex)}
						placeholder="Введите толщину"
						{...register(`${basePath}.${thicknessIndex}.value`)}
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
						label={getError(rackStepIndex) || rackStepLabel}
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
