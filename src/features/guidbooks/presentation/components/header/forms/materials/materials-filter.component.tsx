import { Input, Select } from '@core';
import { Controller } from 'react-hook-form';
import { withMemo } from '../../../../../../../non-alias';
import {
	HeaderFormsProps,
	IMaterialsFilterForm,
	MaterialsFilterFormKeys,
} from '../../../../../types';

export const MaterialsFilter = withMemo(
	({ control, setValue }: HeaderFormsProps<IMaterialsFilterForm>) => {
		return (
			<>
				<Controller
					control={control}
					name={MaterialsFilterFormKeys.Name}
					render={({ field }) => (
						<Input
							{...field}
							labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							containerClassName="w-[226px]"
							label="Название"
							placeholder="Введите название"
						/>
					)}
				/>
				<Controller
					control={control}
					name={MaterialsFilterFormKeys.MaterialType}
					render={({ field }) => (
						<Select
							{...field}
							placeholder="Выбрать тип материала"
							cancelable={true}
							label="Тип материала"
							classNames={{
								popover: {
									bodyClassName: 'w-[226px]',
								},
							}}
							options={[]}
							onChange={(value) => {
								setValue(MaterialsFilterFormKeys.MaterialType, value);
							}}
						/>
					)}
				/>
				<Controller
					control={control}
					name={MaterialsFilterFormKeys.Density}
					render={({ field }) => (
						<Input
							{...field}
							value={field.value || ''}
							containerClassName="w-[226px]"
							labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							label="Плотность материала, кг/м2"
							type="number"
							min={1}
							placeholder="Введите плотность материала"
						/>
					)}
				/>
				<Controller
					control={control}
					name={MaterialsFilterFormKeys.Thickness}
					render={({ field }) => (
						<Input
							{...field}
							containerClassName="w-[226px]"
							labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							value={field.value || ''}
							label="Толщина материала, мм"
							type="number"
							min={1}
							placeholder="Введите толщину"
						/>
					)}
				/>
			</>
		);
	},
);
