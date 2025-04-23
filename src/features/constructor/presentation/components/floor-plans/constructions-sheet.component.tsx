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
} from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor/constants';
import type { ConstructionSheet } from '@features/constructor/types/constructions-sheet.types';
import { DESIGNING_ROUTES } from '@features/home/constants';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

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
							<div className="h-[150px] w-[200px] rounded-[18px] border-[3px] border-primary bg-white"></div>
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
												navigate('', { info: 'true' });
											}}
										/>
										<DeleteIcon
											onClick={() => {
												navigate('', { delete: 'true' });
											}}
										/>
									</div>
									<div className="flex justify-between">
										<EditIcon
											onClick={() => {
												navigate('', { edit: 'true' });
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
			<DesigningTable data={data} columns={columns} />
		</div>
	);
};
