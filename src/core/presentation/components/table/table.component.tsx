import { PaginationState, TableColumn } from '@core/types';
import { memoize } from '@core/utils/hoc/memo.utils';
import { useState } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
import { twMerge } from 'tailwind-merge';
import { Pagination } from '../pagination';
import { TableHeader } from './table-header.component';
import { TableRow } from './table-row.component';

interface SimpleTableClassNames {
	headerClassName?: string;
	rowClassName?: string;
}

interface SimpleTableProps<T extends object> {
	classNames?: SimpleTableClassNames;
	data: Array<T>;
	columns: TableColumn<T>[];
	pageSize: number;
}

export const VTable = memoize(
	<T extends object>({ classNames, data, columns, pageSize }: SimpleTableProps<T>) => {
		const [paginationState, setPaginationState] = useState<PaginationState>({
			pageNumber: 1,
			pageSize: pageSize,
			totalPages: 21,
			totalCount: 21,
		});

		const rowGetter = ({ index }: { index: number }) => data[index];

		return (
			<div className="flex h-fit flex-col gap-[30px] rounded-xl bg-white pb-[30px]">
				<AutoSizer disableHeight>
					{({ width }) => (
						<Table
							height={490}
							rowHeight={48}
							width={width}
							headerHeight={48}
							rowCount={paginationState.pageSize}
							headerRowRenderer={(props) => (
								<TableHeader
									{...props}
									headerClassName={twMerge(
										'bg-[#F5F6F7] rounded-t-xl',
										classNames?.headerClassName,
									)}
								/>
							)}
							rowRenderer={(props) => (
								<TableRow
									{...props}
									key={props.key}
									rowClassName={twMerge(
										'bg-none border-b-[1px] border-b-[#EDEFF2] overflow-x-auto',
										classNames?.rowClassName,
									)}
								/>
							)}
							rowGetter={rowGetter}
						>
							{columns.map((column) => (
								<Column key={String(column.dataKey)} {...column} />
							))}
						</Table>
					)}
				</AutoSizer>
				<Pagination
					onChange={(page) => {
						setPaginationState((curr) => ({ ...curr, pageNumber: page }));
					}}
					state={paginationState}
				/>
			</div>
		);
	},
	'SimpleTable',
);
