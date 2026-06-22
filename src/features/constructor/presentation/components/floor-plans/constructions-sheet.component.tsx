import {
	APP_ROUTES,
	Button,
	DeleteIcon,
	DesigningTable,
	EditIcon,
	FormElementLabel,
	ImagePreviewModal,
	InfoIcon,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
	useI18n,
} from '@core';
import {
	CONSTRUCTOR_ROUTES,
	DESIGNING_CONTEXT_ROOM_VALUE,
	DESIGNING_CONTEXT_SEARCH_PARAM,
	ROOM_DESIGN_STUB_CONSTRUCTION_HEADER_ID,
} from '@features/constructor/constants';
import { ReportCategory } from '@features/constructor/types';
import type {
	AdditionalOpeningRow,
	ConstructionSheet,
} from '@features/constructor/types';
import type { ConstructionTypeEnum } from '@features/guidbooks/types';
import { EnConstructionTypesMap, RuConstructionTypesMap } from '@features/guidbooks/types';
import { DESIGNING_ROUTES } from '@features/home/constants';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConstructionImage } from './construction-info-image.component';

type Props = {
	constructionSheets?: ConstructionSheet[];
	/** Таблица помещений: без колонок «конструкция» и «конструкция содержит», колонка плана — «План». */
	tableVariant?: 'default' | 'rooms';
	/** Колонка SVG конструкции — только для отчёта с отдельными конструкциями (Single), не для поэтажных планов. */
	showConstructionSvgColumn?: boolean;
};

const MM2_PER_M2 = 1_000_000;

const sumAdditionalOpeningsAreaM2 = (rows?: AdditionalOpeningRow[]): number => {
	if (!rows?.length) return 0;
	return rows.reduce((total, row) => {
		const l = row.length || 0;
		const h = row.height || 0;
		const q = row.quantity || 0;
		return total + (l * h * q) / MM2_PER_M2;
	}, 0);
};

const formatAreaM2Number = (value: number, locale: string): string =>
	value.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', {
		maximumFractionDigits: 2,
		minimumFractionDigits: 0,
	});

