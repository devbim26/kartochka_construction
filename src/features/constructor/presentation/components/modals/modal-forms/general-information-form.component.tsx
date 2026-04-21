import { FormElementLabel, useAppDispatch, useAppSelector, useI18n } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import {
	convertToClientFloorConstruction,
	convertToClientReportInfoShort,
	convertToClientSingleToFloorConstruction,
} from '@features/constructor/converters';
import {
	getFloorConstructionById,
	getReportFloorById,
	getReportSingleById,
} from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import { ReportCategory, type FloorConstruction } from '@features/constructor/types';
import type { ReportInfoShort } from '@features/constructor/utils';
import {
	getSurfaceMassKgPerM2FromMaterials,
	getTotalThicknessMmFromMaterials,
} from '@features/constructor/utils';
import { convertToClientConstructionsEditData } from '@features/guidbooks/converters';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import type { ConstructionsEditData, ConstructionTypeEnum } from '@features/guidbooks/types';
import {
	EnConstructionTypesMap,
	Guidebooks,
	RuConstructionTypesMap,
} from '@features/guidbooks/types';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, finalize, from, of, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import {
	GeneralInformationFireResistance,
	GeneralInformationPhysical,
	GeneralInformationSoundproofing,
	GeneralInformationThermal,
} from './general-information-tables';

