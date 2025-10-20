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
	const [thickness, setThickness] = useState<number>();
	const [mass, setMass] = useState<number>();
	const [density, setDensity] = useState<number>();

	useEffect(() => {
		if (!construction) return;

		const materialValues =
			construction.constructionTypeObject.constructions?.[0]?.userMaterials?.[0]
				?.materialTypeValue;

		const thicknessValue = materialValues?.find(
			(v) => v.materialParameters === 'Thickness',
		)?.value;
		const densityValue = materialValues?.find((v) => v.materialParameters === 'Density')?.value;

		if (thicknessValue) setThickness(+thicknessValue);
		if (densityValue) setDensity(+densityValue);
	}, [construction]);

	useEffect(() => {
		if (!thickness || !density || !construction) return;

		const square = 100; //TODO: спросить;
		if (!square) return;

		const calculatedMass = (square * thickness * density) / 1000;
		setMass(calculatedMass);
	}, [thickness, density]);

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
							{construction?.constructionTypeObject.constructions?.map(
								(construction: any, index) =>
									construction.userMaterials?.map(
										(material: any, materialIndex: any) => (
											<p
												key={`${index}-${materialIndex}`}
												className="text-[16px]"
											>
												- {formatMaterial(material)}
											</p>
										),
									),
							)}
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
