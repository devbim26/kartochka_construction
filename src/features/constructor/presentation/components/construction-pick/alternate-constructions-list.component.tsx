import type { ReportInfoShort } from '@features/constructor/utils';
import type { AlternateConstruction } from '@features/guidbooks/types';
import { AlternateConstructionCard } from './alternate-construction-card.component';

type Props = {
	alternateConstructions: AlternateConstruction[];
	reportInfo: ReportInfoShort;
};

export const AlternateConstructionList = ({ alternateConstructions, reportInfo }: Props) => {
	return (
		<div className="flex h-fit w-full gap-[10px]">
			{alternateConstructions.map((altConst) => (
				<>
					<AlternateConstructionCard construction={altConst} reportInfo={reportInfo} />
				</>
			))}
		</div>
	);
};
