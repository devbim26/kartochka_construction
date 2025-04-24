import { DesigningTable, SimpleTableCell, SimpleTableHeaderCell, useAppNavigate } from '@core';
import type { SoundproofingStandarts } from '@features/constructor/types';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const dataSoundproofing: SoundproofingStandarts[] = [
	{
		soundproofing: 'Rw, dB',
		values: '123',
		requirements: '123',
	},
	{
		soundproofing: 'Rw, dB',
		values: '123',
		requirements: '123',
	},
];

export const GeneralInformationSoundproofing = () => {
	const navigate = useAppNavigate();
	const columns = useMemo(() => {
		const cols: ColumnDef<SoundproofingStandarts>[] = [
			{
				accessorKey: 'soundproofing',
				header: () => <SimpleTableHeaderCell text="Звукоизоляционные" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'values',
				header: () => <SimpleTableHeaderCell text="" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'requirements',
				header: () => <SimpleTableHeaderCell text="" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
		];
		return cols;
	}, []);
	return (
		<div className="flex-col">
			<DesigningTable data={dataSoundproofing} columns={columns} />
		</div>
	);
};
