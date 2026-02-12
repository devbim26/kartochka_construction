import { FormElementLabel, useAppDispatch, useAppSelector } from '@core';
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
import { convertToClientConstructionsEditData } from '@features/guidbooks/converters';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import type { ConstructionsEditData, ConstructionTypeEnum } from '@features/guidbooks/types';
import { Guidebooks, RuConstructionTypesMap } from '@features/guidbooks/types';
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
	const [search] = useSearchParams();
	const [currentConstruction, setCurrentConstruction] = useState<FloorConstruction>();
	const [constructionType, setConstructionType] = useState<ConstructionsEditData>();
	const [thickness, setThickness] = useState<number>();
	const [mass, setMass] = useState<number>();
	const [density, setDensity] = useState<number>();
	const [currentReportInfo, setCurrentReportInfo] = useState<ReportInfoShort>();
	const reportFloorInfoId = search.get('reportFloorInfoId');
	const reportId = search.get('reportId');
	const reportType = search.get('reportType');
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);

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

		const thicknessValues = allMaterials
			.flatMap((m) => m.materialTypeValue || [])
			.filter((v) => v.materialParameters === 'Thickness')
			.map((v) => Number(v.value) || 0);

		const densityValues = allMaterials
			.flatMap((m) => m.materialTypeValue || [])
			.filter((v) => v.materialParameters === 'Density')
			.map((v) => Number(v.value) || 0);

		const totalThickness = thicknessValues.reduce((acc, val) => acc + val, 0);
		const totalDensity = densityValues.reduce((acc, val) => acc + val, 0);

		if (totalThickness) setThickness(totalThickness);
		if (totalDensity) setDensity(totalDensity);
	}, [constructionType]);

	useEffect(() => {
		if (!thickness || !density || !currentConstruction) return;

		const square = currentConstruction.reportConstructionHeader.square;
		if (!square) return;

		const calculatedMass = (square * thickness * density) / 1000;
		setMass(calculatedMass);
	}, [thickness, density, currentConstruction]);

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
					toast.error('Ошибка при получении информации об отчете');
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
					toast.error('Ошибка при получении информации об отчете');
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
						throw new Error('Ошибка при получении конструкции');
					}

					setCurrentConstruction(
						convertToClientSingleToFloorConstruction(singleResponse.data),
					);

					return of(singleResponse.data);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data || 'Ошибка при загрузке');
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
					toast.error('Ошибка при получении информации о конструкции');
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
					toast.error('Ошибка при получении информации о конструкции');
					return of(null);
				}),
			)
			.subscribe();
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
					Общая информация
				</FormElementLabel>

				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						Название
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{constructionType?.name}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Тип конструкции
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{constructionType
							? RuConstructionTypesMap[
									constructionType.constructionType as ConstructionTypeEnum
								]
							: ''}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Конструкция разделяет
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
						Длина, м
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{currentConstruction?.reportConstructionHeader.length}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Ширина (высота), м
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{currentConstruction?.reportConstructionHeader.width}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Площадь, м2
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{currentConstruction?.reportConstructionHeader.square ?? '—'}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Общая толщина, мм
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{thickness?.toFixed(0) ?? '-'}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Общая масса, кг
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{mass?.toFixed(0) ?? '-'}
					</p>
				</div>
			</div>
			<div className="flex flex-col gap-[10px]">
				<FormElementLabel className="text-left font-sans font-semibold leading-6">
					Соответствие нормам
				</FormElementLabel>
				<GeneralInformationPhysical
					data={[
						{
							physical: 'Толщина, мм',
							values: String(thickness) || '-',
							requirements: '-',
						},
						{
							physical: 'Масса, кг/м²',
							values: String(mass) || '-',
							requirements: '-',
						},
						{
							physical: 'Высота, м',
							values:
								String(currentConstruction?.reportConstructionHeader.width) || '-',
							requirements: String(constructionType?.maxHeight) || '-',
						},
					]}
				/>
				<GeneralInformationSoundproofing
					data={[
						{
							label: 'Расчёт',
							soundproofing: 'Rw, dB',
							values: String(constructionType?.labIndexValue) || '-',
							requirements:
								currentReportInfo?.regulatoryRequirement?.noizeIsolationIndex ||
								'-',
						},
						{
							label: 'Лаб.тест',
							soundproofing: 'Rw, dB',
							values: String(constructionType?.RCalcs) || '-',
							requirements:
								currentReportInfo?.regulatoryRequirement?.noizeIsolationIndex ||
								'-',
						},
					]}
				/>
				<GeneralInformationThermal />
				<GeneralInformationFireResistance />
			</div>
		</div>
	);
};
