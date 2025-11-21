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
import { ReportCategory } from '@features/constructor/types';
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

	const reportType = search.get('reportType');
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);

	const columns = useMemo(() => {
		const cols: ColumnDef<ConstructionSheet>[] = [
			{
				accessorKey: 'title',
				header: () => <SimpleTableHeaderCell text="Название" />,
				cell: (info) => (
					<SimpleTableCell
						contentClassName="w-[350px] text-[15px]"
						content={
							<div className="flex flex-col items-center gap-1 text-center font-sans text-[20px]">
								<div>
									<p className="font-semibold">Название</p>
									<p>{info.getValue() as string}</p>
								</div>
								<div>
									<p className="font-semibold">Тип</p>
									<p>{info.row.original.constructionType}</p>
								</div>
								<div>
									<p className="font-semibold">Разделяет</p>
									<p>{info.row.original.constructionDivide}</p>
								</div>
							</div>
						}
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
				header: () => <SimpleTableHeaderCell textClassName="w-[100px]" text="Площадь,м²" />,
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
				header: () => <SimpleTableHeaderCell text="Действия" />,
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
														},
													)
												}
												className="h-[50px] w-[250px] p-[6px] text-[20px]"
											>
												Проектирование
											</Button>{' '}
											<p className="text-[15px] font-semibold text-input-label-primary">
												Расчет звукоизоляции конструкции
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
												Выбор из каталога
											</Button>
											<p className="text-[15px] font-semibold text-input-label-primary">
												Выбор из каталога производителей
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
												Свойства конструкции
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
