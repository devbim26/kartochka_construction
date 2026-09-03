import {
	Checkbox,
	convertToPaginatedType,
	convertToSelectValues,
	convertToServerCountryData,
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
	convertToClientReportInfoShort,
	convertToClientSingleReportInfoShort,
	convertToUpdateReportCommand,
} from '@features/constructor/converters';
import {
	getConstructionRooms,
	getFavoriteConstructions,
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
import {
	CreateConstructionConfig,
	filterConstructionTypeSelectOptionsByCatalogContext,
	getSurfaceMassKgPerM2FromMaterials,
	getTotalThicknessMmFromMaterials,
	isConstructionTypeAllowedInCatalogContext,
	matchesConstructionClassFilter,
	resolveConstructionCatalogFilterContext,
	resolveLayoutClassFromTargetTab,
} from '@features/constructor/utils';
import {
	convertToClientConstructionsAddData,
	convertToClientConstructionsEditData,
	convertToClientIssuerData,
	convertToServerConstructionTypeEnumData,
} from '@features/guidbooks/converters';
import { getGuidebooksDetail, getGuidebooksPaginated } from '@features/guidbooks/services';
import { flattenConstructionMaterialsTopToBottom } from '@features/guidbooks/utils';
import {
	ConstructionClass,
	ConstructionTypeEnum,
	Country,
	EnConstructionTypesSelectValues,
	Guidebooks,
	RuConstructionTypesSelectValues,
	type BuildingType,
	type CategoryClass,
	type ConstructionsAddData,
	type ConstructionsEditData,
	type Issuer,
} from '@features/guidbooks/types';

import type { IssuerDto, SecondRequirementPlacementRoomDto } from '@api-gen';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError, type AxiosResponse } from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { BsExclamationSquareFill } from 'react-icons/bs';
import { useSearchParams } from 'react-router-dom';
import { catchError, finalize, from, of, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { ConstructionInfoModalContent, type ConstructionInfoOverrides } from '../construction-info-modal-content.component';

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
	floorConstructionInfoId?: string;
	floorNumber?: string;
	constructionTargetTab?: 'walls' | 'floors';
	detailsOpen?: boolean;
	onDetailsOpenChange?: (open: boolean) => void;
}

interface RoomRequirementMap {
	[firstRoomId: string]: Array<{
		secondRoomId: string;
		secondRoomName: string;
		requirementId: string;
		rw?: number | null;
		annotation?: string | null;
	}>;
}

/** Компактные мерные поля в одну линию, как в расчёте. */
const DIMENSION_LABEL_CLASS =
	'font-sans text-sm font-normal leading-5 text-input-label-primary w-fit shrink-0 text-left whitespace-nowrap';

const DIMENSION_INPUT_WRAPPER =
	'shadow-none ring-input-border-primary flex-row items-center justify-start gap-[6px] text-left';

const DIMENSION_INPUT_CLASS = 'w-[72px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5';

