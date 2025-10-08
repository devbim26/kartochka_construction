import type { ReportConstructionDto } from '@api-gen';
import { FormElementLabel } from '@core';
import issuer from '../../../../../assets/issuer.png';
import {
	GeneralInformationFireResistance,
	GeneralInformationPhysical,
	GeneralInformationSoundproofing,
	GeneralInformationThermal,
} from '../modals';

type Props = {
	construction: ReportConstructionDto;
	svgUrl: string | null;
};

export const ConstructionCard = ({ construction, svgUrl }: Props) => {
	return (
		<div className="flex flex-col gap-[30px] rounded-xl bg-white px-[30px] py-[25px]">
			{/* <p className="font-sans text-lg font-semibold leading-4">
				{
					RuConstructionTypesMap[
						convertToClientConstructionType(
							construction.!.constructionType!,
						).constructionTypeEnum as ConstructionTypeEnum
					]
				}
			</p> */}
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
						{/* <div className="flex w-fit flex-col">
							{construction?.constructionHeader?.constructionType?.constructions?.map(
								(construction: any, index) =>
									construction.userMaterials?.map(
										(material: any, materialIndex: any) => (
											<p
												key={`${index}-${materialIndex}`}
												className="text-[16px]"
											>
												- {formatMaterial(material as UserMaterials)}
											</p>
										),
									),
							)}
						</div> */}
					</div>

					<p className="text-primary">Стоимость</p>
					<p className="text-[22px]">2500 RUB/м²</p>
					<p className="font-sans text-[14px] italic">(ориентировочная)</p>
					<p className="font-sans text-[14px] italic text-primary">{'подробнее>>'}</p>
				</div>
				<div className="flex w-1/2 flex-col gap-[10px]">
					<FormElementLabel className="text-left font-sans font-semibold leading-6 text-primary">
						Технические параметры
					</FormElementLabel>
					<GeneralInformationPhysical />
					<GeneralInformationSoundproofing />
					<GeneralInformationThermal />
					<GeneralInformationFireResistance />
				</div>
			</div>
		</div>
	);
};
