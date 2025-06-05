import type { ReportConstructionDto } from '@api-gen';
import { FormElementLabel } from '@core';
import { convertToClientConstructionType } from '@features/guidbooks/converters';
import type { ConstructionTypeEnum } from '@features/guidbooks/types';
import { RuConstructionTypesMap } from '@features/guidbooks/types';
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
			<p className="font-sans text-lg font-semibold leading-4">
				{
					RuConstructionTypesMap[
						convertToClientConstructionType(
							construction.constructionHeader!.constructionType!,
						).constructionTypeEnum as ConstructionTypeEnum
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
					{svgUrl && (
						<img className="h-full w-[100px]" src={svgUrl} alt="SVG Construction" />
					)}
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
