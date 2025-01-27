import { TableColumn } from '@core/types';
import { memoize } from '@core/utils/hoc/memo.utils';
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
}

export const VTable = memoize(
	<T extends object>({ classNames, data, columns }: SimpleTableProps<T>) => {
		const rowGetter = ({ index }: { index: number }) => data[index];

		return (
			<div className="flex flex-1 flex-col">
				<AutoSizer disableHeight>
					{({ width }) => (
						<Table
							height={350}
							rowHeight={48}
							width={width}
							headerHeight={48}
							rowCount={data.length}
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
									rowClassName={twMerge(
										'bg-white border-b-[1px] border-b-[#EDEFF2] overflow-x-auto',
										classNames?.rowClassName,
									)}
								/>
							)}
							rowGetter={rowGetter}
						>
							{columns.map((column) => (
								<Column key={String(column.id)} {...column} />
							))}
						</Table>
					)}
				</AutoSizer>
				<Pagination
					onChange={() => {}}
					state={{
						pageNumber: 1,
						pageSize: 10,
						totalPages: 99,
						totalCount: 10,
					}}
				/>
			</div>
		);
	},
	'SimpleTable',
);
