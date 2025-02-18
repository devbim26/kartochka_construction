import type { ConstructionsAddData } from '@features/guidbooks/types';
import { useFormContext } from 'react-hook-form';

interface BaseConstructionLayerProps {
	id: string;
}

export const BaseConstructionLayer = ({ id }: BaseConstructionLayerProps) => {
	const form = useFormContext<ConstructionsAddData>();
	const { formState, control, setValue, watch } = form;

	return (
		<div className="flex flex-wrap gap-[16px]">
			{/* <Controller
				name={`baseConstruction.${id}.type`}
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={[{ label: 'Тяжелая однослойная стена', value: '1' }]}
						error={formState.errors.baseConstruction?.[id]?.type?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px]',
							formState.errors.baseConstruction?.[id]?.type?.message
								? 'text-error'
								: '',
						)}
						wrapperClassname="ring-input-border-primary flex-row items-center gap-[16px]"
						buttonClassName="text-sm rounded-[8px] w-[226px]"
						label={formState.errors.baseConstruction?.[id]?.type?.message || ''}
						placeholder="Выберите тип"
					/>
				)}
			/>
			<Controller
				name={`baseConstruction.${id}.material`}
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={[{ label: 'Полнотелый красный кирпич', value: '1' }]}
						error={formState.errors.baseConstruction?.[id]?.material?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px]',
							formState.errors.baseConstruction?.[id]?.material?.message
								? 'text-error'
								: '',
						)}
						wrapperClassname="ring-input-border-primary flex-row items-center gap-[16px]"
						buttonClassName="text-sm rounded-[8px] w-[226px]"
						label={formState.errors.baseConstruction?.[id]?.material?.message || ''}
						placeholder="Выберите материал"
					/>
				)}
			/>
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
					formState.errors.baseConstruction?.[id]?.thickness?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
				wrapperClassName="flex-row items-center gap-[16px]"
				label={formState.errors.baseConstruction?.[id]?.thickness?.message || 'Толщина, мм'}
				error={formState.errors.baseConstruction?.[id]?.thickness?.message}
				placeholder="Введите толщину"
				{...form.register(`baseConstruction.${id}.thickness`)}
				type={'number'}
			/>
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
					formState.errors.baseConstruction?.[id]?.density?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
				wrapperClassName="flex-row items-center gap-[16px]"
				label={
					formState.errors.baseConstruction?.[id]?.density?.message || 'Плотность, кг/м³'
				}
				error={formState.errors.baseConstruction?.[id]?.density?.message}
				placeholder="Введите плотность"
				{...form.register(`baseConstruction.${id}.density`)}
				type={'number'}
			/> */}
		</div>
	);
};
