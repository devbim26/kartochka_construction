import { Input, Select } from '@core';
import { Controller } from 'react-hook-form';
import { withMemo } from '../../../../../../../non-alias/with-memo.utils';
import {
	HeaderFormsProps,
	IMaterialsAddAndEditForm,
	MaterialsAddAndEditFormKeys,
} from '../../../../../types';
import { FormSubTitle } from '../form-sub-title.components';

export const MaterialsAddAndEdit = withMemo(
	({ control, setValue }: HeaderFormsProps<IMaterialsAddAndEditForm>) => {
		return (
			<div className="flex flex-col gap-[23px]">
				<FormSubTitle text="Описание" />
				<div className="flex flex-wrap gap-[23px]">
					<Controller
						control={control}
						name={MaterialsAddAndEditFormKeys.Name}
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
						name={MaterialsAddAndEditFormKeys.Description}
						render={({ field }) => (
							<Input
								{...field}
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Описание"
								placeholder="Введите описание"
							/>
						)}
					/>
					<Controller
						control={control}
						name={MaterialsAddAndEditFormKeys.Density}
						render={({ field }) => (
							<Input
								{...field}
								value={field.value || ''}
								type="number"
								min={1}
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Плотность материала, кг/м2"
								placeholder="Введите плотность материала"
							/>
						)}
					/>
					<Controller
						control={control}
						name={MaterialsAddAndEditFormKeys.Thickness}
						render={({ field }) => (
							<Input
								{...field}
								value={field.value || ''}
								type="number"
								min={1}
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Толщина материала, мм"
								placeholder="Введите толщину"
							/>
						)}
					/>
					<Controller
						control={control}
						name={MaterialsAddAndEditFormKeys.MaterialType}
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
									setValue(MaterialsAddAndEditFormKeys.MaterialType, value);
								}}
							/>
						)}
					/>
					<Controller
						control={control}
						name={MaterialsAddAndEditFormKeys.MaterialType}
						render={({ field }) => (
							<Select
								{...field}
								placeholder="Выбрать регион"
								cancelable={true}
								label="Регион"
								classNames={{
									popover: {
										bodyClassName: 'w-[226px]',
									},
								}}
								options={[]}
								onChange={(value) => {
									setValue(MaterialsAddAndEditFormKeys.MaterialType, value);
								}}
							/>
						)}
					/>
					<Controller
						control={control}
						name={MaterialsAddAndEditFormKeys.MaterialType}
						render={({ field }) => (
							<Select
								{...field}
								placeholder="Выбрать тип"
								cancelable={true}
								label="Тип"
								classNames={{
									popover: {
										bodyClassName: 'w-[226px]',
									},
								}}
								options={[]}
								onChange={(value) => {
									setValue(MaterialsAddAndEditFormKeys.MaterialType, value);
								}}
							/>
						)}
					/>
					<Controller
						control={control}
						name={MaterialsAddAndEditFormKeys.Name}
						render={({ field }) => (
							<Input
								{...field}
								labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								containerClassName="w-[226px]"
								label="Производитель"
								placeholder="Введите производителя"
							/>
						)}
					/>
				</div>
				<FormSubTitle text="Физические свойства" />
				<div className="flex flex-wrap gap-[23px]"></div>
			</div>
		);
	},
);
