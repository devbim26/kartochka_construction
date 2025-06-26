import type { ConstructionType, ConstructionTypeEnum } from '@features/guidbooks/types';
import { RuConstructionTypesMap } from '@features/guidbooks/types';

type Props = {
	construction: ConstructionType;
};

export const AlternateConstructionCard = ({ construction }: Props) => {
	return (
		<div className="flex w-1/2 flex-col gap-[30px] rounded-xl bg-white px-[30px] py-[25px]">
			<p className="font-sans text-lg font-semibold leading-4 text-black">
				{RuConstructionTypesMap[construction.constructionTypeEnum as ConstructionTypeEnum]}
			</p>
		</div>
	);
};
