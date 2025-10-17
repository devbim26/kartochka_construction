import { FormElementLabel, useAppDispatch, useAppSelector } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { convertToClientFloorConstruction } from '@features/constructor/converters';
import { getFloorConstructionById } from '@features/constructor/services';
import { startLoading, stopLoading } from '@features/constructor/store';
import type { FloorConstruction } from '@features/constructor/types';
import { convertToClientConstructionsEditData } from '@features/guidbooks/converters';
import { getGuidebooksDetail } from '@features/guidbooks/services';
import type { ConstructionsEditData } from '@features/guidbooks/types';
import { Guidebooks } from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, of, tap } from 'rxjs';
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
	const reportFloorInfoId = search.get('reportFloorInfoId');
	const dispatch = useAppDispatch();
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const handleGetCurrentConstructionReportHeader = (id: string) => {
		dispatch(startLoading());
		from(getFloorConstructionById(id))
			.pipe(
				tap((response) => {
					if (response?.data && response.status === 200) {
						setCurrentConstruction(convertToClientFloorConstruction(response.data));
					}
				}),
				catchError((error) => {
					console.error('Ошибка запроса:', error);
					toast.error('Ошибка при получении информации о конструкции');
					return of(null);
				}),
			)
			.subscribe(() => {
				dispatch(stopLoading());
			});
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
		if (!reportFloorInfoId) return;
		handleGetCurrentConstructionReportHeader(reportFloorInfoId);
	}, [search]);

	useEffect(() => {
		if (!currentConstruction) return;
		handleGetConstructionByHeaderId(
			currentConstruction.reportConstructionHeader.constructionHeaderId,
		);
	}, [currentConstruction]);

	console.log(constructionType);

	return (
		<div className="relative flex flex-row gap-[10px] border-b">
			{isLoading && (
				<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/60">
					<Loader />
				</div>
			)}
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
						2
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Ширина (высота), м
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						2
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
						{constructionType?.constructionTypeObject.constructions?.[0]?.userMaterials?.[0]?.materialTypeValue?.find(
							(v) => v.materialParameters === 'Thickness',
						)?.value ?? '—'}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Общая масса, кг
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						1212
					</p>
				</div>
			</div>
			<div className="flex flex-col gap-[10px]">
				<FormElementLabel className="text-left font-sans font-semibold leading-6">
					Соответствие нормам
				</FormElementLabel>
				<GeneralInformationPhysical />
				<GeneralInformationSoundproofing />
				<GeneralInformationThermal />
				<GeneralInformationFireResistance />
			</div>
		</div>
	);
};
