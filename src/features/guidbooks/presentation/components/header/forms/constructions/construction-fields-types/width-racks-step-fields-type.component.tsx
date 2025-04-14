import { Input } from '@core';
<<<<<<< HEAD
import type { ConstructionsAddData } from '@features/guidbooks/types';
import { useFormContext } from 'react-hook-form';
=======
import { memoize } from '@core/utils/hoc/memo.utils';
import type { ConstructionFieldTypesProps } from '@features';
>>>>>>> 4998cc9780d3370f0ee984a9961ae51ae777b894
import { twMerge } from 'tailwind-merge';

export const WidthRacksStepFieldsType = memoize(
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
						'Ширина, мм'
					}
					error={
						(formState.errors as any)?.constructionTypeObject?.constructions?.[
							constructionIndex
						]?.userMaterials?.[fieldIndex]?.materialTypeValue?.[0]?.value?.message
					}
					placeholder="Введите ширину"
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
						'Шаг стоек, мм'
					}
					error={
						(formState.errors as any)?.constructionTypeObject?.constructions?.[
							constructionIndex
						]?.userMaterials?.[fieldIndex]?.materialTypeValue?.[1]?.value?.message
					}
					placeholder="Введите шаг стоек"
					{...register(
						`constructionTypeObject.constructions.${constructionIndex}.userMaterials.${fieldIndex}.materialTypeValue.${1}.value`,
					)}
					type={'number'}
				/>
			</div>
		);
	},
	'WidthRacksStepFieldsType',
);
