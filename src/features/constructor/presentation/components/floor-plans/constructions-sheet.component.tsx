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
} from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import type { ConstructionSheet } from '@features/constructor/types/constructions-sheet.types';
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
	const dispatch = useAppDispatch();
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);

	const columns = useMemo(() => {
		const cols: ColumnDef<ConstructionSheet>[] = [
			{
				accessorKey: 'title',
				header: () => <SimpleTableHeaderCell text="Название" />,
				cell: (info) => (
					<SimpleTableCell
						contentClassName="max-w-[150px]"
						content={<div className="max-w-[150px]">{info.getValue() as string}</div>}
					/>
				),
			},
			{
				accessorKey: 'floorPlanImage',
				header: () => <SimpleTableHeaderCell text="План" />,
				cell: (info) => {
					const src = info.getValue() as string;
					return (
						<SimpleTableCell
							content={
								src ? (
									<div
										className="h-[150px] w-[200px] cursor-pointer"
										onClick={() => setPreviewSrc(src)}
									>
										<img
											className="size-full rounded-[8px] border border-primary object-cover"
											src={src}
											alt="floorPlanPreview"
										/>
									</div>
								) : (
									<div className="h-[100px] w-[120px] rounded-[8px] border border-primary bg-white" />
								)
							}
						/>
					);
				},
			},
			{
				accessorKey: 'constructionInfoImage',
				header: () => <SimpleTableHeaderCell text="Конструкция" />,
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
				header: () => <SimpleTableHeaderCell text="Площадь, м²" />,
				cell: (info) => (
					<SimpleTableCell
						content={<div className="w-fit">{info.getValue() as string}</div>}
					/>
				),
			},
			{
				accessorKey: 'actions',
				header: () => <SimpleTableHeaderCell text="Действия" />,
				cell: (info) => {
					return (
						<SimpleTableCell
							content={
								<div className="flex w-[150px] flex-col gap-5">
									<div className="flex justify-between">
										<InfoIcon
											onClick={() => {
												navigate('', {
													info: 'true',
													reportId: search.get('reportId')!,
													reportType: search.get('reportType')!,
													reportFloorInfoId: reportFloorInfoId!,
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
									<div className="flex justify-between">
										<EditIcon
											onClick={() => {
												navigate('', {
													edit: 'true',
													reportId: search.get('reportId')!,
													reportType: search.get('reportType')!,
												});
											}}
										/>
									</div>
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
												},
											)
										}
										className="p-[6px]"
									>
										Проектирование
									</Button>
									<Button
										variant="primary"
										className="p-[6px]"
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
												},
											)
										}
									>
										Выбор из каталога
									</Button>
								</div>
							}
						/>
					);
				},
			},
		];
		return cols;
	}, [reportFloorInfoId]);
	return (
		<div className="flex-col overflow-x-auto">
			{previewSrc && (
				<ImagePreviewModal src={previewSrc} onClose={() => setPreviewSrc(null)} />
			)}

			<FormElementLabel className="font-[18px] text-primary">
				Ведомость конструкций
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
