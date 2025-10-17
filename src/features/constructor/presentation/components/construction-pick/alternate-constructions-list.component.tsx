import type { AlternateConstruction } from '@features/guidbooks/types';
import { AlternateConstructionCard } from './alternate-construction-card.component';

type Props = {
	alternateConstructions: AlternateConstruction[];
};

export const AlternateConstructionList = ({ alternateConstructions }: Props) => {
	return (
		<div className="flex h-fit w-full gap-[10px]">
			{alternateConstructions.map((altConst) => (
				<>
					<AlternateConstructionCard construction={altConst} />
				</>
			))}
		</div>
	);
};
