import type { ReportInfoShort } from '@features/constructor/utils';
import type { AlternateConstruction } from '@features/guidbooks/types';
import { AlternateConstructionCard } from './alternate-construction-card.component';

type Props = {
	alternateConstructions: AlternateConstruction[];
	reportInfo: ReportInfoShort;
	reportConstructionId: string | null;
};

export const AlternateConstructionList = ({
	alternateConstructions,
	reportInfo,
	reportConstructionId,
}: Props) => {
	return (
		<div className="flex h-fit w-full gap-[10px]">
			{alternateConstructions.map((altConst) => (
				<AlternateConstructionCard
					key={altConst.id}
					construction={altConst}
					reportInfo={reportInfo}
					reportConstructionId={reportConstructionId}
				/>
			))}
		</div>
	);
};
