import { convertToSelectValues, Input, Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { useConstructionMaterialsCatalog } from '@features/guidbooks/utils';
import {
	MaterialTypeEnum,
	type ConstructionMaterialTypesProps,
} from '@features/guidbooks/types';
import { Controller } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { useSelectableMaterialDesignation } from './selectable-material-designation.context';

const positionMap: Record<'Left' | 'Center' | 'Right', string> = {
	Left: 'leftConstruction',
	Center: 'centerConstruction',
	Right: 'rightConstruction',
};

export const BoardMaterialType = memoize(
	({
		constructionPosition,
		fieldIndex,
		currentForm,
	}: Omit<ConstructionMaterialTypesProps, 'constructionIndex'> & {
		constructionPosition: 'Left' | 'Center' | 'Right';
	}) => {
		const { showMaterialDesignationInput } = useSelectableMaterialDesignation();
		const { formState, control, setValue, register } = currentForm;
		const materials = useConstructionMaterialsCatalog(MaterialTypeEnum.Board, currentForm);

		const basePath = `constructionTypeObject.${positionMap[constructionPosition]}.${fieldIndex}`;

		return (
			<div className="flex flex-wrap gap-[16px]">
				<Controller
					name={`${basePath}.materialId`}
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							value={field.value || ''}
							options={convertToSelectValues(materials ?? []) || []}
							error={
								(formState.errors as any)?.constructionTypeObject?.[
									positionMap[constructionPosition]
								]?.[fieldIndex]?.materialId?.message
							}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px] text-nowrap w-[226px]',
								(formState.errors as any)?.constructionTypeObject?.[
									positionMap[constructionPosition]
								]?.[fieldIndex]?.materialId?.message
									? 'text-error'
									: '',
							)}
							wrapperClassname="flex-row ring-input-border-primary items-center gap-[16px]"
							buttonClassName="text-sm rounded-[8px] w-[226px]"
							label={
								(formState.errors as any)?.constructionTypeObject?.[
									positionMap[constructionPosition]
								]?.[fieldIndex]?.materialId?.message || 'Плитные материалы'
							}
							placeholder="Выберите материал"
							isSearchable
							onChange={(selectedOption: string) => {
								setValue(`${basePath}.materialId`, selectedOption);
								if (showMaterialDesignationInput) {
									setValue(`${basePath}.additionalName`, '');
								}
								const selectedMaterial = materials?.find(
									(m) => m.id === selectedOption,
								);
								setValue<any>(
									`${basePath}.materialTypeValue.0.value`,
									selectedMaterial?.thickness,
								);
								setValue<any>(
									`${basePath}.materialTypeValue.1.value`,
									selectedMaterial?.density,
								);
							}}
						/>
					)}
				/>

				{showMaterialDesignationInput && (
					<Input
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						containerClassName="w-[226px]"
						error={
							(formState.errors as any)?.constructionTypeObject?.[
								positionMap[constructionPosition]
							]?.[fieldIndex]?.additionalName?.message
						}
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
						)}
						placeholder="Введите обозначение"
						{...register(`${basePath}.additionalName`)}
						type="text"
					/>
				)}
			</div>
		);
	},
	'BoardMaterialType',
);
