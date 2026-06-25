import { DesigningTable, SimpleTableCell, SimpleTableHeaderCell, useI18n } from '@core';
import type { SoundproofingStandarts } from '@features/constructor/types';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const parseNumber = (value: unknown): number | null => {
	if (value === null || value === undefined || value === '') return null;
	const normalized = String(value).replace(',', '.');
	const num = Number(normalized);
	return Number.isFinite(num) ? num : null;
};

type Props = {
	data: SoundproofingStandarts[];
	/** When set, the label in the first column is clickable (e.g. open lab-test graph). */
	onSoundproofingLabelClick?: () => void;
};

export const GeneralInformationSoundproofing = ({
	data,
	onSoundproofingLabelClick,
}: Props) => {
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
					const labelNode = onSoundproofingLabelClick ? (
						<button
							type="button"
							className="relative left-[-10px] inline cursor-pointer border-0 bg-transparent p-0 font-inherit italic text-blue-500 underline"
							onClick={onSoundproofingLabelClick}
						>
							{row.label}
						</button>
					) : (
						<p className="relative left-[-10px] inline italic text-blue-500 underline">
							{row.label}
						</p>
					);
					return (
						<SimpleTableCell
							content={
								<div className="w-[200px]">
									{labelNode}
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

					const valueNum = parseNumber(value);
					const requirementNum = parseNumber(requirement);

					const isDash =
						requirement === '-' ||
						value === '-' ||
						valueNum === null ||
						requirementNum === null;
					const roundedRequirement = isDash ? '-' : Math.round(requirementNum).toString();
					const isMatch = !isDash && valueNum >= requirementNum;

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
	}, [t, onSoundproofingLabelClick]);

	return (
		<div className="flex-col">
			<DesigningTable data={data} columns={columns} />
		</div>
	);
};
