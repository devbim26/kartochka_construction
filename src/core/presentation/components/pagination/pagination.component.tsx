import { PaginationState } from '@core/types';
import { useCallback, useEffect, useState } from 'react';
import { PaginationButton } from './pagination-button.component';

interface PaginationProps {
	onChange: (pageNumber: number) => void;
	state: PaginationState;
}

export const Pagination = ({ onChange, state }: PaginationProps) => {
	const [viewedPages, setViewedPages] = useState<{ id: string; page: number }[]>([]);

	useEffect(() => {
		const partNum = Math.floor((state.pageNumber - 1) / 10);
		console.log(partNum);
		setViewedPages(
			Array.from({ length: 10 }, (_, index) => ({
				id: crypto.randomUUID(),
				page: partNum * 10 + (index + 1),
			})).filter((o) => o.page <= state.totalPages),
		);
	}, [state.pageNumber]);

	const prevPage = useCallback(() => {
		onChange(state.pageNumber - 1);
	}, [state.pageNumber]);

	const nextPage = useCallback(() => {
		onChange(state.pageNumber + 1);
	}, [state.pageNumber]);

	return (
		<div className="flex flex-row items-center justify-end gap-[24px] pr-[39px]">
			<div className="rounded-lg border-[1px] border-gray-border px-[10px] py-[4px] text-[14px] leading-[20px]">{`${state.pageNumber} страница`}</div>
			<div className="text-[14px] leading-[20px] tracking-[0.1px]">
				{viewedPages.length &&
					`${viewedPages[0].page}-${viewedPages[viewedPages.length - 1].page} из ${state.totalPages}`}
			</div>
			<div className="flex flex-row items-center gap-2">
				<PaginationButton
					type={'left'}
					clickHandle={prevPage}
					disabled={state.pageNumber === 1}
				/>
				{viewedPages.map((item) => (
					<PaginationButton
						key={item.id}
						selected={item.page === state.pageNumber}
						type={'page'}
						pageNumber={item.page}
						clickHandle={() => {
							onChange(item.page);
						}}
					/>
				))}
				<PaginationButton
					type={'right'}
					clickHandle={nextPage}
					disabled={state.pageNumber === state.totalPages}
				/>
			</div>
		</div>
	);
};
