import { Chevron } from '@core';
import type { ReportInfoShort } from '@features/constructor/utils';
import type { AlternateConstruction } from '@features/guidbooks/types';
import { AlternateConstructionCard } from './alternate-construction-card.component';

type Props = {
	alternateConstructions: AlternateConstruction[];
	reportInfo: ReportInfoShort;
	reportConstructionId: string | null;
	onSwapSuccess: (newConstructionHeaderId: string) => void;
	pageNumber: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export const AlternateConstructionList = ({
	alternateConstructions,
	reportInfo,
	reportConstructionId,
	onSwapSuccess,
	pageNumber,
	totalPages,
	onPageChange,
}: Props) => {
	const hasPrev = pageNumber > 1;
	const hasNext = pageNumber < totalPages;

	return (
		<div className="flex items-center gap-4">
			<Chevron
				direction="left"
				color={hasPrev ? 'primary' : 'grey'}
				disabled={!hasPrev}
				className="shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
				onClick={() => hasPrev && onPageChange(pageNumber - 1)}
			/>
			<div className="flex min-h-[200px] flex-1 gap-[10px]">
				{alternateConstructions.length > 0 ? (
					alternateConstructions.map((altConst) => (
						<AlternateConstructionCard
							key={altConst.id}
							construction={altConst}
							reportInfo={reportInfo}
							reportConstructionId={reportConstructionId}
							onSwapSuccess={onSwapSuccess}
						/>
					))
				) : (
					<div className="flex w-full items-center justify-center">
						<p className="font-sans text-sm text-gray-400">
							Альтернативные конструкции не найдены
						</p>
					</div>
				)}
			</div>
			<Chevron
				direction="right"
				color={hasNext ? 'primary' : 'grey'}
				disabled={!hasNext}
				className="shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
				onClick={() => hasNext && onPageChange(pageNumber + 1)}
			/>
		</div>
	);
};
