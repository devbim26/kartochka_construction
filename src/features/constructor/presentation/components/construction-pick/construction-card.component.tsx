import { FormElementLabel } from '@core';
import type { ReportInfoShort } from '@features/constructor/utils';
import { formatMaterial } from '@features/constructor/utils';
import type { ConstructionsEditData, ConstructionTypeEnum } from '@features/guidbooks/types';
import { RuConstructionTypesMap } from '@features/guidbooks/types';
import { useEffect, useState } from 'react';
import issuer from '../../../../../assets/issuer.png';
import {
	GeneralInformationFireResistance,
	GeneralInformationPhysical,
	GeneralInformationSoundproofing,
	GeneralInformationThermal,
} from '../modals';

type Props = {
	construction: ConstructionsEditData;
	svgUrl: string | null;
	reportInfo?: ReportInfoShort;
};

export const ConstructionCard = ({ construction, svgUrl, reportInfo }: Props) => {
	const [thickness, setThickness] = useState<number>(0);
	const [mass, setMass] = useState<number>(0);
	const [density, setDensity] = useState<number>(0);

	useEffect(() => {
		if (!construction) return;

		const allMaterials = [
			...(construction.constructionTypeObject.leftConstruction || []),
			...(construction.constructionTypeObject.centerConstruction || []),
			...(construction.constructionTypeObject.rightConstruction || []),
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

		const avgDensity = densityValues.length
			? densityValues.reduce((acc, val) => acc + val, 0) / densityValues.length
			: 0;

		setThickness(totalThickness);
		setDensity(avgDensity);
	}, [construction]);

	useEffect(() => {
		if (!thickness || !density || !construction) return;

		const square = 100;
		if (!square) return;

		const calculatedMass = (square * thickness * density) / 1000;
		setMass(calculatedMass);
	}, [thickness, density, construction]);

	return (
		<div className="flex flex-col gap-[30px] rounded-xl bg-white px-[30px] py-[25px]">
			<p className="font-sans text-lg font-semibold leading-4">
				{
					RuConstructionTypesMap[
						construction.constructionTypeObject!
							.constructionTypeEnum as ConstructionTypeEnum
					]
				}
			</p>
			<div className="flex flex-row justify-between">
				<div className="flex w-1/2 flex-col gap-[10px]">
					<div className="flex items-center gap-[20px]">
						<img
							src={issuer}
							alt="Превью изображения"
							className="h-[66px] w-[140px] rounded-md object-cover"
						/>
						<p className="text-center">www.acoustic.ru</p>
					</div>
					<div className="flex size-fit">
						{svgUrl && (
							<img className="h-full w-[200px]" src={svgUrl} alt="SVG Construction" />
						)}
						<div className="flex w-fit flex-col">
							{[
								...(construction?.constructionTypeObject.leftConstruction || []),
								...(construction?.constructionTypeObject.centerConstruction || []),
								...(construction?.constructionTypeObject.rightConstruction || []),
							].map((material: any, index: number) => (
								<p key={index} className="text-[16px]">
									- {formatMaterial(material)}
								</p>
							))}
						</div>
					</div>
				</div>
				<div className="flex w-1/2 flex-col gap-[10px]">
					<FormElementLabel className="text-left font-sans font-semibold leading-6 text-primary">
						Технические параметры
					</FormElementLabel>
					<GeneralInformationPhysical
						data={[
							{
								physical: 'Толщина, мм',
								values: String(thickness) || '-',
								requirements: '?',
							},
							{
								physical: 'Масса, кг/м²',
								values: String(mass) || '-',
								requirements: '?',
							},
							{
								physical: 'Высота, м',
								values: String(construction?.maxHeight) || '-',
								requirements: String(construction?.maxHeight) || '-',
							},
						]}
					/>
					<GeneralInformationSoundproofing
						data={[
							{
								label: 'Расчёт',
								soundproofing: 'Rw, dB',
								values: String(construction?.labIndexValue) || '-',
								requirements:
									reportInfo?.regulatoryRequirement.noizeIsolationIndex || '-',
							},
							{
								label: 'Лаб.тест',
								soundproofing: 'Rw, dB',
								values: String(construction?.RCalcs) || '-',
								requirements:
									reportInfo?.regulatoryRequirement.noizeIsolationIndex || '-',
							},
						]}
					/>
					<GeneralInformationThermal />
					<GeneralInformationFireResistance />
				</div>
			</div>
		</div>
	);
};
