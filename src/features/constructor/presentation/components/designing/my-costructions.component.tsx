import { Button, ChevronIcon, useAppSelector } from '@core';
import { SoundReductionTable } from '@features';
import { RuMaterialParametrs } from '@features/constructor/types/material-parametrs.types';
import { FormSubTitle } from '@features/guidbooks/presentation/components/header/form-sub-title.component';
import type { ConstructionTypeEnum } from '@features/guidbooks/types';
import { RuMaterialTypeEnum } from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import issuer from '../../../../../assets/issuer.png';
import DesigningChart from './designing-chart.component';
import { DesigningHeader } from './designing-header.component';

const MyConstructions = () => {
	const reportInfoFull = useAppSelector((state) => state.constructorData.reportInfoFull);

	const [chartLabels, setChartLabels] = useState<number[]>([]);
	const [chartData, setChartData] = useState<number[]>([]);

	const rwValue =
		reportInfoFull?.floorConstructionInfos?.[0]?.reportFloorInfos?.[0]?.reportConstructionHeader
			?.constructionHeader?.rw || 0;
	const isRelevant = rwValue >= 55;
	const relevantText = isRelevant ? 'Соответствует' : 'Не соответствует';

	useEffect(() => {
		if (reportInfoFull) {
			const constructionData =
				reportInfoFull.floorConstructionInfos?.[0]?.reportFloorInfos?.[0]
					?.reportConstructionHeader?.constructionHeader;
			if (constructionData) {
				const frequencyLabels = [50, 80, 125, 200, 315, 500, 800, 1250, 2500, 3150, 5000];
				const soundReductionData = constructionData.rTotal?.length
					? constructionData.rTotal
					: Array(frequencyLabels.length).fill(constructionData.rw || 0);
				setChartLabels(frequencyLabels);
				setChartData(soundReductionData);
			}
		}
	}, [reportInfoFull]);

	const constructionHeader =
		reportInfoFull?.floorConstructionInfos?.[0]?.reportFloorInfos?.[0]?.reportConstructionHeader
			?.constructionHeader;
	console.log(constructionHeader);
	const constructionType = constructionHeader?.constructionType?.constructionTypeEnum as
		| ConstructionTypeEnum
		| undefined;
	const materials = constructionHeader?.constructionType?.constructions?.[0]?.userMaterials || [];

	const formatMaterial = (material: (typeof materials)[0]) => {
		const values =
			material.materialTypeValue
				?.map((val) => {
					const paramKey = val.materialParametrs as keyof typeof RuMaterialParametrs;
					const ruParam = RuMaterialParametrs[paramKey] ?? val.materialParametrs;
					return `${ruParam}: ${val.value}`;
				})
				.join(', ') || 'нет данных';
		const typeKey = material.materialType as keyof typeof RuMaterialTypeEnum;
		const russianMaterialType = RuMaterialTypeEnum[typeKey] ?? material.materialType;
		return `${russianMaterialType} (${values})`;
	};
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
					<p className="text-[25px] font-[600]">Rw = {rwValue} dB</p>
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
				<DesigningChart labels={chartLabels} data={chartData} />
				<SoundReductionTable
					frequencyLabels={chartLabels}
					rTotal={chartData}
					noPadding={true}
				/>
			</div>
		</div>
	);
};

export default MyConstructions;
