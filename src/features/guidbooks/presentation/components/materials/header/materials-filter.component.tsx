import { Input } from '@core';
import { MaterialsFilterData } from '@features';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const MaterialsFilter = () => {
	const form = useFormContext<MaterialsFilterData>();

	const { formState, control } = form;
	return (
		<div className="flex flex-wrap gap-[16px]">
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
					formState.errors.name?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors.name?.message || 'Название'}
				error={formState.errors.name?.message}
				placeholder="Введите название"
				{...form.register('name')}
				type={'text'}
			/>
			{/* <Controller
				name="materialType"
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={[{ label: '1', value: '1' }]}
						error={formState.errors.materialType?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px]',
							formState.errors.materialType?.message ? 'text-error' : '',
						)}
						wrapperClassname="w-[226px] ring-input-border-primary"
						buttonClassName="text-sm rounded-[8px]"
						label={formState.errors.materialType?.message || 'Тип материала'}
						placeholder="Выберите тип материала"
					/>
				)}
			/> */}
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
					formState.errors.density?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors.density?.message || 'Плотность материала, кг/м³'}
				error={formState.errors.density?.message}
				placeholder="Введите плотность материала"
				{...form.register('density')}
				type={'number'}
			/>
			<Input
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
					formState.errors.thickness?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors.thickness?.message || 'Толщина материала, мм'}
				error={formState.errors.thickness?.message}
				placeholder="Введите толщину материала"
				{...form.register('thickness')}
				type={'number'}
			/>
		</div>
	);
};