export const ConstructionSheets = ({
	constructionSheets,
	tableVariant = 'default',
	showConstructionSvgColumn = true,
}: Props) => {
	const { t, locale } = useI18n();
	const navigate = useAppNavigate();
	const [search] = useSearchParams();

	const reportType = search.get('reportType');
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);

	const columns = useMemo(() => {
		const resolveRoomKindLabel = (raw: string) => {
			if (raw === 'RoomA') return t('floorPlans.roomKind.roomA');
			if (raw === 'RoomB') return t('floorPlans.roomKind.roomB');
			return raw;
		};

		const titleColumn: ColumnDef<ConstructionSheet> = {
			accessorKey: 'title',
			header: () => <SimpleTableHeaderCell text={t('constructionSheets.title')} />,
			cell: (info) => {
				const row = info.row.original;
				const typeLabel =
					tableVariant === 'rooms'
						? resolveRoomKindLabel(row.constructionType)
						: locale === 'ru'
							? RuConstructionTypesMap[row.constructionType as ConstructionTypeEnum]
							: EnConstructionTypesMap[row.constructionType as ConstructionTypeEnum];
				return (
					<SimpleTableCell
						contentClassName="w-[350px] text-[15px]"
						content={
							<div className="flex flex-col items-center gap-1 text-center font-sans text-[20px]">
								<div>
									<p className="font-semibold">{t('constructionSheets.title')}</p>
									<p>{info.getValue() as string}</p>
								</div>
								<div>
									<p className="font-semibold">{t('constructionSheets.type')}</p>
									<p>{typeLabel}</p>
								</div>
								<div>
									<p className="font-semibold">{t('constructionSheets.divides')}</p>
									<p>{row.constructionDivide}</p>
								</div>
							</div>
						}
					/>
				);
			},
		};

		const planColumn: ColumnDef<ConstructionSheet> = {
			accessorKey: 'floorPlanImage',
			header: () => (
				<SimpleTableHeaderCell
					text={
						tableVariant === 'rooms'
							? t('floorPlans.roomsTable.planColumn')
							: t('constructionSheets.plan')
					}
				/>
			),
			cell: (info) => {
				const src = info.getValue() as string;
				return (
					<SimpleTableCell
						content={
							src ? (
								<div
									className="h-[150px] w-[300px] cursor-pointer"
									onClick={() => setPreviewSrc(src)}
								>
									<img
										className="size-full rounded-[8px] border border-primary object-cover"
										src={src}
										alt="floorPlanPreview"
									/>
								</div>
							) : (
								<div className="h-[150px] w-[300px] rounded-[8px] border border-primary bg-white" />
							)
						}
					/>
				);
			},
		};

		const constructionImageColumn: ColumnDef<ConstructionSheet> = {
			accessorKey: 'constructionInfoImage',
			header: () => <SimpleTableHeaderCell text={t('constructionSheets.construction')} />,
			cell: (info) => (
				<SimpleTableCell
					content={
						<ConstructionImage
							id={info.row.original.constructionId}
							constructionHeaderId={info.row.original.constructionId}
						/>
					}
				/>
			),
		};

		const containsColumn: ColumnDef<ConstructionSheet> = {
			id: 'constructionContains',
			header: () => (
				<SimpleTableHeaderCell
					textClassName="min-w-[140px] max-w-[200px]"
					text={t('constructionSheets.constructionContains')}
				/>
			),
			cell: (info) => {
				const row = info.row.original;
				const windowsM2 = sumAdditionalOpeningsAreaM2(row.additionalWindows);
				const doorsM2 = sumAdditionalOpeningsAreaM2(row.additionalDoors);
				const unit = locale === 'ru' ? 'м²' : 'm²';
				return (
					<SimpleTableCell
						content={
							<div className="flex min-w-[140px] flex-col gap-1 text-center font-sans text-[16px] leading-snug">
								<p>
									{t('constructionSheets.openingsWindows')}:{' '}
									{formatAreaM2Number(windowsM2, locale)} {unit}
								</p>
								<p>
									{t('constructionSheets.openingsDoors')}:{' '}
									{formatAreaM2Number(doorsM2, locale)} {unit}
								</p>
							</div>
						}
					/>
				);
			},
		};

		const squareColumn: ColumnDef<ConstructionSheet> = {
			accessorKey: 'square',
			header: () => (
				<SimpleTableHeaderCell
					textClassName="w-[100px]"
					text={t('constructionSheets.area')}
				/>
			),
			cell: (info) => (
				<SimpleTableCell
					content={
						<div className="w-[100px] text-[20px] font-semibold">
							{info.getValue() as string}
						</div>
					}
				/>
			),
		};

		const actionsColumn: ColumnDef<ConstructionSheet> = {
			accessorKey: 'actions',
			header: () => <SimpleTableHeaderCell text={t('constructionSheets.actions')} />,
			cell: (info) => {
				const row = info.row.original;
				if (row.isRoomDesignStub) {
					const reportFloorInfoId =
						row.reportFloorInfoId || search.get('reportFloorInfoId') || '';
					return (
						<SimpleTableCell
							content={
								<div className="flex w-full flex-col gap-5">
									<div className="flex flex-col items-center gap-[5px] text-[20px]">
										<div className="flex w-full items-center gap-[10px]">
											<Button
												variant="primary"
												onClick={() =>
													navigate(
														APP_ROUTES.designing.route +
															'/' +
															DESIGNING_ROUTES.constructor.route +
															'/' +
															CONSTRUCTOR_ROUTES.designing.route,
														{
															reportId: search.get('reportId')!,
															reportType: search.get('reportType')!,
															constructionHeaderId:
																ROOM_DESIGN_STUB_CONSTRUCTION_HEADER_ID,
															reportFloorInfoId,
															[DESIGNING_CONTEXT_SEARCH_PARAM]:
																DESIGNING_CONTEXT_ROOM_VALUE,
														},
													)
												}
												className="h-[50px] w-[250px] p-[6px] text-[20px]"
											>
												{t('constructionSheets.designing')}
											</Button>{' '}
											<p className="text-[15px] font-semibold text-input-label-primary">
												{t('constructionSheets.designingHint')}
											</p>
										</div>
									</div>
								</div>
							}
						/>
					);
				}
				if (row.isStub) {
					return (
						<SimpleTableCell
							content={
								<p className="text-center font-sans text-[15px] text-gray-500">
									—
								</p>
							}
						/>
					);
				}
				return (
					<SimpleTableCell
						content={
							<div className="flex w-full flex-col gap-5">
								<div className="flex flex-col items-center gap-[5px] text-[20px]">
									<div className="flex w-full items-center gap-[10px]">
										<Button
											variant="primary"
											onClick={() =>
												navigate(
													APP_ROUTES.designing.route +
														'/' +
														DESIGNING_ROUTES.constructor.route +
														'/' +
														CONSTRUCTOR_ROUTES.designing.route,
													{
														reportId: search.get('reportId')!,
														reportType: search.get('reportType')!,
														constructionHeaderId:
															info.row.original.constructionId,
														reportFloorInfoId:
															info.row.original.reportFloorInfoId!,
													},
												)
											}
											className="h-[50px] w-[250px] p-[6px] text-[20px]"
										>
											{t('constructionSheets.designing')}
										</Button>{' '}
										<p className="text-[15px] font-semibold text-input-label-primary">
											{t('constructionSheets.designingHint')}
										</p>
									</div>
									<div className="flex w-full items-center gap-[10px]">
										<Button
											variant="primary"
											className="h-[50px] w-[250px] p-[6px] text-[20px]"
											onClick={() =>
												navigate(
													APP_ROUTES.designing.route +
														'/' +
														DESIGNING_ROUTES.constructor.route +
														'/' +
														CONSTRUCTOR_ROUTES.constructionSelect.route,
													{
														reportId: search.get('reportId')!,
														reportType: search.get('reportType')!,
														constructionHeaderId:
															info.row.original.constructionId,
														reportFloorInfoId:
															info.row.original.reportFloorInfoId!,
													},
												)
											}
										>
											{t('constructionSheets.selectFromCatalog')}
										</Button>
										<p className="text-[15px] font-semibold text-input-label-primary">
											{t('constructionSheets.selectFromCatalogHint')}
										</p>
									</div>
								</div>
								<div className="flex justify-between">
									<div className="flex w-full items-center gap-[5px] text-[20px]">
										<InfoIcon
											onClick={() => {
												reportType === ReportCategory.Floor
													? navigate('', {
															info: 'true',
															reportId: search.get('reportId')!,
															reportType: search.get('reportType')!,
															reportConstructionId: info.row.original.id,
															reportFloorInfoId:
																info.row.original.reportFloorInfoId!,
														})
													: navigate('', {
															info: 'true',
															reportId: search.get('reportId')!,
															reportType: search.get('reportType')!,
															reportConstructionId: info.row.original.id,
														});
											}}
										/>
										<p className="text-[15px] font-semibold text-input-label-primary">
											{t('constructionSheets.properties')}
										</p>
									</div>
									<div className="flex items-center gap-[10px]">
										<EditIcon
											onClick={() => {
												navigate('', {
													edit: 'true',
													reportId: search.get('reportId')!,
													reportType: search.get('reportType')!,
													reportFloorInfoId:
														info.row.original.reportFloorInfoId!,
												});
											}}
										/>
										<DeleteIcon
											onClick={() => {
												navigate('', {
													delete: 'true',
													constructionId: info.row.original.constructionId,
													reportType: search.get('reportType')!,
													reportId: search.get('reportId')!,
												});
											}}
										/>
									</div>
								</div>
							</div>
						}
					/>
				);
			},
		};

		if (tableVariant === 'rooms') {
			return [titleColumn, planColumn, squareColumn, actionsColumn];
		}
		const cols: ColumnDef<ConstructionSheet>[] = [titleColumn, planColumn];
		if (showConstructionSvgColumn) {
			cols.push(constructionImageColumn);
		}
		cols.push(containsColumn, squareColumn, actionsColumn);
		return cols;
	}, [t, locale, navigate, search, reportType, tableVariant, showConstructionSvgColumn]);

	return (
		<div className="flex-col overflow-x-auto">
			{previewSrc && (
				<ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />
			)}

			<FormElementLabel className="font-[18px] text-primary">
				{t('constructionSheets.sheetTitle')}
			</FormElementLabel>
			<DesigningTable
				classNames={{
					headerCellClassName: 'w-[50px]',
					contentRowClassName: 'max-w-[100px] w-fit',
				}}
				data={constructionSheets || []}
				columns={columns}
			/>
		</div>
	);
};
