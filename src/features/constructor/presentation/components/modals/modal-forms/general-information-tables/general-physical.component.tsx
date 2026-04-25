import { DesigningTable, SimpleTableCell, SimpleTableHeaderCell, useI18n } from '@core';
import type { PhysicalStandarts } from '@features/constructor/types';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

const parseNumber = (value: unknown): number | null => {
	if (value === null || value === undefined || value === '') return null;
	const normalized = String(value).replace(',', '.');
	const num = Number(normalized);
	return Number.isFinite(num) ? num : null;
};

const formatRequirementRange = (min: number | null, max: number | null): string => {
	if (min !== null && max !== null) {
		return `${Math.round(min)}-${Math.round(max)}`;
	}
	if (min !== null) return `>=${Math.round(min)}`;
	if (max !== null) return `<=${Math.round(max)}`;
	return '-';
};

type Props = {
	data: PhysicalStandarts[];
};

export const GeneralInformationPhysical = ({ data }: Props) => {
	const { t } = useI18n();

	const columns = useMemo(() => {
		const cols: ColumnDef<PhysicalStandarts>[] = [
			{
				accessorKey: 'physical',
				header: () => (
					<SimpleTableHeaderCell
						text={t('physical.title')}
						textClassName="w-[200px] text-left"
					/>
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
					<SimpleTableHeaderCell
						text={t('physical.values')}
						textClassName="w-[100px] text-right"
					/>
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
						text={t('physical.requirements')}
						textClassName="w-[100px] text-right"
					/>
				),
				cell: (info) => {
					const requirement = info.getValue() as string;
					const requirementMin = info.row.original.requirementMin ?? null;
					const requirementMax = info.row.original.requirementMax ?? null;
					const hasRangeRequirement =
						requirementMin !== null || requirementMax !== null;

					const valueNum = parseNumber(info.row.original.values);
					const requirementNum = parseNumber(requirement);

					const isNoRequirement =
						(hasRangeRequirement && requirementMin === null && requirementMax === null) ||
						(!hasRangeRequirement && requirementNum === null);

					const requirementLabel = hasRangeRequirement
						? formatRequirementRange(requirementMin, requirementMax)
						: requirementNum !== null
							? Math.round(requirementNum).toString()
							: '-';

					const isMatch = hasRangeRequirement
						? valueNum !== null &&
							(requirementMin === null || valueNum >= requirementMin) &&
							(requirementMax === null || valueNum <= requirementMax)
						: requirementNum !== null && valueNum !== null && requirementNum >= valueNum;

					return (
						<SimpleTableCell
							content={
								<span className="flex items-center justify-end gap-[6px]">
									{requirementLabel}
									{!isNoRequirement &&
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
