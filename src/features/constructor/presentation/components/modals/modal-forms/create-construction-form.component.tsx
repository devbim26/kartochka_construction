import {
	convertToPaginatedType,
	convertToSelectValues,
	Input,
	Select,
	useAppDispatch,
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
import type { AxiosResponse } from 'axios';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
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
		const [length, width] = watch(['length', 'width']);
		const [roomOptions, setRoomOptions] = useState<Array<{ label: string; value: string }>>([]);
		const [search] = useSearchParams();
		const reportId = search.get('reportId');

		useImperativeHandle(ref, () => ({
			submit: () => {
				handleSubmit((data) => {
					dispatch(constructorSlice.actions.setCreateConstructionData(data));
					onSuccess?.();
				})();
			},
		}));

		useEffect(() => {
			if (length && width) {
				setValue('area', (parseInt(length) * parseInt(width)).toString());
			} else {
				setValue('area', '');
			}
		}, [length, width, setValue]);

		const handleGetConstructionData = () => {
			from(
				getGuidebooksPaginated({
					data: {},
					guidebookType: Guidebooks.CONSTRUCTION,
					pagination: { pageNumber: 1, pageSize: 99999 },
				}),
			)
				.pipe(
					switchMap((response: AxiosResponse) => {
						const resData = convertToPaginatedType(convertToClientConstructionsAddData)(
							response.data,
						);
						return from([resData]);
					}),
					tap((resData) => {
						setConstructionData(resData.items);
					}),
					catchError((error) => {
						console.log('error:', error);
						return from([null]);
					}),
				)
				.subscribe();
		};

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
								<Controller
									control={control}
									name="firstPlacementRoom"
									render={({ field }) => (
										<Select
											options={roomOptions}
											{...field}
											value={field.value || ''}
											placeholder="Выберите помещение"
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
											options={roomOptions}
											{...field}
											value={field.value || ''}
											placeholder="Выберите помещение"
											buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
											wrapperClassname="shadow-none ring-input-border-primary"
										/>
									)}
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
