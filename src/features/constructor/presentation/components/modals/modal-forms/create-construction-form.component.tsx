import {
	convertToPaginatedType,
	convertToSelectValues,
	Input,
	Select,
	useAppDispatch,
	useAppSelector,
	useI18n,
} from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { memoize } from '@core/utils/hoc/memo.utils';
import {
	convertToClientSingleReportInfoShort,
	convertToUpdateReportCommand,
} from '@features/constructor/converters';
import {
	getConstructionRooms,
	getReportFloorById,
	getReportSingleById,
	svgConstructionDetail,
	updateReportFloor,
	updateReportSingle,
} from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import type { CreateConstructionData } from '@features/constructor/types';
import { ReportCategory } from '@features/constructor/types';

import { formatMaterial } from '@features'; // предполагаемый хелпер
import type { ReportInfoShort } from '@features/constructor/utils';
import { CreateConstructionConfig } from '@features/constructor/utils';
import {
	convertToClientConstructionsAddData,
	convertToClientConstructionsEditData,
	convertToClientIssuerData,
} from '@features/guidbooks/converters';
import { getGuidebooksDetail, getGuidebooksPaginated } from '@features/guidbooks/services';
import type {
	BuildingType,
	CategoryClass,
	ConstructionClass,
	ConstructionsAddData,
	ConstructionsEditData,
	Issuer,
} from '@features/guidbooks/types';
import {
	EnConstructionTypeSelectValues,
	Guidebooks,
	RuConstructionTypeSelectValues,
} from '@features/guidbooks/types';

import type { IssuerDto } from '@api-gen';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError, type AxiosResponse } from 'axios';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, finalize, from, of, switchMap, tap } from 'rxjs';
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

interface RoomRequirementMap {
	[firstRoomId: string]: Array<{
		secondRoomId: string;
		secondRoomName: string;
		requirementId: string;
	}>;
}

