import type { PaginationState } from '@core/types';
import { memoize } from '@core/utils';
import { useCallback, useEffect, useState } from 'react';
import { Select, SelectOption } from '../select';
import { PaginationButton } from './pagination-button.component';

export const pageSizeSelectOptions: SelectOption[] = [
	{ label: '10 строк', value: 10 },
	{ label: '25 строк', value: 25 },
	{ label: '50 строк', value: 50 },
];

interface PaginationProps {
	onPageChange: (pageNumber: number) => void;
	onPageSizeChange: (count: number) => void;
	state: PaginationState;
}

export const Pagination = memoize(({ onPageChange, state, onPageSizeChange }: PaginationProps) => {
	const [viewedPages, setViewedPages] = useState<{ id: string; page: number }[]>([]);

	useEffect(() => {
		const partNum = Math.floor(state.pageNumber / 10);
		setViewedPages(
			Array.from({ length: 10 }, (_, index) => ({
				id: crypto.randomUUID(),
				page: partNum * 10 + (index + 1),
			})).filter((o) => o.page <= state.totalPages),
		);
	}, [state.pageNumber, state.totalPages]);

	const prevPage = useCallback(() => {
		onPageChange(state.pageNumber - 1);
	}, [state.pageNumber]);

	const nextPage = useCallback(() => {
		onPageChange(state.pageNumber + 1);
	}, [state.pageNumber]);

	return (
		<div className="flex flex-row items-center justify-end gap-[24px] pr-[39px]">
			<Select
				value={state.pageSize}
				options={pageSizeSelectOptions}
				onChange={(value) => value && onPageSizeChange(Number(value))}
			/>
			<div className="text-[14px] leading-[20px] tracking-[0.1px]">
				{viewedPages.length &&
					`${viewedPages[0].page}-${viewedPages[viewedPages.length - 1].page} из ${state.totalPages}`}
			</div>
			<div className="flex flex-row items-center gap-2">
				<PaginationButton
					type={'left'}
					clickHandle={prevPage}
					disabled={!state.hasPreviousPage}
				/>
				{viewedPages.map((item) => (
					<PaginationButton
						key={item.id}
						selected={item.page === state.pageNumber}
						type={'page'}
						pageNumber={item.page}
						clickHandle={() => {
							onPageChange(item.page);
						}}
					/>
				))}
				<PaginationButton
					type={'right'}
					clickHandle={nextPage}
					disabled={!state.hasNextPage}
				/>
			</div>
		</div>
	);
}, 'Pagination');
