import { Input, Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import type { CreateConstructionData } from '@features/constructor/types';
import { CreateConstructionConfig } from '@features/constructor/utils';
import { RuConstructionTypeSelectValues } from '@features/guidbooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const CreateConstructionForm = memoize(() => {
	const form = useForm<CreateConstructionData>({
		defaultValues: CreateConstructionConfig.defaultValues,
		resolver: zodResolver(CreateConstructionConfig.schema),
	});

	const { register, formState, control } = form;

	return (
		<div className="flex flex-col border-b">
			<FormProvider {...form}>
				<div className="flex flex-col gap-[20px]">
					<Input
						{...register('name')}
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px] text-left',
							formState.errors.name?.message ? 'text-error' : '',
						)}
						wrapperClassName="shadow-none ring-input-border-primary flex-row gap-[20px]"
						inputClassName="w-[226px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						error={formState.errors.name?.message}
						containerClassName="w-[226px]"
						label={formState.errors?.name?.message || 'Название'}
						placeholder="Введите название"
						maxLength={50}
					/>
					<Controller
						control={control}
						name={'constructionType'}
						render={({ field }) => (
							<Select
								options={RuConstructionTypeSelectValues}
								{...field}
								value={field.value || ''}
								label={
									formState.errors?.constructionType?.message || 'Тип конструкции'
								}
								isSearchable
								error={formState.errors.constructionType?.message}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-[145px] text-left',
									formState.errors.constructionType?.message ? 'text-error' : '',
								)}
								placeholder="Выберите тип конструкции"
								buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
								wrapperClassname="shadow-none ring-input-border-primary flex-row gap-[20px]"
							/>
						)}
					/>
					<Controller
						control={control}
						name={'construction'}
						render={({ field }) => (
							<Select
								options={RuConstructionTypeSelectValues}
								{...field}
								value={field.value || ''}
								label={formState.errors?.construction?.message || 'Конструкция'}
								isSearchable
								error={formState.errors.construction?.message}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-[145px] text-left',
									formState.errors.construction?.message ? 'text-error' : '',
								)}
								placeholder="Выберите конструкцию"
								buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
								wrapperClassname="shadow-none ring-input-border-primary flex-row gap-[20px]"
							/>
						)}
					/>
					<div className="flex items-center gap-x-[20px]">
						<div className="flex w-[145px] text-left">
							<label
								className={twMerge(
									'w-[145px] font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
									(formState.errors.firstPlacementRoom ||
										formState.errors.secondPlacementRoom) &&
										'text-error',
								)}
							>
								{formState.errors.firstPlacementRoom ||
								formState.errors.secondPlacementRoom
									? 'Поле обязательно для заполнения'
									: 'Тип здания'}
							</label>
						</div>
						<div className="flex gap-x-[12px]">
							<Controller
								control={control}
								name="firstPlacementRoom"
								render={({ field }) => (
									<Select
										options={RuConstructionTypeSelectValues}
										{...field}
										error={formState.errors.firstPlacementRoom?.message}
										value={field.value || ''}
										placeholder="Выберите первое помещение"
										isSearchable
										buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
										wrapperClassname="shadow-none ring-input-border-primary"
									/>
								)}
							/>
							<Controller
								control={control}
								name="secondPlacementRoom"
								render={({ field }) => (
									<Select
										options={RuConstructionTypeSelectValues}
										{...field}
										error={formState.errors.secondPlacementRoom?.message}
										value={field.value || ''}
										placeholder="Выберите второе помещение"
										isSearchable
										buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
										wrapperClassname="shadow-none ring-input-border-primary"
									/>
								)}
							/>
						</div>
					</div>
					<Input
						{...register('area')}
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px] text-left',
							formState.errors.area?.message ? 'text-error' : '',
						)}
						wrapperClassName="shadow-none ring-input-border-primary flex-row gap-[20px]"
						inputClassName="w-[226px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						error={formState.errors.area?.message}
						containerClassName="w-[226px]"
						label={formState.errors?.area?.message || 'Площадь, м2'}
						placeholder="Введите площадь"
						maxLength={50}
					/>
					<Input
						{...register('width')}
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px] text-left',
							formState.errors.width?.message ? 'text-error' : '',
						)}
						wrapperClassName="shadow-none ring-input-border-primary flex-row gap-[20px]"
						inputClassName="w-[226px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						error={formState.errors.width?.message}
						containerClassName="w-[226px]"
						label={formState.errors?.width?.message || 'Ширина (высота), м'}
						placeholder="Введите ширину"
						maxLength={50}
					/>
					<Input
						{...register('length')}
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px] text-left',
							formState.errors.length?.message ? 'text-error' : '',
						)}
						wrapperClassName="shadow-none ring-input-border-primary flex-row gap-[20px]"
						inputClassName="w-[226px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						error={formState.errors.length?.message}
						containerClassName="w-[226px]"
						label={formState.errors?.length?.message || 'Длина, м'}
						placeholder="Введите длину"
						maxLength={50}
					/>
				</div>
			</FormProvider>
		</div>
	);
}, 'CreateConstructionForm');
