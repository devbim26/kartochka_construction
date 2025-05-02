import type { ReportConstructionDto } from '@api-gen';
import { FormElementLabel } from '@core';
import { convertToClientConstructionType } from '@features/guidbooks/converters';
import type { ConstructionTypeEnum } from '@features/guidbooks/types';
import { RuConstructionTypesMap } from '@features/guidbooks/types';
import {
	GeneralInformationFireResistance,
	GeneralInformationPhysical,
	GeneralInformationSoundproofing,
	GeneralInformationThermal,
} from '../modals';

type Props = {
	construction: ReportConstructionDto;
};

export const ConstructionCard = ({ construction }: Props) => {
	return (
		<div className="flex flex-col gap-[30px] rounded-xl bg-white px-[30px] py-[25px]">
			<p>
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
					<div className="h-[200px] w-[100px] bg-black"></div>
					<div className="size-[300px] bg-black"></div>
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
