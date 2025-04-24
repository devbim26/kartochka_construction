import {
	DesigningTable,
	FormElementLabel,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
} from '@core';
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
				header: () => <SimpleTableHeaderCell text="Физические" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'values',
				header: () => <SimpleTableHeaderCell text="Значения" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'requirements',
				header: () => <SimpleTableHeaderCell text="Требования" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
		];
		return cols;
	}, []);
	return (
		<div className="flex-col">
			<FormElementLabel className="font-[18px] text-primary">
				Соответствие нормам
			</FormElementLabel>
			<DesigningTable data={dataPhysical} columns={columns} />
		</div>
	);
};
