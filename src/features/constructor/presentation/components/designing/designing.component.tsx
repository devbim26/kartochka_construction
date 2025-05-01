import { Button, Input, useAppSelector } from '@core';
import { DesigningConfig, SoundReductionTable, type DesigningData } from '@features';
import { convertFromDesigningToConstructionsEditData } from '@features/constructor/converters';
import { RuMaterialParametrs } from '@features/constructor/types/material-parametrs.types';
import { ConstructionTypeMap } from '@features/guidbooks/constants';
import { convertToServerConstructionsEditData } from '@features/guidbooks/converters';
import { getGuidebooksEdit } from '@features/guidbooks/services';
import type { ConstructionTypeEnum } from '@features/guidbooks/types';
import { Guidebooks, RuConstructionTypesMap, RuMaterialTypeEnum } from '@features/guidbooks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import DesigningChart from './designing-chart.component';

const DesigningScreen = () => {
	const form = useForm<DesigningData>({
		resolver: zodResolver(DesigningConfig.schema),
		defaultValues: DesigningConfig.defaultValues,
		mode: 'onSubmit',
	});
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
	console.log('constructionHeader:', constructionHeader);
	const constructionType = constructionHeader?.constructionType?.constructionTypeEnum as
		| ConstructionTypeEnum
		| undefined;
	console.log('constructionType:', constructionType);
	const russianConstructionType = constructionType
		? RuConstructionTypesMap[constructionType]
		: '';
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

	useEffect(() => {
		if (constructionType) {
			ConstructionTypeMap({
				currentConstruction: constructionType,
				currentForm: form,
			}).action();
		}
	}, [constructionType]);

	const handleUpdateConstruction = (formData: DesigningData) => {
		const constructionData =
			reportInfoFull?.floorConstructionInfos?.[0]?.reportFloorInfos?.[0]
				?.reportConstructionHeader;
		if (!constructionData) {
			toast.error('Данные не найдены');
			return;
		}
		const dataToSend = {
			command: 'UPDATE',
			data: convertToServerConstructionsEditData(
				convertFromDesigningToConstructionsEditData(formData, constructionData),
			),
		};
		getGuidebooksEdit({
			data: dataToSend,
			guidebookType: Guidebooks.CONSTRUCTION,
		})
			.then((response) => {
				if (response.status === 200) {
					toast.success('Успешно сохранено');
				}
			})
			.catch((error) => {
				toast.error(error.response?.data?.message || 'Ошибка сохранения');
			});
	};

	return (
		<div className="flex w-full flex-col gap-[30px]">
			<div className="flex h-[428px] w-full flex-row gap-[72px] rounded-[20px] bg-white px-[44px] py-[34px]">
				<img className="h-full w-[100px]" />
				<div className="flex flex-col gap-[30px]">
					<Input
						label="Тип конструкции"
						labelClassName="font-sans text-[16px] font-[600] text-input-label-primary"
						inputClassName="h-[30px] px-[12px] font-sans text-[14px] font-[400] w-[300px] rounded-[8px]"
						wrapperClassName="flex-row items-center gap-[66px]"
						value={russianConstructionType}
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
				<Button
					className="ml-auto h-[40px] w-fit px-[16px] font-sans text-sm font-semibold shadow-none"
					onClick={form.handleSubmit(handleUpdateConstruction)}
				>
					Применить
				</Button>
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

export default DesigningScreen;
