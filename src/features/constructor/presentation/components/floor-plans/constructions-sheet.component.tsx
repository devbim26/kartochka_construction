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
	useAppDispatch,
	useAppNavigate,
	useI18n,
} from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import { ReportCategory } from '@features/constructor/types';
import type { ConstructionSheet } from '@features/constructor/types/constructions-sheet.types';
import type { ConstructionTypeEnum } from '@features/guidbooks/types';
import { EnConstructionTypesMap, RuConstructionTypesMap } from '@features/guidbooks/types';
import { DESIGNING_ROUTES } from '@features/home/constants';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConstructionImage } from './construction-info-image.component';

type Props = {
	constructionSheets?: ConstructionSheet[];
	reportFloorInfoId?: string;
};

export const ConstructionSheets = ({ constructionSheets, reportFloorInfoId }: Props) => {
	const { t, locale } = useI18n();
	const dispatch = useAppDispatch();
	const navigate = useAppNavigate();
	const [search] = useSearchParams();

	const reportType = search.get('reportType');
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);

	const columns = useMemo(() => {
		const cols: ColumnDef<ConstructionSheet>[] = [
			{
				accessorKey: 'title',
				header: () => <SimpleTableHeaderCell text={t('constructionSheets.title')} />,
				cell: (info) => (
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
									<p>
										{locale === 'ru'
											? RuConstructionTypesMap[
													info.row.original
														.constructionType as ConstructionTypeEnum
												]
											: EnConstructionTypesMap[
													info.row.original
														.constructionType as ConstructionTypeEnum
												]}
									</p>
								</div>
								<div>
									<p className="font-semibold">
										{t('constructionSheets.divides')}
									</p>
									<p>{info.row.original.constructionDivide}</p>
								</div>
							</div>
						}
					/>
				),
			},
			{
				accessorKey: 'floorPlanImage',
				header: () => <SimpleTableHeaderCell text={t('constructionSheets.plan')} />,
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
			},
			{
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
			},
			{
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
			},
			{
				accessorKey: 'actions',
				header: () => <SimpleTableHeaderCell text={t('constructionSheets.actions')} />,
				cell: (info) => {
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
															reportFloorInfoId: reportFloorInfoId!,
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
															CONSTRUCTOR_ROUTES.constructionSelect
																.route,
														{
															reportId: search.get('reportId')!,
															reportType: search.get('reportType')!,
															constructionHeaderId:
																info.row.original.constructionId,
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
																reportType:
																	search.get('reportType')!,
																reportFloorInfoId:
																	reportFloorInfoId!,
															})
														: navigate('', {
																info: 'true',
																reportId: search.get('reportId')!,
																reportType:
																	search.get('reportType')!,
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
													});
												}}
											/>
											<DeleteIcon
												onClick={() => {
													navigate('', {
														delete: 'true',
														constructionId:
															info.row.original.constructionId,
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
			},
		];
		return cols;
	}, [reportFloorInfoId, t, navigate, search, reportType]);

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
