import type { PaginationState } from '@core';
import {
	convertToPaginatedType,
	DeleteIcon,
	DownloadIcon,
	paginationStateDefault,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
} from '@core';
import { convertBillToClient } from '@features/bills/converters';
import { getPaginatedBills } from '@features/bills/services';
import type { Bill, BillFilter } from '@features/bills/types';
import { billColumns } from '@features/bills/utils';
import { deleteReport } from '@features/reports/services';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { BillHeader, BillListActionModal } from '../components';

export const BillScreen = () => {
	const form = useForm<BillFilter>({
		defaultValues: { number: '', date: '', clientName: '', billType: undefined },
	});
	const { watch, getValues } = form;
	const [number, date, clientName, billType] = watch([
		'number',
		'date',
		'clientName',
		'billType',
	]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);
	const [tableData, setTableData] = useState<Array<Bill>>([]);
	const [search] = useSearchParams();
	const navigate = useAppNavigate();

	const handleGetTableData = (
		data: BillFilter,
		pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
	) => {
		from(
			getPaginatedBills({
				data,
				pagination,
			}),
		)
			.pipe(
				switchMap((response) => {
					const res = convertToPaginatedType(convertBillToClient)({
						items: response.data.items ?? [],
						pageNumber: response.data.pageNumber ?? 1,
						totalPages: response.data.totalPages ?? 0,
						totalCount: response.data.totalCount ?? 0,
						pageSize: response.data.pageSize ?? 10,
						hasPreviousPage: false,
						hasNextPage: false,
					});
					return from([res]);
				}),
				tap((res) => {
					setTableData(res.items);
					setPaginationState(res.pagination);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data?.message || 'Ошибка загрузки счетов');
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
	}, [number, date, clientName, billType]);

	return (
		<div className="flex w-full flex-col gap-[40px]">
			<FormProvider {...form}>
				<BillHeader />
			</FormProvider>{' '}
			<SimpleTable
				data={tableData}
				columns={[
					...billColumns,
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
			<BillListActionModal
				onConfirm={() => handleDeleteTableData(search.get('id')!)}
				confirmTitle="Удалить"
				headerTitle="Удалить отчет?"
				onClose={() => navigate('')}
				isOpen={!!search.get('id') && !!search.get('delete')}
			/>
			<BillListActionModal
				onConfirm={handleDownloadFile}
				confirmTitle="Скачать"
				headerTitle="Скачать отчет?"
				onClose={() => navigate('')}
				isOpen={!!search.get('id') && !!search.get('download')}
			/>
		</div>
	);
};
