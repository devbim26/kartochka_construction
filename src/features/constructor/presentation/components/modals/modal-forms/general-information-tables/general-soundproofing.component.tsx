import { DesigningTable, SimpleTableCell, SimpleTableHeaderCell, useI18n } from '@core';
import type { SoundproofingStandarts } from '@features/constructor/types';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

type Props = {
	data: SoundproofingStandarts[];
};

export const GeneralInformationSoundproofing = ({ data }: Props) => {
	const { t } = useI18n();

	const columns = useMemo(() => {
		const cols: ColumnDef<SoundproofingStandarts>[] = [
			{
				accessorKey: 'soundproofing',
				header: () => (
					<SimpleTableHeaderCell
						text={t('soundproofing.title')}
						textClassName="w-[200px] text-left"
					/>
				),
				cell: (info) => {
					const row = info.row.original;
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
				cell: (info) => {
					const value = info.getValue() as string;
					const rounded = value === '-' ? '-' : Math.round(+value).toString();
					return <SimpleTableCell content={rounded} contentClassName="w-[100px]" />;
				},
			},
			{
				accessorKey: 'requirements',
				header: () => (
					<SimpleTableHeaderCell
						text={t('soundproofing.requirements')}
						textClassName="w-[100px] text-right"
					/>
				),
				cell: (info) => {
					const requirement = info.getValue() as string;
					const value = info.row.original.values;

					const isDash = requirement === '-' || value === '-';
					const roundedRequirement = isDash ? '-' : Math.round(+requirement).toString();
					const isMatch = !isDash && +requirement >= +value;

					return (
						<SimpleTableCell
							content={
								<span className="flex items-center justify-end gap-[6px]">
									{roundedRequirement}
									{!isDash &&
										(isMatch ? (
											<span className="text-green-600">✔</span>
										) : (
											<span className="text-error">✘</span>
										))}
								</span>
							}
							contentClassName="w-[100px]"
						/>
					);
				},
			},
		];
		return cols;
	}, [t]);

	return (
		<div className="flex-col">
			<DesigningTable data={data} columns={columns} />
		</div>
	);
};
