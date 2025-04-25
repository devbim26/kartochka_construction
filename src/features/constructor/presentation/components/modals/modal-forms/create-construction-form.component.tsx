import type { ReportInfoFloorConstructionDto } from '@api-gen';
import {
	convertBase64ToFile,
	convertToPaginatedType,
	convertToSelectValues,
	Input,
	Select,
	useAppDispatch,
	useAppSelector,
} from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { convertToUpdateReportCommand } from '@features/constructor/converters';
import {
	getReportFloorById,
	getReportSingleById,
	updateReportFloor,
	updateReportSingle,
} from '@features/constructor/services';
import { constructorSlice } from '@features/constructor/store';
import type { CreateConstructionData } from '@features/constructor/types';
import { ReportCategory } from '@features/constructor/types';
import type { ConstructionSheet } from '@features/constructor/types/constructions-sheet.types';

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
		const { register, formState, control, setValue, watch, handleSubmit, getValues } = form;
		const [constructionData, setConstructionData] = useState<Array<ConstructionsAddData>>([]);
		const [layerId, setLayerId] = useState<string>();
		const [length, width, construction, area] = watch([
			'length',
			'width',
			'construction',
			'area',
		]);
		const [roomOptions, setRoomOptions] = useState<Array<{ label: string; value: string }>>([]);
		const [search] = useSearchParams();
		const reportId = search.get('reportId');
		const reportType = search.get('reportType');

		const dispatch = useAppDispatch();

		const image = useAppSelector((store) => store.constructorData).file;

		useImperativeHandle(ref, () => ({
			submit: () => {
				handleSubmit((data) => {
					handleAddConstruction(data);
					onSuccess?.();
				})();
			},
		}));

		useEffect(() => {
			if (!search.get('reportId')) return;
			from(
				reportType == ReportCategory.Floor
					? getReportFloorById({ id: search.get('reportId')! })
					: getReportSingleById({ id: search.get('reportId')! }),
			)
				.pipe(
					catchError((error) => {
						return from([null]);
					}),
				)
				.subscribe((response) => {
					const requirement = response?.data?.requirements?.[0];
					if (!requirement) return;
					const firstRoom = requirement.firstPlacementRoom;
					const secondRoom = requirement.secondPlacementRoom;
					if (
						reportType == ReportCategory.Floor &&
						!!(response as AxiosResponse<ReportInfoFloorConstructionDto>).data
							.floorConstructionInfos?.length
					) {
						setLayerId(
							(response as AxiosResponse<ReportInfoFloorConstructionDto>)?.data
								?.floorConstructionInfos?.[0]?.id,
						);
					}
					setValue('firstPlacementRoom', firstRoom!.id!);
					setValue('secondPlacementRoom', secondRoom!.id!);
					setRoomOptions([
						{ label: firstRoom!.name!, value: firstRoom!.id! },
						{ label: secondRoom!.name!, value: secondRoom!.id! },
					]);
				});
		}, [reportId, reportType, setValue]);

		const handleAddConstruction = (data: CreateConstructionData) => {
			if (reportId) {
				const command = convertToUpdateReportCommand(reportId, data);
				from(
					reportType == ReportCategory.Floor
						? updateReportFloor({
								data: {
									reportFloorInfoId: layerId,
									'reportFloorInfo.coordinates.x': +search
										.get('x')!
										.split('.')[0]!,
									'reportFloorInfo.coordinates.y': +search
										.get('y')!
										.split('.')[0]!,
									'reportFloorInfo.page': +search.get('page')!,
									'reportFloorInfo.documentImage': convertBase64ToFile(
										image!.image!,
										'File',
										'image/png',
									),
									'reportFloorInfo.floorDocument': convertBase64ToFile(
										image!.image!,
										'File',
										'image/png',
									),
									'reportFloorInfo.reportConstructionHeader.constructionHeaderId':
										construction,
									'reportFloorInfo.reportConstructionHeader.square': +area,
									'reportFloorInfo.reportConstructionHeader.firstPlacementRoomId':
										getValues('firstPlacementRoom'),
									'reportFloorInfo.reportConstructionHeader.secondPlacementRoomId':
										getValues('secondPlacementRoom'),
									'reportFloorInfo.floorNumber': '1',
									reportInfoId: search.get('reportId')!,
								},
							})
						: updateReportSingle({ data: command }),
				)
					.pipe(
						catchError((error) => {
							if (error instanceof AxiosError) {
								toast.error(error.response?.data);
							}
							return from([null]);
						}),
					)
					.subscribe((response) => {
						if (response?.status === 200) {
							toast.success('Конструкция успешно добавлена в отчёт');
							if (reportType == ReportCategory.Floor)
								from(getReportFloorById({ id: reportId! })).subscribe(
									(response) => {
										dispatch(
											constructorSlice.actions.setInfo(
												response.data.floorConstructionInfos?.[0]
													.reportFloorInfos?.[0] || {},
											),
										);
										dispatch(
											constructorSlice.actions.setConstructionsSheet(
												response.data.floorConstructionInfos?.[0]?.reportFloorInfos?.map(
													(info) => ({
														title:
															info.reportConstructionHeader
																?.constructionHeader?.name ||
															'Нет названия',
														floorPlanImage: info.documentImageUrl || '',
														constructionInfoImage:
															info.documentImageUrl || '',
														square:
															info.reportConstructionHeader?.square ||
															'0',
													}),
												) as ConstructionSheet[],
											),
										);
									},
								);
						}
					});
			} else {
				toast.error('Не удалось найти ID отчёта');
			}
		};

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
	}),
	'CreateConstructionForm',
);
