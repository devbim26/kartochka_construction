import type { BaseReportInfoDto, BaseReportInfoDtoPaginatedList } from '@api-gen';
import { ReportCategory as ApiReportCategory } from '@api-gen';
import type { PaginationState } from '@core';
import {
	APP_ROUTES,
	Button,
	convertToPaginatedType,
	DeleteIcon,
	paginationStateDefault,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
	useI18n,
} from '@core';
import { CONSTRUCTOR_ROUTES } from '@features/constructor';
import { ReportCategory } from '@features/constructor/types';
import { DESIGNING_ROUTES } from '@features/home/constants';
import { deleteReportInfoById, getPaginatedReportInfos } from '@features/reports/services';
import type { ColumnDef } from '@tanstack/react-table';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { catchError, from, map, of } from 'rxjs';
import { toast } from 'sonner';
import { ReportListActionModal } from './report-list-action.modal';

const toConstructorReportType = (category?: ApiReportCategory): string => {
	if (category === ApiReportCategory.Single) return ReportCategory.Single;
	return ReportCategory.Floor;
};

const toPaginatedReportInfos = (
	data: BaseReportInfoDtoPaginatedList,
	pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
) => {
	const pageNumber = pagination.pageNumber;
	const pageSize = pagination.pageSize;
	const totalPages = data.totalPages ?? 0;
	const hasPreviousPage = data.hasPreviousPage ?? pageNumber > 1;
	const hasNextPage = data.hasNextPage ?? (totalPages > 0 && pageNumber < totalPages);
	return convertToPaginatedType((item: BaseReportInfoDto) => item)({
		items: data.items ?? [],
		pageNumber,
		totalPages,
		totalCount: data.totalCount ?? 0,
		pageSize,
		hasPreviousPage,
		hasNextPage,
	});
};

export const ActiveReportInfosPanel = () => {
	const { t } = useI18n();
	const navigate = useAppNavigate();
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);
	const [rows, setRows] = useState<BaseReportInfoDto[]>([]);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const categoryLabel = useCallback(
		(c?: ApiReportCategory) => {
			if (c === ApiReportCategory.Single) return t('reports.activeReports.categorySingle');
			if (c === ApiReportCategory.Floor) return t('reports.activeReports.categoryFloor');
			return '—';
		},
		[t],
	);

	const reportInfosQuery$ = useCallback(
		(pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>) =>
			from(getPaginatedReportInfos({ pagination })).pipe(
				map((response) => toPaginatedReportInfos(response.data, pagination)),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(
							(typeof error.response?.data === 'string' && error.response.data) ||
								t('reports.activeReports.loadError'),
						);
					} else {
						toast.error(t('reports.activeReports.loadError'));
					}
					return of(null);
				}),
			),
		[t],
	);

	useEffect(() => {
		let cancelled = false;
		const pagination = {
			pageNumber: paginationState.pageNumber,
			pageSize: paginationState.pageSize,
		};
		const sub = reportInfosQuery$(pagination).subscribe((res) => {
			if (cancelled || !res) return;
			setRows(res.items);
			setPaginationState(res.pagination);
		});
		return () => {
			cancelled = true;
			sub.unsubscribe();
		};
	}, [reportInfosQuery$, paginationState.pageNumber, paginationState.pageSize]);

	const openConstructor = (row: BaseReportInfoDto) => {
		const id = row.id;
		if (!id) return;
		const reportType = toConstructorReportType(row.reportCategory);
		navigate(
			`${APP_ROUTES.designing.route}/${DESIGNING_ROUTES.constructor.route}/${CONSTRUCTOR_ROUTES.aboutBuilding.route}`,
			{
				reportId: id,
				reportType,
				edit: 'true',
			},
		);
	};

	const confirmDelete = () => {
		if (!deleteId) return;
		from(deleteReportInfoById(deleteId))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(
							(typeof error.response?.data === 'string' && error.response.data) ||
								t('errors.request'),
						);
					} else {
						toast.error(t('errors.request'));
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200 || response?.status === 204) {
					toast.success(t('reports.activeReports.deleteSuccess'));
					setDeleteId(null);
					reportInfosQuery$({
						pageNumber: paginationState.pageNumber,
						pageSize: paginationState.pageSize,
					}).subscribe((res) => {
						if (!res) return;
						setRows(res.items);
						setPaginationState(res.pagination);
					});
				}
			});
	};

	const columns: ColumnDef<BaseReportInfoDto>[] = [
		{
			id: 'reportCategory',
			accessorKey: 'reportCategory',
			header: () => (
				<SimpleTableHeaderCell
					text={t('reports.activeReports.category')}
					textClassName="min-w-[160px]"
				/>
			),
			cell: (info) => (
				<SimpleTableCell
					content={categoryLabel(info.row.original.reportCategory)}
					contentClassName="min-w-[160px]"
				/>
			),
		},
		{
			id: 'id',
			accessorKey: 'id',
			header: () => (
				<SimpleTableHeaderCell
					text={t('reports.activeReports.reportId')}
					textClassName="min-w-[220px]"
				/>
			),
			cell: (info) => (
				<SimpleTableCell
					content={(info.getValue() as string) || '—'}
					contentClassName="min-w-[220px] max-w-[360px] truncate font-mono text-xs"
				/>
			),
		},
		{
			id: 'actions',
			accessorKey: 'id',
			meta: {
				thClassName: 'text-end',
				tdClassName: 'text-end align-top',
			},
			header: () => (
				<SimpleTableHeaderCell
					text={t('reports.activeReports.actions')}
					textClassName="min-w-[200px] w-full whitespace-nowrap text-end"
				/>
			),
			cell: (info) => (
				<SimpleTableCell
					content={
						<div className="flex w-full flex-wrap items-center justify-end gap-2">
							<Button
								type="button"
								variant="primary"
								className="h-8 shrink-0 px-3 text-xs font-semibold"
								onClick={() => openConstructor(info.row.original)}
							>
								{t('reports.activeReports.openConstructor')}
							</Button>
							<DeleteIcon
								withoutBg
								withoutBorder
								className="shrink-0 hover:opacity-80"
								onClick={() => {
									const id = info.row.original.id;
									if (id) setDeleteId(id);
								}}
							/>
						</div>
					}
					contentClassName="w-full min-w-[200px] text-end"
				/>
			),
		},
	];

	return (
		<div className="flex w-full flex-col gap-4">
			<p className="font-sans text-sm text-gray-600">{t('reports.activeReports.hint')}</p>
			<SimpleTable
				data={rows}
				columns={columns}
				paginationState={paginationState}
				onChangePaginationState={(next) => {
					setPaginationState((prev) => ({ ...prev, ...next }));
				}}
			/>
			<ReportListActionModal
				isOpen={!!deleteId}
				onClose={() => setDeleteId(null)}
				onConfirm={confirmDelete}
				confirmTitle={t('common.delete')}
				headerTitle={t('reports.activeReports.deleteTitle')}
				contentClassName="visible p-4"
			>
				{t('reports.activeReports.deleteConfirm')}
			</ReportListActionModal>
		</div>
	);
};