const DIMENSION_CONTAINER_CLASS = 'w-[72px]';

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
				floorConstructionInfoId,
				floorNumber,
				constructionTargetTab = 'walls',
				detailsOpen = false,
				onDetailsOpenChange,
			},
			ref,
		) => {
			const { t, locale } = useI18n();
			const layoutClass = resolveLayoutClassFromTargetTab(constructionTargetTab);
			const catalogFilterContext = resolveConstructionCatalogFilterContext(layoutClass);
			const form = useForm<CreateConstructionData>({
				defaultValues: {
					...CreateConstructionConfig.defaultValues,
					constructionType: layoutClass,
				},
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
			const [isRequirementNoteOpen, setIsRequirementNoteOpen] = useState(false);
			const [secondRoomOptions, setSecondRoomOptions] = useState<
				Array<{ label: string; value: string }>
			>([]);
			/** Фильтр по типу конструкции (enum), отдельно от form.constructionType = Wall/Floor. */
			const [typeEnumFilter, setTypeEnumFilter] = useState<string>('');
			const [filterByManufacturers, setFilterByManufacturers] = useState(false);

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

			const selectedRequirementAnnotation = useMemo(() => {
				if (!firstPlacementRoom || !secondPlacementRoom) return '';
				const entries = roomRequirementsMap[firstPlacementRoom];
				const match = entries?.find((e) => e.secondRoomId === secondPlacementRoom);
				return (match?.annotation ?? '').trim();
			}, [firstPlacementRoom, secondPlacementRoom, roomRequirementsMap]);

			useEffect(() => {
				setIsRequirementNoteOpen(false);
			}, [firstPlacementRoom, secondPlacementRoom, selectedRequirementAnnotation]);

			const rwDisplayText = useMemo(() => {
				if (paginationRw == null) {
					return locale === 'en' ? 'Rw —, dB' : 'Rw —, дБ';
				}
				const formatted = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'ru-RU', {
					maximumFractionDigits: 4,
					minimumFractionDigits: 0,
				}).format(paginationRw);
				return locale === 'en' ? `Rw ${formatted}, dB` : `Rw ${formatted}, дБ`;
			}, [paginationRw, locale]);

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

					item.secondRequirementRooms.forEach(
						(requirement: SecondRequirementPlacementRoomDto & {
							notice?: string | null;
						}) => {
							const secondRoomId = requirement.secondPlacementRoom?.id;
							const secondRoomName = requirement.secondPlacementRoom?.name;
							const requirementId = requirement.requirementId;
							const rw = requirement.rw as number | null | undefined;
							const annotation = requirement.annotation ?? requirement.notice;

							if (!secondRoomId || !secondRoomName || !requirementId) return;

							if (!map[firstRoomId]) {
								map[firstRoomId] = [];
							}

							map[firstRoomId].push({
								secondRoomId,
								secondRoomName,
								requirementId,
								rw,
								annotation: annotation ?? null,
							});
						},
					);
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

			const clearSelectedConstruction = () => {
				setValue('construction', '');
				setConstructionDetail(null);
				setSvgUrl(null);
				setIssuer(null);
				onDetailsOpenChange?.(false);
			};

			useEffect(() => {
				setValue(
					'constructionType',
					layoutClass,
					{ shouldValidate: true },
				);
			}, [layoutClass, setValue]);

			useEffect(() => {
				setTypeEnumFilter('');
				setFilterByManufacturers(false);
				if (!isEditFlow) {
					clearSelectedConstruction();
				}
			}, [layoutClass, isEditFlow, setValue]);

			useEffect(() => {
				// Подставляем тип только если фильтр ещё пуст (редактирование / первичный load).
				// Не перезаписываем при выборе — иначе лишний refetch и сброс селекта.
				const nextType = constructionDetail?.constructionType;
				if (
					nextType &&
					!typeEnumFilter &&
					isConstructionTypeAllowedInCatalogContext(
						String(nextType),
						catalogFilterContext,
					)
				) {
					setTypeEnumFilter(String(nextType));
				}
			}, [constructionDetail?.id, constructionDetail?.constructionType, catalogFilterContext]);

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
							const isFloorReport = search.get('reportType') == ReportCategory.Floor;
							const data = isFloorReport
								? convertToClientReportInfoShort(response.data as never)
								: convertToClientSingleReportInfoShort(response.data);
							if (data) {
								setReportInfoData({
									...data,
									reportInfoId: reportId ?? data.reportInfoId ?? '',
								});
							}
						}
					});
			};

			useEffect(() => {
				if (reportId) handleGetReport(reportId);
			}, [reportId]);

			useEffect(() => {
				if (!reportInfoData?.comfortClass || !reportInfoData.buildingType) return;

				const regulatoryDocumentId = reportInfoData.regulatoryDocument?.id?.trim();

				from(
					getConstructionRooms({
						class: reportInfoData.comfortClass as CategoryClass,
						buildingType: reportInfoData.buildingType as BuildingType,
						constructionClass: layoutClass,
						...(regulatoryDocumentId ? { regulatoryDocumentId } : {}),
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
			}, [layoutClass, reportInfoData]);

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

				const resolvedLevelId = optionalGuid(
					floorId || layerId || search.get('activeLevelId'),
				);
				const resolvedFloorConstructionInstanceId = optionalGuid(
					floorConstructionInfoId ||
						(isEditFlow ? id || search.get('reportFloorInfoId') : undefined),
				);
				const resolvedReportFloorInfoIdForCreate = optionalGuid(
					reportFloorInfoId ||
						search.get('reportFloorInfoId') ||
						search.get('activeLevelId') ||
						id,
				);
				const selectedFloorNumber = floorNumber || search.get('floorNumber') || '1';
				if (reportType === ReportCategory.Floor) {
					if (isEditFlow) {
						if (!resolvedLevelId) {
							toast.error('Не удалось определить уровень этажа');
							dispatch(stopLoading());
							return;
						}
						if (!resolvedFloorConstructionInstanceId) {
							toast.error('Не удалось определить конструкцию на плане');
							dispatch(stopLoading());
							return;
						}
					} else {
						if (!resolvedLevelId) {
							toast.error('Не удалось определить уровень этажа');
							dispatch(stopLoading());
							return;
						}
						if (!resolvedReportFloorInfoIdForCreate) {
							toast.error('Не удалось определить reportFloorInfoId (id этажа)');
							dispatch(stopLoading());
							return;
						}
					}
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
											? {
													reportFloorInfoId: resolvedLevelId,
													floorConstructionInfoId:
														resolvedFloorConstructionInstanceId,
												}
											: {
													reportFloorInfoId: resolvedReportFloorInfoIdForCreate,
													floorInfoId:
														resolvedLevelId ||
														resolvedReportFloorInfoIdForCreate,
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
				const constructionClass = layoutClass;
				const reportCountryType = reportInfoData?.region
					? convertToServerCountryData(reportInfoData.region as Country)
					: undefined;
				const serverTypeFilter = typeEnumFilter
					? convertToServerConstructionTypeEnumData(
							typeEnumFilter as ConstructionTypeEnum,
						)
					: undefined;
				const selectedConstructionId = isEditFlow
					? getValues('construction') || undefined
					: undefined;

				from(
					Promise.all([
						getGuidebooksPaginated({
							data: {
								constructionIdToUpdate: selectedConstructionId,
								userId: userId || undefined,
								constructionClass,
								...(paginationRw != null ? { rw: paginationRw } : {}),
								...(reportCountryType ? { countryType: reportCountryType } : {}),
								...(serverTypeFilter ? { constructionType: serverTypeFilter } : {}),
								// Бэкенд: onlyManufacturers=true — без производителей (только «Общий»).
								// Чекбокс «Производители» — наоборот: включён = показать брендовых.
								...(filterByManufacturers ? {} : { onlyManufacturers: true }),
								orderByPriority: true,
							},
							guidebookType: Guidebooks.CONSTRUCTION,
							pagination: { pageNumber: 1, pageSize: 99999 },
						}),
						getFavoriteConstructions(),
					]),
				)
					.pipe(
						tap(([response, favoritesResponse]: [AxiosResponse, AxiosResponse]) => {
							const favoriteKeys = new Set<string>();
							for (const fav of favoritesResponse?.data?.items || []) {
								if (fav?.id) favoriteKeys.add(String(fav.id));
								if (fav?.constructionId) favoriteKeys.add(String(fav.constructionId));
							}

							const items = (response?.data?.items || []).filter((item: any) =>
								matchesConstructionClassFilter(item?.constructionType, constructionClass) &&
								isConstructionTypeAllowedInCatalogContext(
									item?.constructionType,
									catalogFilterContext,
								),
							);
							const grouped: Map<
								string,
								{
									displayItem: any;
								}
							> = items.reduce(
								(
									acc: Map<
										string,
										{
											displayItem: any;
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
										});
										return acc;
									}

									// Для UI предпочитаем общую запись (без userId).
									if (existing.displayItem?.userId && !item?.userId) {
										existing.displayItem = item;
									}

									acc.set(uniqueKey, existing);
									return acc;
								},
								new Map<
									string,
									{
										displayItem: any;
									}
								>(),
							);

							const groupedValues = Array.from(grouped.values()) as Array<{
								displayItem: any;
							}>;

							const normalizedItems = groupedValues.map((group) => group.displayItem);

							const favoriteIds = new Set<string>();
							for (const item of normalizedItems) {
								const keys = [item?.id, item?.constructionId]
									.filter(Boolean)
									.map(String);
								if (keys.some((key) => favoriteKeys.has(key)) && item?.id) {
									favoriteIds.add(String(item.id));
								}
							}
							setFavoriteConstructionIds(favoriteIds);

							response.data.items = normalizedItems;
						}),
						switchMap(([response]: [AxiosResponse, AxiosResponse]) => {
							const resData = convertToPaginatedType(
								convertToClientConstructionsAddData,
							)(response.data);
							return from([resData]);
						}),
						tap((resData) => {
							setConstructionData(resData.items);
							// Не сбрасываем выбранную конструкцию после refetch:
							// группировка может подменить id записи, а fallback в options
							// сохраняет отображение выбранного значения.
						}),
						catchError((error) => {
							console.log('error:', error);
							return from([null]);
						}),
					)
					.subscribe(() => dispatch(stopLoading()));
			};

			const typeSelectOptions: SelectOption[] = useMemo(() => {
				const all =
					locale === 'ru'
						? RuConstructionTypesSelectValues
						: EnConstructionTypesSelectValues;
				return filterConstructionTypeSelectOptionsByCatalogContext(all, catalogFilterContext);
			}, [locale, catalogFilterContext]);

			const constructionSelectOptions: SelectOption[] = useMemo(() => {
				const favoritePrefix = t('constructor.calculation.favoritePrefix');
				const withFavoriteLabel = (option: SelectOption): SelectOption => {
					if (!favoriteConstructionIds.has(String(option.value))) return option;
					const label = String(option.label ?? '');
					if (label.startsWith(favoritePrefix)) return option;
					return { ...option, label: `${favoritePrefix}${label}` };
				};

				const isOptionUnavailable = (id: string | number | boolean) => {
					const item = constructionData.find((c) => String(c.id) === String(id));
					return item?.isView === false;
				};

				const filteredData = constructionData.filter((item) => {
					if (
						!isConstructionTypeAllowedInCatalogContext(
							item.constructionType,
							catalogFilterContext,
						)
					) {
						return false;
					}
					if (
						typeEnumFilter &&
						String(item.constructionType) !== String(typeEnumFilter)
					) {
						return false;
					}
					return true;
				});

				const base =
					convertToSelectValues(
						filteredData.map((c) => ({
							...c,
							name: c.description || c.name,
						})),
					)
						?.map((option) => ({
							...option,
							isDisabled: isOptionUnavailable(option.value),
						}))
						?.sort((a, b) => {
							const aIsFavorite = favoriteConstructionIds.has(String(a.value));
							const bIsFavorite = favoriteConstructionIds.has(String(b.value));
							if (aIsFavorite !== bIsFavorite) {
								return Number(bIsFavorite) - Number(aIsFavorite);
							}
							// Доступные выше недоступных
							return Number(a.isDisabled) - Number(b.isDisabled);
						})
						?.map(withFavoriteLabel) ?? [];

				// Не подмешиваем выбранную конструкцию в список другого типа — путает фильтр.
				const selectedMeta = construction
					? constructionData.find((c) => String(c.id) === String(construction))
					: undefined;
				const matchesTypeFilter =
					!!construction &&
					isConstructionTypeAllowedInCatalogContext(
						selectedMeta?.constructionType ?? constructionDetail?.constructionType,
						catalogFilterContext,
					) &&
					(!typeEnumFilter ||
						(selectedMeta != null &&
							String(selectedMeta.constructionType) === String(typeEnumFilter)) ||
						(constructionDetail?.id === construction &&
							String(constructionDetail.constructionType) === String(typeEnumFilter)));

				const valueSet = new Set(base.map((o) => String(o.value)));
				if (matchesTypeFilter && construction && !valueSet.has(String(construction))) {
					const labelFromDetail =
						constructionDetail?.id === construction
							? constructionDetail.description || constructionDetail.name
							: null;
					const fallbackLabel = name?.trim() ? String(name) : String(construction);
					return [
						withFavoriteLabel({
							value: construction,
							label: labelFromDetail ?? fallbackLabel,
							isDisabled: false,
						}),
						...base,
					];
				}

				return base;
			}, [
				constructionData,
				construction,
				constructionDetail,
				favoriteConstructionIds,
				name,
				t,
				typeEnumFilter,
				catalogFilterContext,
			]);

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
			}, [
				userId,
				layoutClass,
				paginationRw,
				reportInfoData?.region,
				typeEnumFilter,
				filterByManufacturers,
				isEditFlow,
			]);

			useEffect(() => {
				if (!construction) {
					onDetailsOpenChange?.(false);
				}
			}, [construction, onDetailsOpenChange]);

			const infoOverrides = useMemo(() => {
				const materials = flattenConstructionMaterialsTopToBottom(
					constructionDetail?.constructionTypeObject,
				);
				const firstRoomName =
					roomOptions.find((o) => o.value === firstPlacementRoom)?.label ?? null;
				const secondRoomName =
					secondRoomOptions.find((o) => o.value === secondPlacementRoom)?.label ?? null;
				const rwRaw = constructionDetail?.RCalcs;
				const rwNum =
					rwRaw == null || rwRaw === ''
						? null
						: Number(String(rwRaw).replace(',', '.'));

				return {
					length,
					width,
					square: area,
					firstRoomName,
					secondRoomName,
					constructionType: constructionDetail?.constructionType as
						| ConstructionInfoOverrides['constructionType']
						| undefined,
					issuerName: issuer?.name || constructionDetail?.issuerName || null,
					issuerImage: issuer?.logoUrl || null,
					rw: rwNum != null && Number.isFinite(rwNum) ? rwNum : null,
					totalThickness: materials.length
						? getTotalThicknessMmFromMaterials(materials)
						: null,
					massPerSquareMeter: materials.length
						? getSurfaceMassKgPerM2FromMaterials(materials)
						: null,
					isHaveAdditionalConstruction: false,
				};
			}, [
				constructionDetail,
				issuer,
				length,
				width,
				area,
				firstPlacementRoom,
				secondPlacementRoom,
				roomOptions,
				secondRoomOptions,
			]);

			return (
				<div className="relative flex w-full gap-0 border-b">
					<div
						className={twMerge(
							'relative flex min-w-0 flex-1 flex-col overflow-hidden',
							detailsOpen && 'pr-6',
						)}
					>
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
							<div className="flex min-w-0 flex-nowrap items-center gap-x-[20px]">
								<div className="flex w-[145px] shrink-0 text-left">
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
								<div className="flex min-w-0 flex-1 flex-nowrap items-center">
									<div className="flex min-w-0 flex-1 gap-x-[12px]">
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
													buttonClassName="w-full min-w-0 h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
													wrapperClassname="shadow-none ring-input-border-primary min-w-0 flex-1"
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
													buttonClassName="w-full min-w-0 h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
													wrapperClassname="shadow-none ring-input-border-primary min-w-0 flex-1"
													isDisabled={!firstPlacementRoom}
												/>
											)}
										/>
									</div>
									{firstPlacementRoom && secondPlacementRoom ? (
										<div className="ml-[10px] flex shrink-0 flex-nowrap items-center gap-x-1.5 font-sans text-sm leading-5 text-black">
											<span className="shrink-0 font-semibold text-black">
												{t('createConstruction.requirement.label')}:{' '}
											</span>
											<span className="shrink-0 font-semibold text-black">
												{rwDisplayText}
											</span>
											{selectedRequirementAnnotation ? (
												<div className="group relative shrink-0">
													<button
														type="button"
														aria-label={
															locale === 'ru'
																? 'Примечание к требованию'
																: 'Requirement note'
														}
														aria-expanded={isRequirementNoteOpen}
														onClick={() =>
															setIsRequirementNoteOpen((open) => !open)
														}
														className="flex size-[20px] items-center justify-center text-primary"
													>
														<BsExclamationSquareFill className="size-[20px]" />
													</button>
													<div
														className={twMerge(
															'pointer-events-none absolute right-0 top-full z-20 mt-2 w-[min(280px,calc(100vw-48px))] rounded bg-black px-3 py-2 text-left text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100',
															isRequirementNoteOpen && 'opacity-100',
														)}
													>
														{selectedRequirementAnnotation}
													</div>
												</div>
											) : null}
										</div>
									) : null}
								</div>
							</div>
							<input type="hidden" {...register('requirementId')} />
							<div className="flex min-w-0 flex-nowrap items-center gap-x-[20px]">
								<label
									className={twMerge(
										'w-[145px] shrink-0 text-left font-sans text-sm font-normal leading-5 text-input-label-primary',
										formState.errors.width?.message ? 'text-error' : '',
									)}
								>
									{formState.errors?.width?.message
										? t(formState.errors.width.message as any)
										: t('createConstruction.width.label')}
								</label>
								<div className="flex min-w-0 flex-nowrap items-center gap-3">
									<Input
										{...register('width')}
										wrapperClassName={DIMENSION_INPUT_WRAPPER}
										inputClassName={DIMENSION_INPUT_CLASS}
										error={
											formState.errors.width?.message
												? t(formState.errors.width.message as any)
												: undefined
										}
										containerClassName={DIMENSION_CONTAINER_CLASS}
										placeholder={t('createConstruction.width.placeholder')}
										maxLength={50}
									/>
									<Input
										{...register('length')}
										labelClassName={twMerge(
											DIMENSION_LABEL_CLASS,
											formState.errors.length?.message ? 'text-error' : '',
										)}
										wrapperClassName={DIMENSION_INPUT_WRAPPER}
										inputClassName={DIMENSION_INPUT_CLASS}
										error={
											formState.errors.length?.message
												? t(formState.errors.length.message as any)
												: undefined
										}
										containerClassName={DIMENSION_CONTAINER_CLASS}
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
											DIMENSION_LABEL_CLASS,
											formState.errors.area?.message ? 'text-error' : '',
										)}
										wrapperClassName={DIMENSION_INPUT_WRAPPER}
										inputClassName={DIMENSION_INPUT_CLASS}
										error={
											formState.errors.area?.message
												? t(formState.errors.area.message as any)
												: undefined
										}
										containerClassName={DIMENSION_CONTAINER_CLASS}
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
							</div>
							<div className="flex w-full min-w-0 items-end gap-3">
								<Select
									options={typeSelectOptions}
									value={typeEnumFilter}
									onChange={(value) => {
										const nextType = value ? String(value) : '';
										if (nextType === typeEnumFilter) return;
										setTypeEnumFilter(nextType);
										clearSelectedConstruction();
									}}
									isSearchable
									label={t('createConstruction.constructionType.label')}
									labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-full shrink-0 text-left"
									placeholder={t(
										'createConstruction.constructionType.placeholder',
									)}
									buttonClassName="w-full min-w-0 h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
									wrapperClassname="shadow-none ring-input-border-primary flex-col gap-[6px] w-full min-w-0 flex-1"
								/>
								<Controller
									control={control}
									name={'construction'}
									render={({ field }) => (
										<Select
											options={constructionSelectOptions}
											{...field}
											value={field.value || ''}
											onChange={(value) => {
												field.onChange(value);
												const selected = constructionData.find(
													(item) => String(item.id) === String(value),
												);
												const nextType = selected?.constructionType
													? String(selected.constructionType)
													: '';
												if (nextType && nextType !== typeEnumFilter) {
													setTypeEnumFilter(nextType);
												}
											}}
											label={
												formState.errors?.construction?.message
													? t(
															formState.errors.construction
																.message as any,
														)
													: t('createConstruction.construction.label')
											}
											isSearchable
											error={
												formState.errors.construction?.message
													? t(
															formState.errors.construction
																.message as any,
														)
													: undefined
											}
											labelClassName={twMerge(
												'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-full shrink-0 text-left',
												formState.errors.construction?.message
													? 'text-error'
													: '',
											)}
											placeholder={t(
												'createConstruction.construction.placeholder',
											)}
											buttonClassName="w-full min-w-0 h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
											wrapperClassname="shadow-none ring-input-border-primary flex-col gap-[6px] w-full min-w-0 flex-[1.35]"
										/>
									)}
								/>
								<Checkbox
									label={t('createConstruction.manufacturerFilter.title')}
									direction="row"
									checked={filterByManufacturers}
									onChange={() => {
										clearSelectedConstruction();
										setFilterByManufacturers((prev) => !prev);
									}}
									wrapperClassName="mb-[2px] shrink-0"
									labelClassName="whitespace-nowrap text-input-label-primary"
								/>
							</div>
						</div>
					</FormProvider>

					{/* Блок превью: заголовки в одной строке, контент и схема по центру */}
					{construction && (
						<div className="mt-6">
							<div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] gap-x-6 gap-y-1">
							<div className="row-span-2 flex min-w-0 flex-col items-center justify-center self-center">
								<div className="flex w-full min-w-0 justify-center bg-white">
									{svgUrl ? (
										<button
											type="button"
											className="cursor-pointer border-0 bg-transparent p-0"
											onClick={() => setPreviewSrc(svgUrl)}
										>
											<img
												src={svgUrl}
												alt=""
												className="block size-auto max-h-[min(68vh,560px)] max-w-full object-contain"
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

								<div className="col-span-2 col-start-2 grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-x-2 self-end pt-8">
									<p className="text-lg font-semibold text-gray-800">
										{t('createConstruction.selectedConstruction')}
									</p>
									<p className="text-center text-lg font-semibold text-gray-800">
										{t('createConstruction.manufacturer')}
									</p>
								</div>

								<div className="flex min-w-0 flex-col justify-center self-center text-left">
								<div className="max-h-[min(68vh,560px)] min-w-0 overflow-y-auto overflow-x-hidden pr-1">
									<div className="flex flex-col items-start gap-0.5">
										{flattenConstructionMaterialsTopToBottom(
											constructionDetail?.constructionTypeObject,
										).map((material, i) => {
												const line = `- ${formatMaterial(material, locale)}`;
												return (
													<p
														key={`material-${i}`}
														className="py-0.5 text-left text-[15px] leading-snug text-gray-800"
														title={line}
													>
														{line}
													</p>
												);
											})}
									</div>
								</div>
								</div>

								<div className="flex min-w-0 flex-col items-center justify-center self-center text-center">
								<div className="flex w-full flex-col items-center gap-2">
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
													className="break-all text-center text-[14px] text-primary underline"
												>
													{issuer?.webSite}
												</a>
											)}
										</>
									)}
								</div>
							</div>
							</div>
						</div>
					)}

					{construction ? (
						<div className="flex shrink-0 justify-end pt-3 pr-1">
							<button
								type="button"
								onClick={() => onDetailsOpenChange?.(!detailsOpen)}
								className="relative z-10 font-sans text-[28px] font-semibold leading-tight text-primary hover:opacity-80"
							>
								{detailsOpen
									? t('createConstruction.details.hide')
									: t('createConstruction.details.more')}
							</button>
						</div>
					) : null}

					<div className="flex border-b py-[10px]"></div>
					</div>

					<AnimatePresence initial={false}>
						{detailsOpen && construction ? (
							<motion.div
								key="construction-details-panel"
								initial={{ width: 0, opacity: 0 }}
								animate={{ width: 920, opacity: 1 }}
								exit={{ width: 0, opacity: 0 }}
								transition={{ duration: 0.25, ease: 'easeInOut' }}
								className="shrink-0 overflow-hidden border-l border-[#EDEFF2]"
							>
								<div className="box-border h-full max-h-[70vh] w-[920px] overflow-y-auto px-5 py-2 text-left">
									<ConstructionInfoModalContent
										constructionHeaderId={construction}
										hideDownload
										compact
										overrides={infoOverrides}
									/>
								</div>
							</motion.div>
						) : null}
					</AnimatePresence>
				</div>
			);
		},
	),
	'CreateConstructionForm',
);
