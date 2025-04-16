import { Input, Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import type { AddConstructionData } from '@features/constructor/types';
import { AddConstructionConfig } from '@features/constructor/utils';
import {
	RuConstructionTypeSelectValues,
	RuConstructionTypesSelectValues,
} from '@features/guidbooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export interface AddConstructionFormHandle {
	submit: () => void;
}

interface AddConstructionFormProps {
	onSuccess?: () => void;
}

export const AddConstructionForm = memoize(
	forwardRef<AddConstructionFormHandle, AddConstructionFormProps>(({ onSuccess }, ref) => {
		const form = useForm<AddConstructionData>({
			defaultValues: AddConstructionConfig.defaultValues,
			resolver: zodResolver(AddConstructionConfig.schema),
		});
		const { register, formState, control, handleSubmit } = form;

		useImperativeHandle(ref, () => ({
			submit: () => {
				handleSubmit((data) => {
					onSuccess?.();
				})();
			},
		}));

		return (
			<div className="flex flex-col border-b">
				<FormProvider {...form}>
					<div className="flex flex-col gap-[20px]">
						<Input
							{...register('cipher')}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px] text-left',
								formState.errors.cipher?.message ? 'text-error' : '',
							)}
							wrapperClassName="shadow-none ring-input-border-primary flex-row gap-[20px]"
							inputClassName="w-[226px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
							error={formState.errors.cipher?.message}
							containerClassName="w-[226px]"
							label={formState.errors?.cipher?.message || 'Шифр'}
							placeholder="Введите шифр"
							maxLength={50}
						/>
						<Controller
							control={control}
							name={'constructionType'}
							render={({ field }) => (
								<Select
									options={RuConstructionTypesSelectValues}
									{...field}
									value={field.value || ''}
									label={
										formState.errors?.constructionType?.message ||
										'Тип конструкции'
									}
									isSearchable
									error={formState.errors.constructionType?.message}
									labelClassName={twMerge(
										'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-[145px] text-left',
										formState.errors.constructionType?.message
											? 'text-error'
											: '',
									)}
									placeholder="Выберите тип конструкции"
									buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
									wrapperClassname="shadow-none ring-input-border-primary flex-row gap-[20px]"
								/>
							)}
						/>
						<div className="flex items-center gap-x-[20px]">
							<div className="flex w-[145px] text-left">
								<label
									className={twMerge(
										'font-sans text-sm font-normal leading-5 text-input-label-primary',
										(formState.errors.firstPlacementRoom ||
											formState.errors.secondPlacementRoom) &&
											'text-error',
									)}
								>
									{formState.errors.firstPlacementRoom ||
									formState.errors.secondPlacementRoom
										? 'Поле обязательно для заполнения'
										: 'Конструкция разделяет'}
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
						<div className="flex border-b py-[2px]"></div>
					</div>
				</FormProvider>
			</div>
		);
	}),
	'AddConstructionForm',
);
