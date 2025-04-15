import {
	convertToPaginatedType,
	convertToSelectValues,
	Input,
	Select,
	useAppDispatch,
	useAppSelector,
} from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { constructorSlice } from '@features/constructor/store';
import type { CreateConstructionData } from '@features/constructor/types';
import { CreateConstructionConfig } from '@features/constructor/utils';
import type { ConstructionsAddData } from '@features/guidbooks';
import {
	convertToClientConstructionsAddData,
	getGuidebooksPaginated,
	Guidebooks,
	RuConstructionTypeSelectValues,
} from '@features/guidbooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export interface CreateConstructionFormHandle {
	submit: () => void;
}

interface CreateConstructionFormProps {
	onSuccess?: () => void;
}

export const CreateConstructionForm = memoize(
	forwardRef<CreateConstructionFormHandle, CreateConstructionFormProps>(({ onSuccess }, ref) => {
		const form = useForm<CreateConstructionData>({
			defaultValues: CreateConstructionConfig.defaultValues,
			resolver: zodResolver(CreateConstructionConfig.schema),
		});

		const { register, formState, control, setValue, watch, handleSubmit } = form;
		const dispatch = useAppDispatch();
		const [constructionData, setConstructionData] = useState<Array<ConstructionsAddData>>([]);
		const firstPlacementRoomValue = watch('firstPlacementRoom');
		const secondPlacementRoomValue = watch('secondPlacementRoom');
		const selectedRequirement = useAppSelector(
			(store) => store.constructorData.selectedRequirement,
		);

		const length = watch('length');
		const width = watch('width');

		useImperativeHandle(ref, () => ({
			submit: () => {
				handleSubmit((data) => {
					console.log(data);
					dispatch(constructorSlice.actions.setCreateConstructionData(data));
					onSuccess?.();
				})();
			},
		}));

		useEffect(() => {
			const area = parseInt(length) * parseInt(width);
			setValue('area', area.toString());
		}, [length, width, setValue]);

		useEffect(() => {
			console.log(selectedRequirement);
			if (selectedRequirement) {
				setValue('firstPlacementRoom', selectedRequirement.firstPlacementRoom);
				setValue('secondPlacementRoom', selectedRequirement.secondPlacementRoom);
			}
		}, [selectedRequirement, setValue]);

		const handleGetConstructionData = useCallback(async () => {
			try {
				const response = await getGuidebooksPaginated({
					data: {},
					guidebookType: Guidebooks.CONSTRUCTION,
					pagination: { pageNumber: 1, pageSize: 99999 },
				});
				console.log(response.data);
				const resData = convertToPaginatedType(convertToClientConstructionsAddData)(
					response.data as any,
				);
				console.log(resData.items);
				setConstructionData(resData.items);
			} catch (error) {
				console.log('error:', error);
			}
		}, []);

		useEffect(() => {
			handleGetConstructionData();
		}, []);

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
						<Controller
							control={control}
							name={'construction'}
							render={({ field }) => (
								<Select
									options={convertToSelectValues(constructionData) ?? []}
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
										: 'Конструкция разделяет'}
								</label>
							</div>
							<div className="flex gap-x-[12px]">
								<Input
									{...register('firstPlacementRoom')}
									value={firstPlacementRoomValue || ''}
									wrapperClassName="shadow-none ring-input-border-primary flex-row gap-[20px]"
									inputClassName="w-[226px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
									error={formState.errors.firstPlacementRoom?.message}
									containerClassName="w-[226px]"
									placeholder="помещение"
									maxLength={50}
								/>
								<Input
									{...register('secondPlacementRoom')}
									value={secondPlacementRoomValue || ''}
									wrapperClassName="shadow-none ring-input-border-primary flex-row gap-[20px]"
									inputClassName="w-[226px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
									error={formState.errors.secondPlacementRoom?.message}
									containerClassName="w-[226px]"
									placeholder="помещение"
									maxLength={50}
								/>
							</div>
						</div>
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
							readOnly
						/>
					</div>
					<div className="flex border-b py-[10px]"></div>
				</FormProvider>
			</div>
		);
	}),
	'CreateConstructionForm',
);
