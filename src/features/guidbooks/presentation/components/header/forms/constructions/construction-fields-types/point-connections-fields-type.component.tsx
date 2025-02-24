import { Input } from '@core';
import type { ConstructionsAddData } from '@features';

import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

type Props = {
	fieldIndex: number;
	constructionIndex: number;
};

export const PointConnectionsFieldsType = ({ fieldIndex, constructionIndex }: Props) => {
	const form = useFormContext<ConstructionsAddData>();
	const { formState } = form;

	return (
		<div className="flex flex-wrap gap-[16px]">
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
					formState.errors?.constructionTypeObject?.constructions?.[constructionIndex]
						?.userMaterials?.[fieldIndex]?.materialTypeValue?.[0]?.value?.message
						? 'text-error'
						: '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
				wrapperClassName="flex-row items-center gap-[16px]"
				label={
					formState.errors?.constructionTypeObject?.constructions?.[constructionIndex]
						?.userMaterials?.[fieldIndex]?.materialTypeValue?.[0]?.value?.message ||
					'Количество точечных связей, шт/м²'
				}
				error={
					formState.errors?.constructionTypeObject?.constructions?.[constructionIndex]
						?.userMaterials?.[fieldIndex]?.materialTypeValue?.[0]?.value?.message
				}
				placeholder="Введите количество"
				{...form.register(
					`constructionTypeObject.constructions.${constructionIndex}.userMaterials.${fieldIndex}.materialTypeValue.${0}.value`,
				)}
				type={'number'}
			/>
		</div>
	);
};
