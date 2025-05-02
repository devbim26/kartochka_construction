import { FormElementLabel, useAppDispatch, useAppSelector } from '@core';
import { getReportFloorById } from '@features/constructor/services';
import { constructorSlice } from '@features/constructor/store';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from } from 'rxjs';
import {
	GeneralInformationFireResistance,
	GeneralInformationPhysical,
	GeneralInformationSoundproofing,
	GeneralInformationThermal,
} from './general-information-tables';

export const GeneralInformationForm = () => {
	const dispatch = useAppDispatch();
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const reportInfoFull = useAppSelector((state) => state.constructorData.reportInfoFull);

	useEffect(() => {
		if (!reportId) return;
		from(getReportFloorById({ id: reportId }))
			.pipe(
				catchError((error) => {
					return [];
				}),
			)
			.subscribe((response) => {
				if (response?.data) {
					dispatch(constructorSlice.actions.setInfoFull(response.data));
				}
			});
	}, [reportId]);

	const info =
		reportInfoFull?.floorConstructionInfos?.[0]?.reportFloorInfos?.[0]
			?.reportConstructionHeader;

	return (
		<div className="flex flex-row gap-[10px] border-b">
			<div className="flex flex-col gap-[24px]">
				<FormElementLabel className="text-left font-sans font-semibold leading-6">
					Общая информация
				</FormElementLabel>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						Название
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{info?.constructionHeader?.name ?? ''}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Конструкция разделяет
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{info?.firstPlacementRoom?.name ?? '—'} /{' '}
						{info?.secondPlacementRoom?.name ?? '—'}
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
						{info?.square ?? '—'}
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Общая толщина, мм
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						{info?.constructionHeader?.constructionType?.constructions?.[0]?.userMaterials?.[0]?.materialTypeValue?.find(
							(v) => v.materialParametrs === 'Thickness',
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
