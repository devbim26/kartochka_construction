import { DesigningTable, SimpleTableCell, SimpleTableHeaderCell, useAppNavigate } from '@core';
import type { PhysicalStandarts } from '@features/constructor/types';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const dataPhysical: PhysicalStandarts[] = [
	{
		physical: 'Толщина, мм',
		values: '123',
		requirements: '123',
	},
	{
		physical: 'Масса, кг/м²',
		values: '123',
		requirements: '123',
	},
	{
		physical: 'Высота, м',
		values: '123',
		requirements: '123',
	},
];

export const GeneralInformationPhysical = () => {
	const navigate = useAppNavigate();
	const columns = useMemo(() => {
		const cols: ColumnDef<PhysicalStandarts>[] = [
			{
				accessorKey: 'physical',
				header: () => (
					<SimpleTableHeaderCell text="Физические" textClassName="w-[200px] text-left" />
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[200px]"
					/>
				),
			},
			{
				accessorKey: 'values',
				header: () => (
					<SimpleTableHeaderCell text="Значения" textClassName="w-[100px] text-right" />
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[100px]"
					/>
				),
			},
			{
				accessorKey: 'requirements',
				header: () => (
					<SimpleTableHeaderCell text="Требования" textClassName="w-[100px] text-right" />
				),
				cell: (info) => (
					<SimpleTableCell
						content={info.getValue() as string}
						contentClassName="w-[100px]"
					/>
				),
			},
		];
		return cols;
	}, []);
	return (
		<div className="flex-col">
			<DesigningTable
				data={dataPhysical}
				columns={columns}
				classNames={{
					tableContainerClassName: 'w-[400px]',
				}}
			/>
		</div>
	);
};
