import type { ConstructionHeaderDto, ReportInfoFloorConstructionDto } from '@api-gen';
import { Button, Input } from '@core';
import type { DesigningData, Dot, GraphDetailResponse } from '@features';
import {
	DesigningConfig,
	DesigningHeader,
	RuMaterialParametrs,
	SoundReductionTable,
} from '@features';
import { getReportFloorById, graphDetail } from '@features/constructor/services';
import { ConstructionTypeMap } from '@features/guidbooks/constants';
import type { ConstructionTypeEnum } from '@features/guidbooks/types';
import { RuConstructionTypesMap, RuMaterialTypeEnum } from '@features/guidbooks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from } from 'rxjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import DesigningGraph from './designing-graph.component';

const DesigningScreen = () => {
	const [search] = useSearchParams();
	const reportId = search.get('reportId');
	const [graphData, setGraphData] = useState<GraphDetailResponse | null>(null);
	const [constructionHeaderId, setConstructionHeaderId] = useState<string | undefined>(undefined);
	const [constructionHeader, setConstructionHeader] = useState<ConstructionHeaderDto | null>(
		null,
	);
	const [isRelevant, setIsRelevant] = useState<boolean>(false);
	const form = useForm<DesigningData>({
		resolver: zodResolver(DesigningConfig.schema),
		defaultValues: DesigningConfig.defaultValues,
		mode: 'onSubmit',
	});

	useEffect(() => {
		if (!reportId) return;
		from(getReportFloorById({ id: reportId }))
			.pipe(
				catchError((error) => {
					toast.error('Не удалось получить данные отчёта');
					return [];
				}),
			)
			.subscribe((response) => {
				const report: ReportInfoFloorConstructionDto | undefined = response?.data;
				const constructionHeaderId =
					report?.floorConstructionInfos?.[0]?.reportFloorInfos?.[0]
						?.reportConstructionHeader?.constructionHeaderId;
				const constructionHeader =
					report?.floorConstructionInfos?.[0]?.reportFloorInfos?.[0]
						?.reportConstructionHeader?.constructionHeader;
				if (constructionHeaderId) {
					setConstructionHeaderId(constructionHeaderId);
				} else {
					toast.error('Не найден constructionHeaderId');
				}
				if (constructionHeader) {
					setConstructionHeader(constructionHeader);
				} else {
					toast.error('Не найден constructionHeader');
				}
			});
	}, [reportId]);

	useEffect(() => {
		if (!constructionHeaderId) return;
		from(graphDetail({ constructionHeaderId }))
			.pipe(
				catchError((error) => {
					toast.error('Не удалось загрузить данные графика');
					return [];
				}),
			)
			.subscribe((response) => {
				console.log(response.data);
				const data = response?.data;
				if (data) {
					const mappedData: GraphDetailResponse = {
						delta: data.delta,
						c: data.c,
						ctr: data.ctr,
						computingRw: data.computingRw,
						labRw: data.labRw,
						dotRs: (data.dotRs || [])
							.filter(
								(dot): dot is Dot =>
									typeof dot.r === 'number' && typeof dot.f === 'number',
							)
							.map((dot) => ({ r: dot.r, f: dot.f })),
						deviationDots: (data.deviationDots || [])
							.filter(
								(dot): dot is Dot =>
									typeof dot.r === 'number' && typeof dot.f === 'number',
							)
							.map((dot) => ({ r: dot.r, f: dot.f })),
						laboratoryDots: (data.laboratoryDots || [])
							.filter(
								(dot): dot is Dot =>
									typeof dot.r === 'number' && typeof dot.f === 'number',
							)
							.map((dot) => ({ r: dot.r, f: dot.f })),
						dotC:
							data.dotC &&
							typeof data.dotC.r === 'number' &&
							typeof data.dotC.f === 'number'
								? { r: data.dotC.r, f: data.dotC.f }
								: undefined,
						dotB:
							data.dotB &&
							typeof data.dotB.r === 'number' &&
							typeof data.dotB.f === 'number'
								? { r: data.dotB.r, f: data.dotB.f }
								: undefined,
					};
					setGraphData(mappedData);
				}
			});
	}, [constructionHeaderId]);

	useEffect(() => {
		const rwValue = constructionHeader?.rw || 0;
		setIsRelevant(rwValue >= 55);
	}, [constructionHeader?.rw]);

	const relevantText = isRelevant ? 'Соответствует' : 'Не соответствует';

	const constructionType = constructionHeader?.constructionType?.constructionTypeEnum as
		| ConstructionTypeEnum
		| undefined;
	const ruConstructionType = constructionType ? RuConstructionTypesMap[constructionType] : '';
	const materials = constructionHeader?.constructionType?.constructions?.[0]?.userMaterials || [];

	useEffect(() => {
		if (constructionType) {
			ConstructionTypeMap({
				currentConstruction: constructionType,
				currentForm: form,
			}).action();
		}
	}, [constructionType]);

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

	console.log('dotRs.length', graphData?.dotRs?.length);
	console.log(
		'frequencyLabels',
		graphData?.dotRs?.map((dot) => dot.f),
	);

	return (
		<div className="flex w-full flex-col gap-[30px]">
			<DesigningHeader />
			<div className="flex h-[428px] w-full flex-row gap-[72px] rounded-[20px] bg-white px-[44px] py-[34px]">
				<img className="h-full w-[100px]" />
				<div className="flex flex-col gap-[30px]">
					<Input
						label="Тип конструкции"
						labelClassName="font-sans text-[16px] font-[600] text-input-label-primary"
						inputClassName="h-[30px] px-[12px] font-sans text-[14px] font-[400] w-[300px] rounded-[8px]"
						wrapperClassName="flex-row items-center gap-[66px]"
						value={ruConstructionType}
						disabled
					/>
					<div className="flex flex-col">
						{materials.map((material, index) => (
							<p key={index} className="text-[16px]">
								- {formatMaterial(material)}
							</p>
						))}
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col gap-[35px] rounded-[20px] bg-white px-[25px] py-[27px]">
				{constructionType &&
					ConstructionTypeMap({
						currentConstruction: constructionType,
						currentForm: form,
					}).component}
				<Button className="ml-auto h-[40px] w-fit px-[16px] font-sans text-sm font-semibold shadow-none">
					Применить
				</Button>
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
				<DesigningGraph constructionHeaderId={constructionHeaderId || ''} />
				<SoundReductionTable
					frequencyLabels={graphData?.dotRs?.map((dot) => dot.f) || []}
					rLab={graphData?.laboratoryDots?.map((dot) => dot.r) || []}
					rInSitu={graphData?.dotRs?.map((dot) => dot.r) || []}
					noPadding={true}
				/>
			</div>
		</div>
	);
};

export default DesigningScreen;
