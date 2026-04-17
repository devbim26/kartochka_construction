import type { PaginationState } from '@core';
import {
	APP_ROUTES,
	convertToPaginatedType,
	DeleteIcon,
	DownloadIcon,
	EditIcon,
	paginationStateDefault,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
	useAppSelector,
	useAccessValidator,
	UserRoles,
} from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { reportToClientConverter } from '@features/reports/converters';
import { deleteReport, getPaginatedReports } from '@features/reports/services';
import type { Report, ReportFilter } from '@features/reports/types';
import { getReportColumns } from '@features/reports/utils';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { ReportHeader, ReportListActionModal } from '../components';

export const ReportScreen = () => {
	const form = useForm<ReportFilter>({ defaultValues: { name: '', client: '' } });
	const { watch, getValues } = form;
	const [client, name] = watch(['client', 'name']);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);
	const [tableData, setTableData] = useState<Array<Report>>([]);
	const [search] = useSearchParams();
	const navigate = useAppNavigate();
	const { validate } = useAccessValidator();
	const isAdmin = validate(UserRoles.Admin);
	const userId = useAppSelector((state) => state.userData.data?.id);

	const handleGetTableData = (
		data: ReportFilter,
		pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
	) => {
		from(
			getPaginatedReports({
				data: {
					...data,
					userId: userId || null,
				},
				pagination,
			}),
		)
			.pipe(
				switchMap((response) => {
					const data = response.data;
					const totalPages = data.totalPages ?? 0;
					const pageNumber = pagination.pageNumber;
					const pageSize = pagination.pageSize;
					const hasPreviousPage = data.hasPreviousPage ?? pageNumber > 1;
					const hasNextPage =
						data.hasNextPage ?? (totalPages > 0 && pageNumber < totalPages);
					const res = convertToPaginatedType(reportToClientConverter)({
						items: data.items ?? [],
						pageNumber,
						totalPages,
						totalCount: data.totalCount ?? 0,
						pageSize,
						hasPreviousPage,
						hasNextPage,
					});
					return from([res]);
				}),
				tap((res) => {
					setTableData(res.items);
					setPaginationState(res.pagination);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || 'Ошибка загрузки отчетов');
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const handleDeleteTableData = (id: string) => {
		from(deleteReport(id))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(getValues(), paginationState);
					toast.success('Отчет успешно удален');
					navigate('');
				}
			});
	};

	const handleDownloadFile = () => {
		const report = tableData.find((report) => report.id === search.get('id'));
		if (report) {
			const link = document.createElement('a');
			link.href = report.fileUrl;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else {
			toast.error('Отчет не найден');
		}
	};

	useEffect(() => {
		handleGetTableData(getValues(), paginationState);
	}, [client, name, userId]);

	return (
		<div className="flex w-full flex-col gap-[40px]">
			<FormProvider {...form}>
				<ReportHeader isAdmin={isAdmin} />
			</FormProvider>
			<SimpleTable
				data={tableData}
				columns={[
					...getReportColumns(isAdmin),
					{
						id: 'actions',
						accessorKey: 'id',
						header: () => <SimpleTableHeaderCell text={'Действия'} />,
						cell: (info) => (
							<SimpleTableCell
								content={
									<div className="flex gap-2">
										<DownloadIcon
											onClick={() => {
												navigate('', {
													id: info.row.original.id,
													download: 'true',
												});
											}}
										/>
										<EditIcon
											onClick={() => {
												navigate('', {
													id: info.row.original.id,
													edit: 'true',
												});
											}}
										/>
										<DeleteIcon
											onClick={() => {
												navigate('', {
													id: info.row.original.id,
													delete: 'true',
												});
											}}
										/>
									</div>
								}
							/>
						),
					},
				]}
				paginationState={paginationState}
				onChangePaginationState={(newState) => {
					handleGetTableData(getValues(), newState);
				}}
			/>
			<ReportListActionModal
				onConfirm={() =>
					navigate(
						APP_ROUTES.designing.route +
							'/' +
							DESIGNING_ROUTES.constructor.route +
							'/' +
							CONSTRUCTOR_ROUTES.aboutBuilding.route,
						{ reportId: search.get('id')!, edit: 'true' },
					)
				}
				confirmTitle="Редактировать"
				headerTitle="Редактировать отчет?"
				onClose={() => navigate('')}
				isOpen={!!search.get('id') && !!search.get('edit')}
			/>
			<ReportListActionModal
				onConfirm={() => handleDeleteTableData(search.get('id')!)}
				confirmTitle="Удалить"
				headerTitle="Удалить отчет?"
				onClose={() => navigate('')}
				isOpen={!!search.get('id') && !!search.get('delete')}
			/>
			<ReportListActionModal
				onConfirm={handleDownloadFile}
				confirmTitle="Скачать"
				headerTitle="Скачать отчет?"
				onClose={() => navigate('')}
				isOpen={!!search.get('id') && !!search.get('download')}
			/>
		</div>
	);
};
