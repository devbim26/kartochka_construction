import { Input, Select } from '@core';
import { ConstructionsAddData } from '@features/guidbooks/utils';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface BaseConstructionLayerProps {
	id: string;
}

export const BaseConstrustionLayer = ({ id }: BaseConstructionLayerProps) => {
	const form = useFormContext<ConstructionsAddData>();
	const { formState, control, setValue } = form;

	return (
		<div className="flex flex-wrap gap-[16px]">
			<Controller
				name={`heavySingleWall.${id}.type`}
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={[{ label: 'Тяжелая однослойная стена', value: '1' }]}
						error={formState.errors.heavySingleWall?.[id]?.type?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px]',
							formState.errors.heavySingleWall?.[id]?.type?.message
								? 'text-error'
								: '',
						)}
						wrapperClassname="ring-input-border-primary flex-row items-center gap-[16px]"
						buttonClassName="text-sm rounded-[8px] w-[226px]"
						label={formState.errors.heavySingleWall?.[id]?.type?.message || ''}
						placeholder="Выберите материал"
					/>
				)}
			/>
			<Controller
				name={`heavySingleWall.${id}.material`}
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={[{ label: 'Полнотелый красный кирпич', value: '1' }]}
						error={formState.errors.heavySingleWall?.[id]?.material?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px]',
							formState.errors.heavySingleWall?.[id]?.material?.message
								? 'text-error'
								: '',
						)}
						wrapperClassname="ring-input-border-primary flex-row items-center gap-[16px]"
						buttonClassName="text-sm rounded-[8px] w-[226px]"
						label={formState.errors.heavySingleWall?.[id]?.material?.message || ''}
						placeholder="Выберите материал"
					/>
				)}
			/>
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
					formState.errors.heavySingleWall?.[id]?.thickness?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
				wrapperClassName="flex-row items-center gap-[16px]"
				label={formState.errors.heavySingleWall?.[id]?.thickness?.message || 'Толщина, мм'}
				error={formState.errors.heavySingleWall?.[id]?.thickness?.message}
				placeholder="Введите толщину"
				{...form.register(`heavySingleWall.${id}.thickness`)}
				type={'number'}
			/>
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
					formState.errors.heavySingleWall?.[id]?.density?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
				wrapperClassName="flex-row items-center gap-[16px]"
				label={
					formState.errors.heavySingleWall?.[id]?.density?.message || 'Плотность, кг/м³'
				}
				error={formState.errors.heavySingleWall?.[id]?.density?.message}
				placeholder="Введите плотность"
				{...form.register(`heavySingleWall.${id}.density`)}
				type={'number'}
			/>
		</div>
	);
};
