import type { PaginationState } from '@core/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Select, type SelectOption } from '../select';
import { PaginationButton } from './pagination-button.component';

export const pageSizeSelectOptions: SelectOption[] = [
	{ label: '5 строк', value: 5 },
	{ label: '10 строк', value: 10 },
	{ label: '20 строк', value: 20 },
	{ label: '50 строк', value: 50 },
];

interface PaginationProps {
	onPageChange: (pageNumber: number) => void;
	onPageSizeChange: (count: number) => void;
	state: PaginationState;
}

/** Диапазон строк текущей страницы: A–B из N (pageNumber / pageSize / totalCount). */
export const getPaginationRowRangeLabel = (
	state: Pick<PaginationState, 'pageNumber' | 'pageSize' | 'totalCount'>,
): string => {
	const pageNumber = Math.max(Number(state.pageNumber) || 1, 1);
	const pageSize = Math.max(Number(state.pageSize) || 10, 1);
	const totalCount = Math.max(Number(state.totalCount) || 0, 0);
	const rangeStart = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
	const rangeEnd = Math.min(pageNumber * pageSize, totalCount);
	return `${rangeStart}-${rangeEnd} из ${totalCount}`;
};

export const Pagination = ({ onPageChange, state, onPageSizeChange }: PaginationProps) => {
	const [viewedPages, setViewedPages] = useState<{ id: string; page: number }[]>([]);

	useEffect(() => {
		const partNum = Math.floor((Math.max(state.pageNumber, 1) - 1) / 10);
		setViewedPages(
			Array.from({ length: 10 }, (_, index) => ({
				id: crypto.randomUUID(),
				page: partNum * 10 + (index + 1),
			})).filter((o) => o.page <= state.totalPages && o.page >= 1),
		);
	}, [state.pageNumber, state.totalPages]);

	const rowRangeLabel = useMemo(() => getPaginationRowRangeLabel(state), [state]);

	const prevPage = useCallback(() => {
		onPageChange(state.pageNumber - 1);
	}, [onPageChange, state.pageNumber]);

	const nextPage = useCallback(() => {
		onPageChange(state.pageNumber + 1);
	}, [onPageChange, state.pageNumber]);

	return (
		<div className="flex flex-row items-center justify-end gap-[24px] pr-[39px]">
			<Select
				value={Number(state.pageSize) || 10}
				options={pageSizeSelectOptions}
				disableDefaultValue
				wrapperClassname="w-[130px] shrink-0"
				buttonClassName="w-[130px]"
				onChange={(value) => {
					if (value === '' || value == null) return;
					onPageSizeChange(Number(value));
				}}
			/>
			<div className="text-[14px] leading-[20px] tracking-[0.1px]">{rowRangeLabel}</div>
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
};
