import {
	convertToPaginatedType,
	convertToSelectValues,
	Input,
	Select,
	useAppDispatch,
	useAppSelector,
} from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { memoize } from '@core/utils/hoc/memo.utils';
import { convertToUpdateReportCommand } from '@features/constructor/converters';
import {
	getReportFloorById,
	getReportSingleById,
	updateReportFloor,
	updateReportSingle,
} from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import type { CreateConstructionData } from '@features/constructor/types';
import { ReportCategory } from '@features/constructor/types';

import { CreateConstructionConfig } from '@features/constructor/utils';
import { convertToClientConstructionsAddData } from '@features/guidbooks/converters';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
import {
	Guidebooks,
	RuConstructionTypeSelectValues,
	type ConstructionsAddData,
} from '@features/guidbooks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError, type AxiosResponse } from 'axios';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export interface CreateConstructionFormHandle {
	submit: () => void;
	reset: (data?: Partial<CreateConstructionData>) => void;
}

interface CreateConstructionFormProps {
	onSuccess?: () => void;
	x?: number;
	y?: number;
	page?: number;
	floorId?: string;
}

export const CreateConstructionForm = memoize(
	forwardRef<CreateConstructionFormHandle, CreateConstructionFormProps>(
		({ onSuccess, x, y, page, floorId }, ref) => {
			const form = useForm<CreateConstructionData>({
				defaultValues: CreateConstructionConfig.defaultValues,
				resolver: zodResolver(CreateConstructionConfig.schema),
			});
			const { register, formState, control, setValue, watch, handleSubmit, getValues } = form;
			const [constructionData, setConstructionData] = useState<Array<ConstructionsAddData>>(
				[],
			);
			const [length, width, construction, area, name] = watch([
				'length',
				'width',
				'construction',
				'area',
				'name',
			]);
			const [roomOptions, setRoomOptions] = useState<Array<{ label: string; value: string }>>(
				[],
			);
			const [search] = useSearchParams();
			const reportId = search.get('reportId');
			const reportType = search.get('reportType');
			const layerId = search.get('layerId');

			const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);

			const dispatch = useAppDispatch();

			useImperativeHandle(ref, () => ({
				submit: () => {
					handleSubmit((data) => {
						handleAddConstruction(data);
					})();
				},
				reset: (data) => {
					const currentType = form.getValues('constructionType');
					form.reset({ constructionType: currentType, ...data });
				},
			}));

			useEffect(() => {
				if (!search.get('reportId')) return;

				dispatch(startLoading());

				from(
					reportType === ReportCategory.Floor
						? getReportFloorById({ id: search.get('reportId')! })
						: getReportSingleById({ id: search.get('reportId')! }),
				)
					.pipe(
						catchError((error) => {
							console.error(error);
							return from([null]);
						}),
					)
					.subscribe((response) => {
						const requirement = response?.data?.calculationRequirements?.[0];
						if (requirement) {
							const firstRoom = requirement.firstPlacementRoom;
							const secondRoom = requirement.secondPlacementRoom;
							setValue('constructionType', requirement.constructionClass as string);
							setValue('firstPlacementRoom', firstRoom?.id ?? '');
							setValue('secondPlacementRoom', secondRoom?.id ?? '');
							setRoomOptions([
								{ label: firstRoom?.name ?? '', value: firstRoom?.id ?? '' },
								{ label: secondRoom?.name ?? '', value: secondRoom?.id ?? '' },
							]);
						}
					});
				dispatch(stopLoading());
			}, [reportId, reportType]);

			const handleAddConstruction = (data: CreateConstructionData) => {
				if (!reportId) {
					toast.error('Не удалось найти ID отчёта');
					return;
				}

				dispatch(startLoading());

				const command = convertToUpdateReportCommand(reportId, data);

				from(
					reportType === ReportCategory.Floor
						? updateReportFloor({
								data: {
									floorConstructionInfoId: floorId ? floorId : layerId || '',
									'floorInfo.coordinates.x': x
										? +String(x).split('.')[0]
										: +search.get('x')!.split('.')[0]!,
									'floorInfo.coordinates.y': y
										? +String(y).split('.')[0]
										: +search.get('y')!.split('.')[0]!,
									'floorInfo.page': page ? +page : +search.get('page')!,
									'floorInfo.reportConstructionHeader.constructionHeaderId':
										construction,
									'floorInfo.reportConstructionHeader.square': +area,
									'floorInfo.reportConstructionHeader.width': +width,
									'floorInfo.reportConstructionHeader.length': +length,
									'floorInfo.reportConstructionHeader.firstPlacementRoomId':
										getValues('firstPlacementRoom'),
									'floorInfo.reportConstructionHeader.secondPlacementRoomId':
										getValues('secondPlacementRoom'),
									'floorInfo.floorNumber': '1',
									'floorInfo.reportConstructionHeader.name': name,
									reportInfoId: reportId,
								},
							})
						: updateReportSingle({ data: command }),
				)
					.pipe(
						catchError((error) => {
							if (error instanceof AxiosError) {
								toast.error(
									error.response?.data || 'Ошибка при добавлении конструкции',
								);
							} else {
								toast.error('Неизвестная ошибка');
							}
							dispatch(stopLoading());
							return from([null]);
						}),
					)
					.subscribe((response) => {
						if (response?.status === 200) {
							toast.success('Конструкция успешно добавлена в отчёт');
							onSuccess?.();
						}
						dispatch(stopLoading());
					});
			};

			useEffect(() => {
				if (length && width) {
					setValue('area', (parseInt(length) * parseInt(width)).toString());
				} else {
					setValue('area', '');
				}
			}, [length, width, setValue]);

			const handleGetConstructionData = () => {
				dispatch(startLoading());
				from(
					getGuidebooksPaginated({
						data: {},
						guidebookType: Guidebooks.CONSTRUCTION,
						pagination: { pageNumber: 1, pageSize: 99999 },
					}),
				)
					.pipe(
						switchMap((response: AxiosResponse) => {
							const resData = convertToPaginatedType(
								convertToClientConstructionsAddData,
							)(response.data);
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
					.subscribe(() => dispatch(stopLoading()));
			};

			useEffect(() => {
				handleGetConstructionData();
			}, []);

			return (
				<div className="relative flex flex-col border-b">
					{isLoading && (
						<div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-[10px] bg-white/60">
							<p className="text-[18px] text-primary">
								Проводится расчет значений конструкции
							</p>
							<Loader />
						</div>
					)}
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
										disabled
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
										options={
											convertToSelectValues(
												constructionData.map((construction) => ({
													...construction,
													name: `${construction.description}(${construction.name})`,
												})),
											) ?? []
										}
										{...field}
										value={field.value || ''}
										label={
											formState.errors?.construction?.message || 'Конструкция'
										}
										isSearchable
										error={formState.errors.construction?.message}
										labelClassName={twMerge(
											'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-[145px] text-left',
											formState.errors.construction?.message
												? 'text-error'
												: '',
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
												disabled
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
												disabled
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
		},
	),
	'CreateConstructionForm',
);
