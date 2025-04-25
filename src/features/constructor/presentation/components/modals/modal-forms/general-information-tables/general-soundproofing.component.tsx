import { DesigningTable, SimpleTableCell, SimpleTableHeaderCell } from '@core';
import type { SoundproofingStandarts } from '@features/constructor/types';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const dataSoundproofing: SoundproofingStandarts[] = [
	{
		label: 'Расчёт',
		soundproofing: 'Rw, dB',
		values: '45',
		requirements: '450',
	},
	{
		label: 'Лаб.тест',
		soundproofing: 'Rw, dB',
		values: '43',
		requirements: '430',
	},
];

export const GeneralInformationSoundproofing = () => {
	const columns = useMemo(() => {
		const cols: ColumnDef<SoundproofingStandarts>[] = [
			{
				accessorKey: 'soundproofing',
				header: () => (
					<SimpleTableHeaderCell
						text="Звукоизоляционные"
						textClassName="w-[200px] text-left"
					/>
				),
				cell: (info) => {
					const row = info.row.original as SoundproofingStandarts;
					return (
						<SimpleTableCell
							content={
								<div className="w-[200px]">
									<p className="relative left-[-10px] inline italic text-blue-500 underline">
										{row.label}
									</p>
									<p className="inline">{row.soundproofing}</p>
								</div>
							}
						/>
					);
				},
			},
			{
				accessorKey: 'values',
				header: () => (
					<SimpleTableHeaderCell text="" textClassName="w-[100px] text-right" />
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
					<SimpleTableHeaderCell text="" textClassName="w-[100px] text-right" />
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
			<DesigningTable data={dataSoundproofing} columns={columns} />
		</div>
	);
};
