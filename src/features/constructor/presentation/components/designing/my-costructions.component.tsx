import type { ConstructionHeaderDto } from '@api-gen';
import { Button, ChevronIcon, useAppDispatch, useAppSelector } from '@core';
import type { GraphDetailResponse } from '@features';
import { startLoading, stopLoading } from '@features';

import Loader from '@core/presentation/components/loaders/loader.component';
import { graphDotsConverterToClient } from '@features/constructor/converters';
import { graphDetail } from '@features/constructor/services';
import { RuMaterialParametrs } from '@features/constructor/types/material-parametrs.types';
import { FormSubTitle } from '@features/guidbooks/presentation/components/header/form-sub-title.component';
import { RuMaterialTypeEnum } from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import issuer from '../../../../../assets/issuer.png';
import DesigningGraph from './designing-graph.component';
import { DesigningHeader } from './designing-header.component';

const MyConstructions = () => {
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const [graphData, setGraphData] = useState<GraphDetailResponse[] | null>(null);
	const [isRelevant, setIsRelevant] = useState<boolean>(false);
	const [constructionHeaderId, setConstructionHeaderId] = useState<string | undefined>(undefined);
	const [constructionHeader, setConstructionHeader] = useState<ConstructionHeaderDto | null>(
		null,
	);
	const isLoading = useAppSelector((state) => state.constructorLoader.isLoading);
	const dispatch = useAppDispatch();

	// useEffect(() => {
	// 	if (!reportId) return;
	// 	from(getReportFloorById({ id: reportId }))
	// 		.pipe(
	// 			catchError((error) => {
	// 				toast.error('Не удалось получить данные отчёта');
	// 				return [];
	// 			}),
	// 		)
	// 		.subscribe((response) => {
	// 			const report: ReportInfoFloorConstructionDto | undefined = response?.data;
	// 			const constructionHeaderId =
	// 				report?.floorConstructionInfos?.[0]?.reportFloorInfos?.[0]
	// 					?.reportConstructionHeader?.constructionHeaderId;
	// 			const constructionHeader =
	// 				report?.floorConstructionInfos?.[0]?.reportFloorInfos?.[0]
	// 					?.reportConstructionHeader?.constructionHeader;
	// 			if (constructionHeaderId) {
	// 				setConstructionHeaderId(constructionHeaderId);
	// 			} else {
	// 				toast.error('Не найден constructionHeaderId');
	// 			}
	// 			if (constructionHeader) {
	// 				setConstructionHeader(constructionHeader);
	// 			} else {
	// 				toast.error('Не найден constructionHeader');
	// 			}
	// 		});
	// }, [reportId]);

	useEffect(() => {
		const rwValue = constructionHeader?.rw || 0;
		const relevant = rwValue >= 55;
		setIsRelevant(relevant);
	}, [constructionHeader?.rw]);

	useEffect(() => {
		if (!constructionHeaderId || graphData) return;
		dispatch(startLoading());
		from(graphDetail({ constructionHeaderId }))
			.pipe(
				catchError((error) => {
					toast.error('Не удалось загрузить данные графика');
					dispatch(stopLoading());
					return [];
				}),
			)
			.subscribe(({ data }) => {
				if (!data) {
					dispatch(stopLoading());
					return;
				}
				setGraphData(data.map(graphDotsConverterToClient));
				dispatch(stopLoading());
			});
	}, [constructionHeaderId]);

	const relevantText = isRelevant ? 'Соответствует' : 'Не соответствует';
	const materials = constructionHeader?.constructionType?.constructions?.[0]?.userMaterials || [];

	const formatMaterial = (material: (typeof materials)[0]) => {
		const materialType =
			RuMaterialTypeEnum[material.materialType as keyof typeof RuMaterialTypeEnum] ??
			material.materialType;
		const materialParams =
			material.materialTypeValue
				?.map((val) => {
					const param =
						RuMaterialParametrs[
							val.materialParametrs as keyof typeof RuMaterialParametrs
						] ?? val.materialParametrs;
					return `${param}: ${val.value}`;
				})
				.join(', ') || 'нет данных';
		return `${materialType} (${materialParams})`;
	};

	if (isLoading) {
		return (
			<div className="flex size-full items-center justify-center">
				<Loader />
			</div>
		);
	}
	return (
		<div className="flex w-full flex-col gap-[30px]">
			<DesigningHeader />
			<div className="flex h-[428px] w-full flex-row gap-[72px] rounded-[20px] bg-white px-[44px] py-[34px]">
				<div className="flex gap-[60px]">
					<div className="flex flex-col">
						<Button className="h-[40px] w-[190px] px-[16px] text-[16px]">
							Конструкция 1
						</Button>
					</div>
					<div className="rounded-lg border border-blue-500 p-[20px]">
						<FormSubTitle text="Конструкция 1" />
						<div className="flex flex-col">
							{materials.map((material, index) => (
								<p key={index} className="text-[16px]">
									- {formatMaterial(material)}
								</p>
							))}
						</div>
					</div>
					<div className="flex flex-col">
						<img
							src={issuer}
							alt="Превью изображения"
							className="h-[66px] w-[140px] rounded-md object-cover"
						/>
						<p>www.acoustic.ru</p>
						<div className="flex items-center gap-[20px]">
							<Button variant="primary" className="p-[10px]">
								<ChevronIcon className="rotate-90" fill="white" />
							</Button>
							<Button variant="primary" className="p-[10px]">
								<ChevronIcon className="-rotate-90" fill="white" />
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full gap-[72px] rounded-[20px] bg-white px-[25px] py-[27px]">
				<div className="flex flex-col">
					<p className="text-[12px] italic">СП 275.1325800.2016</p>
					<p className="text-[12px] italic">Защита от шума, Россия </p>
					<p className="text-[25px] font-[600]">Rw = {constructionHeader?.rw} dB</p>
					<p
						className={twMerge(
							'text-[20px] font-[600]',
							isRelevant ? 'text-[#008C54]' : 'text-[#FF0000]',
						)}
					>
						{relevantText}
					</p>
					<p className="text-[12px] italic">
						СП 51.13330.2011 &quot;Защита от шума&quot;{' '}
					</p>
					<p className="text-[25px] font-[600]">Rw ≥ 55 dB</p>
				</div>
				<DesigningGraph graphData={graphData} />
			</div>
		</div>
	);
};

export default MyConstructions;
