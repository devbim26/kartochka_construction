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
	useAppNavigate,
	useAppSelector,
} from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import type { ConstructionSheet } from '@features/constructor/types/constructions-sheet.types';
import { DESIGNING_ROUTES } from '@features/home/constants';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const data: ConstructionSheet[] = [
	{
		title: 'Test',
		floorPlanImage: '123',
		constructionInfoImage: '123',
		square: '10',
	},
];

export const ConstructionSheets = () => {
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const constructions = useAppSelector((store) => store.constructorData).constructionsSheet;
	const columns = useMemo(() => {
		const cols: ColumnDef<ConstructionSheet>[] = [
			{
				accessorKey: 'title',
				header: () => <SimpleTableHeaderCell text="Название" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'floorPlanImage',
				header: () => <SimpleTableHeaderCell text="План" />,
				cell: (info) => (
					<SimpleTableCell
						content={
							<div className="h-[150px] w-[200px] rounded-[18px] border-[3px] border-primary bg-white">
								<img src={info.getValue() as string} alt="floorPlanImage" />
							</div>
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
							<div className="h-[150px] w-[360px] rounded-[18px] border-[3px] border-primary bg-white"></div>
						}
					/>
				),
			},
			{
				accessorKey: 'square',
				header: () => <SimpleTableHeaderCell text="Площадь, м²" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
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
													reportId: search.get('reportId')!,
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
		<div className="flex-col">
			<FormElementLabel className="font-[18px] text-primary">
				Ведомость конструкций
			</FormElementLabel>
			<DesigningTable data={constructions || []} columns={columns} />
		</div>
	);
};
