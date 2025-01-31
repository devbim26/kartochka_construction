import { Input, Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { MaterialsData, type HeaderFormsProps, type IMaterialsAddAndEditForm } from '@features';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { FormSubTitle } from '../form-sub-title.components';

export const MaterialsAddAndEdit = memoize(
	({ control }: HeaderFormsProps<IMaterialsAddAndEditForm>) => {
		const form = useFormContext<MaterialsData>();
		const onSubmit = () => {};

		const { formState, watch, setValue } = form;
		console.log({ ...form.getValues() });

		// useEffect(() => {
		// 	setValue('density', '');
		// }, []);

		return (
			<div className="flex flex-col gap-[23px]">
				<FormSubTitle text="Описание" />
				<div className="flex flex-wrap gap-[23px]">
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

					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
							formState.errors.description?.message ? 'text-error' : '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						containerClassName="w-[226px]"
						label={formState.errors.description?.message || 'Описание'}
						error={formState.errors.description?.message}
						placeholder="Введите описание"
						{...form.register('description')}
						type={'text'}
					/>

					<Input
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
							formState.errors.shortName?.message ? 'text-error' : '',
						)}
						inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
						containerClassName="w-[226px]"
						label={formState.errors.shortName?.message || 'Краткое название'}
						error={formState.errors.shortName?.message}
						placeholder="Введите краткое название"
						{...form.register('shortName')}
						type={'text'}
					/>

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
						label={formState.errors.thickness?.message || 'Толщина материала, кг/м³'}
						error={formState.errors.thickness?.message}
						placeholder="Введите толщину материала"
						{...form.register('thickness')}
						type={'number'}
					/>

					<Controller
						name="materialType"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								value={field.value || ''}
								options={[{ label: '1', value: '1' }]}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
									formState.errors.materialType?.message ? 'text-error' : '',
								)}
								buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								wrapperClassname="w-[226px] shadow-none"
								label={formState.errors.materialType?.message || 'Тип материала'}
								placeholder="Выберите тип материала"
							/>
						)}
					/>

					<Controller
						name="region"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								value={field.value || ''}
								options={[{ label: '1', value: '1' }]}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
									formState.errors.region?.message ? 'text-error' : '',
								)}
								buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
								wrapperClassname="w-[226px]"
								label={formState.errors.region?.message || 'Регион'}
								placeholder="Выберите регион"
							/>
						)}
					/>
				</div>
				<FormSubTitle text="Физические свойства" />
				<div className="flex flex-wrap gap-[23px]"></div>
			</div>
		);
	},
	'MaterialsAddAndEdit',
);
