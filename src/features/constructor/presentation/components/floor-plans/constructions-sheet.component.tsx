import {
	APP_ROUTES,
	Button,
	DeleteIcon,
	DesigningTable,
	EditIcon,
	FormElementLabel,
	InfoIcon,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
} from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import type { ConstructionSheet } from '@features/constructor/types/constructions-sheet.types';
import { DESIGNING_ROUTES } from '@features/home/constants';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConstructionImage } from './construction-info-image.component';

export const ConstructionSheets = () => {
	const dispatch = useAppDispatch();
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const constructions = useAppSelector((store) => store.constructorData).constructionsSheet;

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
				cell: (info) => (
					<SimpleTableCell
						content={
							info.getValue() ? (
								<div className="h-[400px] w-[450px]">
									<img
										className="h-[400px] w-[450px] rounded-[18px] border-[3px] border-primary bg-white object-scale-down"
										src={info.getValue() as string}
										alt="floorPlanImage"
									/>
								</div>
							) : (
								<div className="h-[400px] w-[450px] rounded-[18px] border-[3px] border-primary bg-white"></div>
							)
						}
					/>
				),
			},
			{
				accessorKey: 'constructionInfoImage',
				header: () => <SimpleTableHeaderCell text="Конструкция" />,
				cell: (info) => (
					<SimpleTableCell
						content={
							<ConstructionImage
								id={info.row.original.constructionId}
								materials={info.row.original.materials}
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
	}, []);
	return (
		<div className="flex-col overflow-x-auto">
			<FormElementLabel className="font-[18px] text-primary">
				Ведомость конструкций
			</FormElementLabel>
			<DesigningTable
				classNames={{
					headerCellClassName: 'w-[50px]',
					contentRowClassName: 'max-w-[100px] w-fit',
				}}
				data={constructions || []}
				columns={columns}
			/>
		</div>
	);
};
