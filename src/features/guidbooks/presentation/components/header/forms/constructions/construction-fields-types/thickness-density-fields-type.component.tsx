import { Input } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { ConstructionFieldTypesProps } from '@features/guidbooks/types';

import { twMerge } from 'tailwind-merge';

export const ThicknessDensityFieldsType = memoize(
	({ fieldIndex, constructionIndex, currentForm }: ConstructionFieldTypesProps) => {
		const { formState, register } = currentForm;

		return (
			<div className="flex flex-wrap gap-[16px]">
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
						(formState.errors as any)?.constructionTypeObject?.constructions?.[
							constructionIndex
						]?.userMaterials?.[fieldIndex]?.materialTypeValue?.[0]?.value?.message
							? 'text-error'
							: '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
					wrapperClassName="flex-row items-center gap-[16px]"
					label={
						(formState.errors as any)?.constructionTypeObject?.constructions?.[
							constructionIndex
						]?.userMaterials?.[fieldIndex]?.materialTypeValue?.[0]?.value?.message ||
						'Толщина, мм'
					}
					error={
						(formState.errors as any)?.constructionTypeObject?.constructions?.[
							constructionIndex
						]?.userMaterials?.[fieldIndex]?.materialTypeValue?.[0]?.value?.message
					}
					placeholder="Введите толщину"
					{...register(
						`constructionTypeObject.constructions.${constructionIndex}.userMaterials.${fieldIndex}.materialTypeValue.${0}.value`,
					)}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
						(formState.errors as any)?.constructionTypeObject?.constructions?.[
							constructionIndex
						]?.userMaterials?.[fieldIndex]?.materialTypeValue?.[1]?.value?.message
							? 'text-error'
							: '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
					wrapperClassName="flex-row items-center gap-[16px]"
					label={
						(formState.errors as any)?.constructionTypeObject?.constructions?.[
							constructionIndex
						]?.userMaterials?.[fieldIndex]?.materialTypeValue?.[1]?.value?.message ||
						'Плотность, кг/м³'
					}
					error={
						(formState.errors as any)?.constructionTypeObject?.constructions?.[
							constructionIndex
						]?.userMaterials?.[fieldIndex]?.materialTypeValue?.[1]?.value?.message
					}
					placeholder="Введите плотность"
					{...register(
						`constructionTypeObject.constructions.${constructionIndex}.userMaterials.${fieldIndex}.materialTypeValue.${1}.value`,
					)}
					type={'number'}
				/>
			</div>
		);
	},
	'ThicknessDensityFieldsType',
);
