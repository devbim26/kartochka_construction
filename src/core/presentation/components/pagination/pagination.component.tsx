import { PaginationState } from '@core/types';
import { useCallback, useState } from 'react';
import { PaginationButton } from './pagination-button.component';

interface PaginationProps {
	onChange: (pageNumber: number) => void;
	state: PaginationState;
}

export const Pagination = ({ onChange, state }: PaginationProps) => {
	const [viewedPages, setViewedPages] = useState<number[]>([]);

	const prevPage = useCallback(() => {
		onChange(state.pageNumber - 1);
	}, [state.pageNumber]);

	const nextPage = useCallback(() => {
		onChange(state.pageNumber + 1);
	}, [state.pageNumber]);

	return (
		<div className="flex flex-row items-center gap-[24px]">
			<div className="px-[10px] py-[4px]">{`${state.pageNumber} страница`}</div>
			<div className="text-[14px] leading-[20px] tracking-[0.1px]">
				{`${viewedPages[0]}-${viewedPages[viewedPages.length - 1]} из ${state.totalPages}`}
			</div>
			<div className="flex flex-row items-center gap-2">
				<PaginationButton
					type={'left'}
					clickHandle={prevPage}
					disabled={state.pageNumber === 1}
				/>
				<PaginationButton
					type={'right'}
					clickHandle={nextPage}
					disabled={state.pageNumber === state.totalPages}
				/>
			</div>
		</div>
	);
};