export const GeneralInformationForm = () => {
	const { t, locale } = useI18n();
	const [search] = useSearchParams();
	const [currentConstruction, setCurrentConstruction] = useState<FloorConstruction>();
	const [constructionType, setConstructionType] = useState<ConstructionsEditData>();
	const [thickness, setThickness] = useState<number>();
	const [surfaceMassKgPerM2, setSurfaceMassKgPerM2] = useState<number>();
	const [totalMassKg, setTotalMassKg] = useState<number>();
	const [currentReportInfo, setCurrentReportInfo] = useState<ReportInfoShort>();
	const reportFloorInfoId = search.get('reportFloorInfoId');
	const reportId = search.get('reportId');
	const reportType = search.get('reportType');
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);

	// Выбор маппинга типов конструкций в зависимости от языка
	const constructionTypeMap = locale === 'ru' ? RuConstructionTypesMap : EnConstructionTypesMap;

	useEffect(() => {
		if (reportType === ReportCategory.Floor && reportId)
			handleGetCurrentReportFloorInfo(reportId);
		else if (reportType === ReportCategory.Single && reportId)
			handleGetCurrentReportShortSingleInfo(reportId);
	}, [reportType, reportId]);

	useEffect(() => {
		if (!constructionType) return;

		const allMaterials = [
			...(constructionType.constructionTypeObject.leftConstruction || []),
			...(constructionType.constructionTypeObject.centerConstruction || []),
			...(constructionType.constructionTypeObject.rightConstruction || []),
		];

		setThickness(getTotalThicknessMmFromMaterials(allMaterials));
		setSurfaceMassKgPerM2(getSurfaceMassKgPerM2FromMaterials(allMaterials));
	}, [constructionType]);

	useEffect(() => {
		if (surfaceMassKgPerM2 === undefined || !currentConstruction) {
			setTotalMassKg(undefined);
			return;
		}

		const square = currentConstruction.reportConstructionHeader.square;
		if (!square) {
			setTotalMassKg(undefined);
			return;
		}

		setTotalMassKg(surfaceMassKgPerM2 * square);
	}, [surfaceMassKgPerM2, currentConstruction]);

	const handleGetCurrentReportShortSingleInfo = (id: string) => {
		dispatch(startLoading());
		from(getReportSingleById({ id: id }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						setCurrentReportInfo(convertToClientReportInfoShort(response.data));
					}
				}),
				catchError((error) => {
					console.error('Ошибка запроса:', error);
					toast.error(t('generalInfo.error.fetchReport'));
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

	const handleGetCurrentReportFloorInfo = (id: string) => {
		dispatch(startLoading());
		from(getReportFloorById({ id: id }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						setCurrentReportInfo(convertToClientReportInfoShort(response.data));
					}
				}),
				catchError((error) => {
					console.error('Ошибка запроса:', error);
					toast.error(t('generalInfo.error.fetchReport'));
					return of(null);
				}),
			)
			.subscribe(() => {
				dispatch(stopLoading());
			});
	};

	const handleGetSingleConstruction = (id: string) => {
		dispatch(startLoading());

		from(getReportSingleById({ id }))
			.pipe(
				switchMap((singleResponse) => {
					if (singleResponse.status !== 200 || !singleResponse.data) {
						throw new Error(t('generalInfo.error.fetchConstruction'));
					}

					setCurrentConstruction(
						convertToClientSingleToFloorConstruction(singleResponse.data),
					);

					return of(singleResponse.data);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data || t('generalInfo.error.load'));
					} else {
						toast.error((error as Error).message);
					}
					return of(null);
				}),
				finalize(() => {
					dispatch(stopLoading());
				}),
			)
			.subscribe();
	};

	const handleGetCurrentConstructionReportHeader = (id: string) => {
		dispatch(startLoading());
		from(getFloorConstructionById(id))
			.pipe(
				tap((response) => {
					if (response?.data && response.status === 200) {
						setCurrentConstruction(convertToClientFloorConstruction(response.data));
					}
					dispatch(stopLoading());
				}),
				catchError((error) => {
					console.error('Ошибка запроса:', error);
					toast.error(t('generalInfo.error.fetchConstruction'));
					dispatch(stopLoading());
					return of(null);
				}),
			)
			.subscribe();
	};

	const handleGetConstructionByHeaderId = (id: string) => {
		dispatch(startLoading());
		from(getGuidebooksDetail({ id: id, guidebookType: Guidebooks.CONSTRUCTION }))
			.pipe(
				tap((response) => {
					if (response.status === 200) {
						setConstructionType(convertToClientConstructionsEditData(response.data));
					}
				}),
				catchError((error) => {
					console.error('Ошибка запроса:', error);
					toast.error(t('generalInfo.error.fetchConstruction'));
					return of(null);
				}),
			)
			.subscribe(() => dispatch(stopLoading()));
	};

	useEffect(() => {
		if (reportType === ReportCategory.Single && reportId) {
			handleGetSingleConstruction(reportId);
		} else {
			if (!reportFloorInfoId) return;
			handleGetCurrentConstructionReportHeader(reportFloorInfoId);
		}
	}, [search]);

	useEffect(() => {
		if (!currentConstruction) return;
		handleGetConstructionByHeaderId(
			currentConstruction.reportConstructionHeader.constructionHeaderId,
		);
	}, [currentConstruction]);

	return (
		<div className="relative flex flex-row gap-[10px] border-b">
			{isLoading ||
				(!currentReportInfo && (
					<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/60">
						<Loader />
					</div>
				))}
			<div className="flex flex-col gap-[24px]">
				<FormElementLabel className="text-left font-sans font-semibold leading-6">
					{t('generalInfo.title')}
				</FormElementLabel>

				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{t('generalInfo.name')}
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{constructionType?.name}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						{t('generalInfo.constructionType')}
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{constructionType
							? constructionTypeMap[
									constructionType.constructionType as ConstructionTypeEnum
								]
							: ''}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						{t('generalInfo.divides')}
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{currentConstruction?.reportConstructionHeader.firstPlacemetnRoom?.name ??
							'—'}{' '}
						/{' '}
						{currentConstruction?.reportConstructionHeader?.secondPlacementRoom.name ??
							'—'}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						{t('generalInfo.length')}
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{currentConstruction?.reportConstructionHeader.length}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						{t('generalInfo.width')}
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{currentConstruction?.reportConstructionHeader.width}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						{t('generalInfo.area')}
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{currentConstruction?.reportConstructionHeader.square ?? '—'}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						{t('generalInfo.totalThickness')}
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{thickness?.toFixed(0) ?? '-'}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						{t('generalInfo.totalMass')}
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{totalMassKg !== undefined ? totalMassKg.toFixed(0) : '-'}
					</p>
				</div>
			</div>
			<div className="flex flex-col gap-[10px]">
				<FormElementLabel className="text-left font-sans font-semibold leading-6">
					{t('generalInfo.complianceTitle')}
				</FormElementLabel>
				<GeneralInformationPhysical
					data={[
						{
							physical: t('generalInfo.totalThickness'),
							values: String(thickness) || '-',
							requirements: '-',
						},
						{
							physical: t('generalInfo.massPerSquareMeter'),
							values:
								surfaceMassKgPerM2 !== undefined
									? surfaceMassKgPerM2.toFixed(2)
									: '-',
							requirements: '-',
						},
						{
							physical: t('generalInfo.width'),
							values:
								String(currentConstruction?.reportConstructionHeader.width) || '-',
							requirements: String(constructionType?.maxHeight) || '-',
						},
					]}
				/>
				<GeneralInformationSoundproofing
					data={[
						{
							label: t('soundproofing.calculation'), // нужно добавить ключ
							soundproofing: 'Rw, dB',
							values: String(constructionType?.labIndexValue) || '-',
							requirements:
								currentConstruction?.reportConstructionHeader.requirement
									?.noizeIsolationIndex || '-',
						},
						{
							label: t('soundproofing.labTest'), // нужно добавить ключ
							soundproofing: 'Rw, dB',
							values: String(constructionType?.RCalcs) || '-',
							requirements:
								currentConstruction?.reportConstructionHeader.requirement
									?.noizeIsolationIndex || '-',
						},
					]}
				/>
				<GeneralInformationThermal />
				<GeneralInformationFireResistance />
			</div>
		</div>
	);
};
