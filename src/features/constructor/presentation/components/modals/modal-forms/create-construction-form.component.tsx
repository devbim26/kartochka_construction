import {
	convertToPaginatedType,
	convertToSelectValues,
	ImagePreviewModal,
	Input,
	Select,
	useAppDispatch,
	useAppSelector,
	useI18n,
	type SelectOption,
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
import {
	ConstructionClass,
	Guidebooks,
	type BuildingType,
	type CategoryClass,
	type ConstructionsAddData,
	type ConstructionsEditData,
	type Issuer,
} from '@features/guidbooks/types';

import type { IssuerDto } from '@api-gen';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError, type AxiosResponse } from 'axios';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
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
	x2?: number;
	y2?: number;
	page?: number;
	floorId?: string;
	reportFloorInfoId?: string;
	floorNumber?: string;
	constructionTargetTab?: 'walls' | 'floors';
}

interface RoomRequirementMap {
	[firstRoomId: string]: Array<{
		secondRoomId: string;
		secondRoomName: string;
		requirementId: string;
		rw?: number | null;
	}>;
}

export const CreateConstructionForm = memoize(
	forwardRef<CreateConstructionFormHandle, CreateConstructionFormProps>(
		(
			{
				onSuccess,
				x,
				y,
				x2,
				y2,
				page,
				floorId,
				reportFloorInfoId,
				floorNumber,
				constructionTargetTab = 'walls',
			},
			ref,
		) => {
			const { t, locale } = useI18n();
			const form = useForm<CreateConstructionData>({
				defaultValues: CreateConstructionConfig.defaultValues,
				resolver: zodResolver(CreateConstructionConfig.schema),
			});
			const { register, formState, control, setValue, watch, handleSubmit, getValues } = form;
			const [constructionData, setConstructionData] = useState<Array<ConstructionsAddData>>(
				[],
			);
			const [favoriteConstructionIds, setFavoriteConstructionIds] = useState<Set<string>>(
				new Set(),
			);
			const [reportInfoData, setReportInfoData] = useState<ReportInfoShort>();
			const [constructionDetail, setConstructionDetail] =
				useState<ConstructionsEditData | null>(null);
			const [svgUrl, setSvgUrl] = useState<string | null>(null);
			const [issuer, setIssuer] = useState<Issuer | null>(null);
			const [issuerIsLoading, setIssuerIsLoading] = useState(false);
			const [previewSrc, setPreviewSrc] = useState<string | null>(null);

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
				secondPlacementRoom,
			] = watch([
				'length',
				'width',
				'construction',
				'area',
				'name',
				'id',
				'constructionType',
				'firstPlacementRoom',
				'secondPlacementRoom',
			]);

			const paginationRw = useMemo(() => {
				if (!firstPlacementRoom || !secondPlacementRoom) return undefined;
				const entries = roomRequirementsMap[firstPlacementRoom];
				const match = entries?.find((e) => e.secondRoomId === secondPlacementRoom);
				if (match?.rw == null || Number.isNaN(Number(match.rw))) return undefined;
				return Number(match.rw);
			}, [firstPlacementRoom, secondPlacementRoom, roomRequirementsMap]);

			const [roomOptions, setRoomOptions] = useState<Array<{ label: string; value: string }>>(
				[],
			);
			const [search] = useSearchParams();
			const editMode = search.get('editMode');
			/** Редактирование с планов этажей — `edit=true`, из других экранов может быть `editMode`. */
			const isEditFlow = Boolean(search.get('edit') || editMode);
			const reportId = search.get('reportId');
			const reportType = search.get('reportType');
			const layerId = search.get('layerId');

			const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
			const userId = useAppSelector((state) => state.userData.data?.id);
			const dispatch = useAppDispatch();

			const processRoomRequirements = (roomRequirementsData: any[]) => {
				const map: RoomRequirementMap = {};

				roomRequirementsData.forEach((item) => {
					const firstRoomId = item.firstPlacementRoom.id;

					item.secondRequirementRooms.forEach((requirement: any) => {
						const secondRoomId = requirement.secondPlacementRoom.id;
						const secondRoomName = requirement.secondPlacementRoom.name;
						const requirementId = requirement.requirementId;
						const rw = requirement.rw as number | null | undefined;

						if (!map[firstRoomId]) {
							map[firstRoomId] = [];
						}

						map[firstRoomId].push({
							secondRoomId,
							secondRoomName,
							requirementId,
							rw,
						});
					});
				});

				setRoomRequirementsMap(map);
			};

			useEffect(() => {
				if (firstPlacementRoom && roomRequirementsMap[firstPlacementRoom]) {
					const availableRooms = roomRequirementsMap[firstPlacementRoom];
					const options = availableRooms.map((room) => ({
						label:
							room.rw != null && !Number.isNaN(Number(room.rw))
								? `${room.secondRoomName} (Rw ${room.rw})`
								: room.secondRoomName,
						value: room.secondRoomId,
					}));
					setSecondRoomOptions(options);

					if (!isEditFlow) {
						setValue('secondPlacementRoom', '');
						setValue('requirementId', '');
					} else {
						const currentSecond = getValues('secondPlacementRoom');
						const stillValid = options.some((o) => o.value === currentSecond);
						if (currentSecond && !stillValid) {
							setValue('secondPlacementRoom', '');
							setValue('requirementId', '');
						}
					}
				} else {
					if (!isEditFlow) {
						setSecondRoomOptions([]);
						setValue('secondPlacementRoom', '');
						setValue('requirementId', '');
					}
				}
			}, [firstPlacementRoom, roomRequirementsMap, setValue, isEditFlow, getValues]);

			useEffect(() => {
				if (
					firstPlacementRoom &&
					secondPlacementRoom &&
					roomRequirementsMap[firstPlacementRoom]
				) {
					const requirement = roomRequirementsMap[firstPlacementRoom].find(
						(room) => room.secondRoomId === secondPlacementRoom,
					);

					if (requirement) {
						setValue('requirementId', requirement.requirementId);
					}
				}
			}, [secondPlacementRoom, firstPlacementRoom, roomRequirementsMap, setValue]);

			useEffect(() => {
				setValue(
					'constructionType',
					constructionTargetTab === 'floors'
						? ConstructionClass.Floor
						: ConstructionClass.Wall,
					{ shouldValidate: true },
				);
			}, [constructionTargetTab, setValue]);

			useImperativeHandle(ref, () => ({
				submit: () => {
					handleSubmit((data) => {
						handleAddConstruction(data);
					})();
				},
				reset: (data) => {
					form.reset({
						constructionType:
							form.getValues('constructionType') || ConstructionClass.Wall,
						...data,
					});
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
				const optionalGuid = (value?: string | null) => {
					if (!value) return undefined;
					const normalized = value.trim();
					return normalized.length ? normalized : undefined;
				};

				const resolvedFloorConstructionInfoId = optionalGuid(floorId || layerId);
				const resolvedReportFloorInfoId = optionalGuid(
					reportFloorInfoId ||
						search.get('reportFloorInfoId') ||
						search.get('activeLevelId') ||
						id,
				);
				const selectedFloorNumber = floorNumber || search.get('floorNumber') || '1';
				if (reportType === ReportCategory.Floor && !resolvedFloorConstructionInfoId) {
					toast.error('Не удалось определить уровень этажа');
					return;
				}
				if (reportType === ReportCategory.Floor && !resolvedReportFloorInfoId) {
					toast.error('Не удалось определить reportFloorInfoId (id этажа)');
					return;
				}
				const request$ =
					reportType === ReportCategory.Floor
						? (() => {
								const baseX = x
									? +String(x).split('.')[0]
									: +search.get('x')!.split('.')[0]!;
								const baseY = y
									? +String(y).split('.')[0]
									: +search.get('y')!.split('.')[0]!;
								const searchX2 = search.get('x2');
								const searchY2 = search.get('y2');
								const diagonalX =
									typeof x2 === 'number'
										? +String(x2).split('.')[0]
										: searchX2
											? +String(searchX2).split('.')[0]
											: baseX + Math.max(1, Math.round(Number(width || 0)));
								const diagonalY =
									typeof y2 === 'number'
										? +String(y2).split('.')[0]
										: searchY2
											? +String(searchY2).split('.')[0]
											: baseY + Math.max(1, Math.round(Number(length || 0)));

								return updateReportFloor({
									data: {
										...(isEditFlow
											? { floorConstructionInfoId: resolvedReportFloorInfoId }
											: {
													reportFloorInfoId: resolvedReportFloorInfoId,
													floorInfoId:
														resolvedFloorConstructionInfoId ||
														resolvedReportFloorInfoId,
												}),
										'floorInfo.coordinates1.x': baseX,
										'floorInfo.coordinates1.y': baseY,
										'floorInfo.coordinates2.x': diagonalX,
										'floorInfo.coordinates2.y': diagonalY,
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
										'floorInfo.floorNumber': selectedFloorNumber,
										'floorInfo.reportConstructionHeader.name': name,
										reportInfoId: reportId,
										requirementId: getValues('requirementId'),
									},
								});
							})()
						: updateReportSingle({ data: command });

				from(request$)
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
						data: {
							constructionIdToUpdate: construction || undefined,
							userId: userId || undefined,
							...(constructionType
								? { constructionClass: constructionType as ConstructionClass }
								: {}),
							...(paginationRw != null ? { rw: paginationRw } : {}),
							orderByPriority: true,
						},
						guidebookType: Guidebooks.CONSTRUCTION,
						pagination: { pageNumber: 1, pageSize: 99999 },
					}),
				)
					.pipe(
						tap((response: AxiosResponse) => {
							const items = response?.data?.items || [];
							const grouped: Map<
								string,
								{
									displayItem: any;
									hasFavorite: boolean;
								}
							> = items.reduce(
								(
									acc: Map<
										string,
										{
											displayItem: any;
											hasFavorite: boolean;
										}
									>,
									item: any,
								) => {
									const uniqueKey = item?.constructionId || item?.id;
									if (!uniqueKey) return acc;

									const existing = acc.get(uniqueKey);
									if (!existing) {
										acc.set(uniqueKey, {
											displayItem: item,
											hasFavorite: !!item?.userId,
										});
										return acc;
									}

									// For UI text/value prefer base/common record (without userId).
									if (existing.displayItem?.userId && !item?.userId) {
										existing.displayItem = item;
									}

									existing.hasFavorite = existing.hasFavorite || !!item?.userId;
									acc.set(uniqueKey, existing);
									return acc;
								},
								new Map<
									string,
									{
										displayItem: any;
										hasFavorite: boolean;
									}
								>(),
							);

							const groupedValues = Array.from(grouped.values()) as Array<{
								displayItem: any;
								hasFavorite: boolean;
							}>;

							const normalizedItems = groupedValues.map((group) => group.displayItem);

							const favoriteIds = new Set<string>(
								groupedValues
									.filter((group) => group.hasFavorite)
									.map((group) => group.displayItem?.id)
									.filter(Boolean),
							);
							setFavoriteConstructionIds(favoriteIds);

							response.data.items = normalizedItems;
						}),
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

			const constructionSelectOptions: SelectOption[] = useMemo(() => {
				const base =
					convertToSelectValues(
						constructionData.map((c) => ({
							...c,
							name: `${c.description}(${c.name})`,
						})),
					)?.sort((a, b) => {
						const aIsFavorite = favoriteConstructionIds.has(String(a.value));
						const bIsFavorite = favoriteConstructionIds.has(String(b.value));
						return Number(bIsFavorite) - Number(aIsFavorite);
					}) ?? [];

				const valueSet = new Set(base.map((o) => String(o.value)));
				if (construction && !valueSet.has(String(construction))) {
					const labelFromDetail =
						constructionDetail?.id === construction
							? `${constructionDetail.description}(${constructionDetail.name})`
							: null;
					const fallbackLabel = name?.trim() ? String(name) : String(construction);
					return [
						{
							value: construction,
							label: labelFromDetail ?? fallbackLabel,
						},
						...base,
					].map((option) => ({
						...option,
						icon: favoriteConstructionIds.has(String(option.value)) ? (
							<span className="text-[14px] leading-none text-green-600">★</span>
						) : undefined,
					}));
				}

				return base.map((option) => ({
					...option,
					icon: favoriteConstructionIds.has(String(option.value)) ? (
						<span className="text-[14px] leading-none text-green-600">★</span>
					) : undefined,
				}));
			}, [constructionData, construction, constructionDetail, favoriteConstructionIds, name]);

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
			}, [userId, constructionType, paginationRw, construction]);

			return (
				<div className="relative flex w-full flex-col border-b">
					{previewSrc && (
						<ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />
					)}
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
							<input type="hidden" {...register('constructionType')} />
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
							<Controller
								control={control}
								name={'construction'}
								render={({ field }) => (
									<Select
										options={constructionSelectOptions}
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

					{/* Блок превью: ряд заголовков, под ним — схема | материалы | производитель */}
					{construction && (
						<div className="mt-6 flex flex-col gap-3">
							<div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-4 gap-y-3">
								<div className="col-start-1 row-start-1" aria-hidden />
								<div className="col-start-2 row-start-1 min-w-0 text-left">
									<p className="text-lg font-semibold text-gray-800">
										{t('createConstruction.selectedConstruction')}
									</p>
								</div>
								<div className="col-start-3 row-start-1 min-w-0 text-left">
									<p className="text-lg font-semibold text-gray-800">
										{t('createConstruction.manufacturer')}
									</p>
								</div>
								{/* Схема: min-w-0 — чтобы grid не обрезал; картинка w-auto + object-contain — целиком */}
								<div className="col-start-1 row-start-2 flex min-w-0 justify-center self-start">
									<div className="flex w-full min-w-0 max-w-full justify-center bg-white py-1">
										{svgUrl ? (
											<button
												type="button"
												className="mx-auto block w-full cursor-pointer border-0 bg-transparent p-0 text-center"
												onClick={() => setPreviewSrc(svgUrl)}
											>
												<img
													src={svgUrl}
													alt=""
													className="mx-auto block h-auto max-h-[min(68vh,560px)] w-auto max-w-full object-contain"
													decoding="async"
												/>
											</button>
										) : (
											<div className="flex min-h-[200px] w-full items-center justify-center">
												<Loader />
											</div>
										)}
									</div>
								</div>
								<div className="col-start-2 row-start-2 min-w-0 w-full self-start justify-self-stretch text-left">
									<div className="max-w-full overflow-x-auto text-left">
										<div className="flex w-full min-w-0 flex-col items-start gap-0.5 text-left">
											{constructionDetail?.constructionTypeObject?.leftConstruction
												?.slice()
												.sort(
													(a, b) => Number(a.positionId) - Number(b.positionId),
												)
												.map((material, i) => {
													const line = `- ${formatMaterial(material, locale)}`;
													return (
														<p
															key={`left-${i}`}
															className="whitespace-nowrap py-0.5 text-left text-[15px] leading-normal text-gray-800"
															title={line}
														>
															{line}
														</p>
													);
												})}
											{constructionDetail?.constructionTypeObject?.centerConstruction
												?.slice()
												.sort(
													(a, b) => Number(a.positionId) - Number(b.positionId),
												)
												.map((material, i) => {
													const line = `- ${formatMaterial(material, locale)}`;
													return (
														<p
															key={`center-${i}`}
															className="whitespace-nowrap py-0.5 text-left text-[15px] leading-normal text-gray-800"
															title={line}
														>
															{line}
														</p>
													);
												})}
											{constructionDetail?.constructionTypeObject?.rightConstruction
												?.slice()
												.sort(
													(a, b) => Number(a.positionId) - Number(b.positionId),
												)
												.map((material, i) => {
													const line = `- ${formatMaterial(material, locale)}`;
													return (
														<p
															key={`right-${i}`}
															className="whitespace-nowrap py-0.5 text-left text-[15px] leading-normal text-gray-800"
															title={line}
														>
															{line}
														</p>
													);
												})}
										</div>
									</div>
								</div>
								<div className="col-start-3 row-start-2 flex flex-col items-center justify-start gap-2 text-center">
									{issuerIsLoading ? (
										<div className="flex h-[48px] items-center justify-center">
											<Loader />
										</div>
									) : (
										<>
											{issuer?.logoUrl && (
												<button
													type="button"
													className="cursor-pointer border-0 bg-transparent p-0"
													onClick={() => setPreviewSrc(issuer.logoUrl!)}
												>
													<img
														src={issuer.logoUrl}
														alt={issuer.name || ''}
														className="max-h-[72px] w-auto max-w-[180px] object-contain"
													/>
												</button>
											)}
											<p className="max-w-full text-center text-[14px] text-gray-800">
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
													className="whitespace-nowrap text-[14px] text-primary underline"
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