export const CreateConstructionForm = memoize(
	forwardRef<CreateConstructionFormHandle, CreateConstructionFormProps>(
		({ onSuccess, x, y, page, floorId }, ref) => {
			const { t, locale } = useI18n();
			const form = useForm<CreateConstructionData>({
				defaultValues: CreateConstructionConfig.defaultValues,
				resolver: zodResolver(CreateConstructionConfig.schema),
			});
			const { register, formState, control, setValue, watch, handleSubmit, getValues } = form;
			const [constructionData, setConstructionData] = useState<Array<ConstructionsAddData>>(
				[],
			);
			const [reportInfoData, setReportInfoData] = useState<ReportInfoShort>();
			const [constructionDetail, setConstructionDetail] =
				useState<ConstructionsEditData | null>(null);
			const [svgUrl, setSvgUrl] = useState<string | null>(null);
			const [issuer, setIssuer] = useState<Issuer | null>(null);
			const [issuerIsLoading, setIssuerIsLoading] = useState(false);

			const [roomRequirementsMap, setRoomRequirementsMap] = useState<RoomRequirementMap>({});
			const [secondRoomOptions, setSecondRoomOptions] = useState<
				Array<{ label: string; value: string }>
			>([]);

			const [
				length,
				width,
				construction,
				area,
				name,
				id,
				constructionType,
				firstPlacementRoom,
			] = watch([
				'length',
				'width',
				'construction',
				'area',
				'name',
				'id',
				'constructionType',
				'firstPlacementRoom',
			]);

			const [roomOptions, setRoomOptions] = useState<Array<{ label: string; value: string }>>(
				[],
			);
			const [search] = useSearchParams();
			const editMode = search.get('editMode');
			const reportId = search.get('reportId');
			const reportType = search.get('reportType');
			const layerId = search.get('layerId');

			const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
			const dispatch = useAppDispatch();

			// Выбор массива типов конструкций в зависимости от языка
			const constructionTypeOptions =
				locale === 'ru' ? RuConstructionTypeSelectValues : EnConstructionTypeSelectValues;

			const processRoomRequirements = (roomRequirementsData: any[]) => {
				const map: RoomRequirementMap = {};

				roomRequirementsData.forEach((item) => {
					const firstRoomId = item.firstPlacementRoom.id;

					item.secondRequirementRooms.forEach((requirement: any) => {
						const secondRoomId = requirement.secondPlacementRoom.id;
						const secondRoomName = requirement.secondPlacementRoom.name;
						const requirementId = requirement.requirementId;

						if (!map[firstRoomId]) {
							map[firstRoomId] = [];
						}

						map[firstRoomId].push({
							secondRoomId,
							secondRoomName,
							requirementId,
						});
					});
				});

				setRoomRequirementsMap(map);
			};

			useEffect(() => {
				if (firstPlacementRoom && roomRequirementsMap[firstPlacementRoom]) {
					const availableRooms = roomRequirementsMap[firstPlacementRoom];
					const options = availableRooms.map((room) => ({
						label: room.secondRoomName,
						value: room.secondRoomId,
					}));
					setSecondRoomOptions(options);

					if (!editMode) {
						setValue('secondPlacementRoom', '');
						setValue('requirementId', '');
					}
				} else {
					if (!editMode) {
						setSecondRoomOptions([]);
						setValue('secondPlacementRoom', '');
						setValue('requirementId', '');
					}
				}
			}, [firstPlacementRoom, roomRequirementsMap, setValue]);

			useEffect(() => {
				const secondRoomId = watch('secondPlacementRoom');
				if (firstPlacementRoom && secondRoomId && roomRequirementsMap[firstPlacementRoom]) {
					const requirement = roomRequirementsMap[firstPlacementRoom].find(
						(room) => room.secondRoomId === secondRoomId,
					);

					if (requirement) {
						setValue('requirementId', requirement.requirementId);
					}
				}
			}, [watch('secondPlacementRoom'), firstPlacementRoom, roomRequirementsMap, setValue]);

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

			const handleGetReport = (id: string) => {
				from(
					search.get('reportType') == ReportCategory.Floor
						? getReportFloorById({ id: id })
						: getReportSingleById({ id: id }),
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
							const data = convertToClientSingleReportInfoShort(response.data);
							if (data) setReportInfoData(data);
						}
					});
			};

			useEffect(() => {
				if (reportId) handleGetReport(reportId);
			}, [reportId]);

			useEffect(() => {
				if (!!reportInfoData && constructionType) {
					from(
						getConstructionRooms({
							class: reportInfoData.comfortClass as CategoryClass,
							regulatoryDocumentId: reportInfoData.regulatoryDocument?.id,
							buildingType: reportInfoData.buildingType as BuildingType,
							constructionClass: constructionType as ConstructionClass,
						}),
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
								const roomsData = response.data as any;

								if (Array.isArray(roomsData)) {
									processRoomRequirements(roomsData);
								}

								const uniqueRooms = Array.from(
									new Map(
										roomsData.map((item: any) => [
											item.firstPlacementRoom.id,
											item.firstPlacementRoom,
										]),
									).values(),
								);

								const variants = convertToSelectValues(uniqueRooms as any) || [];
								setRoomOptions(variants);
							}
						});
				}
			}, [constructionType, reportInfoData]);

			const handleAddConstruction = (data: CreateConstructionData) => {
				if (!reportId) {
					toast.error(t('createConstruction.error.reportId'));
					return;
				}

				dispatch(startLoading());

				const command = convertToUpdateReportCommand(reportId, data);
				from(
					reportType === ReportCategory.Floor
						? updateReportFloor({
								data: {
									reportFloorInfoId: id || '',
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
									requirementId: getValues('requirementId'),
								},
							})
						: updateReportSingle({ data: command }),
				)
					.pipe(
						catchError((error) => {
							if (error instanceof AxiosError) {
								toast.error(
									error.response?.data ||
										t('createConstruction.error.addConstruction'),
								);
							} else {
								toast.error(t('createConstruction.error.unknown'));
							}
							dispatch(stopLoading());
							return from([null]);
						}),
					)
					.subscribe((response) => {
						if (response?.status === 200) {
							toast.success(t('createConstruction.success.added'));
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
						data: { constructionIdToUpdate: construction || undefined },
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

			// Получение детальной информации о выбранной конструкции
			const handleGetConstructionDetail = (id: string) => {
				dispatch(startLoading());
				from(getGuidebooksDetail({ id, guidebookType: Guidebooks.CONSTRUCTION }))
					.pipe(
						tap((response) => {
							if (response.status === 200) {
								const data = convertToClientConstructionsEditData(response.data);
								setConstructionDetail(data);
							}
						}),
						catchError((error) => {
							console.error('Ошибка загрузки деталей конструкции:', error);
							toast.error(t('errors.constructionLoad'));
							return of(null);
						}),
						finalize(() => dispatch(stopLoading())),
					)
					.subscribe();
			};

			const handleGetConstructionImage = (id: string) => {
				dispatch(startLoading());
				from(svgConstructionDetail(id))
					.pipe(
						tap((response) => {
							if (response.status === 200 && typeof response.data === 'string') {
								setSvgUrl(response.data);
							} else {
								toast.error(t('errors.imageLoad'));
							}
						}),
						catchError(() => {
							toast.error(t('errors.imageLoad'));
							return of(null);
						}),
						finalize(() => dispatch(stopLoading())),
					)
					.subscribe();
			};

			useEffect(() => {
				if (construction) {
					handleGetConstructionDetail(construction);
					handleGetConstructionImage(construction);
				} else {
					setConstructionDetail(null);
					setSvgUrl(null);
				}
			}, [construction]);

			useEffect(() => {
				const issuerId = constructionDetail?.issuer;
				if (!issuerId) {
					setIssuer(null);
					return;
				}

				setIssuer(null);
				setIssuerIsLoading(true);

				const subscription = from(
					getGuidebooksDetail({ id: issuerId, guidebookType: Guidebooks.ISSUER }),
				)
					.pipe(
						tap((response) => {
							if (response?.status === 200 && response.data) {
								setIssuer(convertToClientIssuerData(response.data as IssuerDto));
							}
						}),
						catchError((error) => {
							console.error('Ошибка загрузки производителя:', error);
							return of(null);
						}),
						finalize(() => setIssuerIsLoading(false)),
					)
					.subscribe();

				return () => subscription.unsubscribe();
			}, [constructionDetail?.issuer]);

			const normalizeWebsite = (value?: string) => {
				const trimmed = value?.trim();
				if (!trimmed) return null;
				return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
			};

			useEffect(() => {
				handleGetConstructionData();
			}, [construction]);

			return (
				<div className="relative flex w-full flex-col border-b">
					{isLoading && (
						<div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-[10px] bg-white/60">
							<p className="text-[18px] text-primary">
								{t('createConstruction.loadingMessage')}
							</p>
							<Loader />
						</div>
					)}

					{/* Форма */}
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
								error={
									formState.errors.name?.message
										? t(formState.errors.name.message as any)
										: undefined
								}
								containerClassName="w-[226px]"
								label={
									formState.errors?.name?.message
										? t(formState.errors.name.message as any)
										: t('createConstruction.name.label')
								}
								placeholder={t('createConstruction.name.placeholder')}
								maxLength={50}
							/>
							<Controller
								control={control}
								name={'constructionType'}
								render={({ field }) => (
									<Select
										options={constructionTypeOptions}
										{...field}
										value={field.value || ''}
										label={
											formState.errors?.constructionType?.message
												? t(
														formState.errors.constructionType
															.message as any,
													)
												: t('createConstruction.constructionType.label')
										}
										isSearchable
										error={
											formState.errors.constructionType?.message
												? t(
														formState.errors.constructionType
															.message as any,
													)
												: undefined
										}
										labelClassName={twMerge(
											'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-[145px] text-left',
											formState.errors.constructionType?.message
												? 'text-error'
												: '',
										)}
										placeholder={t(
											'createConstruction.constructionType.placeholder',
										)}
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
											formState.errors?.construction?.message
												? t(formState.errors.construction.message as any)
												: t('createConstruction.construction.label')
										}
										isSearchable
										error={
											formState.errors.construction?.message
												? t(formState.errors.construction.message as any)
												: undefined
										}
										labelClassName={twMerge(
											'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-[145px] text-left',
											formState.errors.construction?.message
												? 'text-error'
												: '',
										)}
										placeholder={t(
											'createConstruction.construction.placeholder',
										)}
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
											? t('validation.required')
											: t('createConstruction.rooms.label')}
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
												placeholder={t(
													'createConstruction.firstRoom.placeholder',
												)}
												buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
												wrapperClassname="shadow-none ring-input-border-primary"
												onChange={(value) => {
													field.onChange(value);
													setValue('secondPlacementRoom', '');
													setValue('requirementId', '');
												}}
											/>
										)}
									/>
									<Controller
										control={control}
										name="secondPlacementRoom"
										render={({ field }) => (
											<Select
												options={secondRoomOptions}
												{...field}
												value={field.value || ''}
												placeholder={t(
													'createConstruction.secondRoom.placeholder',
												)}
												buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
												wrapperClassname="shadow-none ring-input-border-primary"
												isDisabled={!firstPlacementRoom}
											/>
										)}
									/>
								</div>
							</div>
							<input type="hidden" {...register('requirementId')} />
							<Input
								{...register('width')}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px] text-left',
									formState.errors.width?.message ? 'text-error' : '',
								)}
								wrapperClassName="shadow-none ring-input-border-primary flex-row gap-[20px]"
								inputClassName="w-[226px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
								error={
									formState.errors.width?.message
										? t(formState.errors.width.message as any)
										: undefined
								}
								containerClassName="w-[226px]"
								label={
									formState.errors?.width?.message
										? t(formState.errors.width.message as any)
										: t('createConstruction.width.label')
								}
								placeholder={t('createConstruction.width.placeholder')}
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
								error={
									formState.errors.length?.message
										? t(formState.errors.length.message as any)
										: undefined
								}
								containerClassName="w-[226px]"
								label={
									formState.errors?.length?.message
										? t(formState.errors.length.message as any)
										: t('createConstruction.length.label')
								}
								placeholder={t('createConstruction.length.placeholder')}
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
								error={
									formState.errors.area?.message
										? t(formState.errors.area.message as any)
										: undefined
								}
								containerClassName="w-[226px]"
								label={
									formState.errors?.area?.message
										? t(formState.errors.area.message as any)
										: t('createConstruction.area.label')
								}
								placeholder={t('createConstruction.area.placeholder')}
								maxLength={50}
								readOnly
							/>
						</div>
					</FormProvider>

					{/* Блок выбранной конструкции (под формой) */}
					{construction && (
						<div className="mt-6 flex flex-col gap-3">
							<p className="text-lg font-semibold text-gray-800">
								{t('createConstruction.selectedConstruction') ||
									'Выбранная конструкция'}
							</p>
							<div className="grid grid-cols-3 gap-4">
								{/* Изображение */}
								<div>
									{svgUrl ? (
										<img
											className="h-auto max-h-[200px] w-full object-contain"
											src={svgUrl}
											alt={'constr'}
										/>
									) : (
										<div className="flex h-[200px] w-full items-center justify-center">
											<Loader />
										</div>
									)}
								</div>
								{/* Список материалов */}
								<div>
									{constructionDetail?.constructionTypeObject?.leftConstruction
										?.slice()
										.sort((a, b) => Number(a.positionId) - Number(b.positionId))
										.map((material, i) => (
											<p key={`left-${i}`} className="pl-4 text-[15px]">
												- {formatMaterial(material, locale)}
											</p>
										))}
									{constructionDetail?.constructionTypeObject?.centerConstruction
										?.slice()
										.sort((a, b) => Number(a.positionId) - Number(b.positionId))
										.map((material, i) => (
											<p key={`center-${i}`} className="pl-4 text-[15px]">
												- {formatMaterial(material, locale)}
											</p>
										))}
									{constructionDetail?.constructionTypeObject?.rightConstruction
										?.slice()
										.sort((a, b) => Number(a.positionId) - Number(b.positionId))
										.map((material, i) => (
											<p key={`right-${i}`} className="pl-4 text-[15px]">
												- {formatMaterial(material, locale)}
											</p>
										))}
								</div>
								{/* Производитель */}
								<div className="flex flex-col gap-2">
									<p className="text-sm font-semibold text-gray-800">
										{locale === 'ru' ? 'Производитель' : 'Manufacturer'}
									</p>
									{issuerIsLoading ? (
										<div className="flex h-[66px] items-center">
											<Loader />
										</div>
									) : (
										<>
											{issuer?.logoUrl && (
												<img
													src={issuer.logoUrl}
													alt={issuer.name || 'issuer logo'}
													className="h-[66px] w-full max-w-[160px] rounded-md object-contain"
												/>
											)}
											<p className="text-left text-[14px] text-gray-800">
												{issuer?.name ||
													constructionDetail?.issuerName ||
													(locale === 'ru'
														? 'Не указан'
														: 'Not specified')}
											</p>
											{normalizeWebsite(issuer?.webSite) && (
												<a
													href={normalizeWebsite(issuer?.webSite)!}
													target="_blank"
													rel="noreferrer noopener"
													className="break-all text-left text-[14px] text-primary underline"
												>
													{issuer?.webSite}
												</a>
											)}
										</>
									)}
								</div>
							</div>
						</div>
					)}

					<div className="flex border-b py-[10px]"></div>
				</div>
			);
		},
	),
	'CreateConstructionForm',
);
