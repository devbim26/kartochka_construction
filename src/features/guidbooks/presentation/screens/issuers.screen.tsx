import type { IssuerDto } from '@api-gen';
import {
	convertToPaginatedType,
	DeleteIcon,
	DeleteModal,
	EditIcon,
	paginationStateDefault,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
	useI18n,
	type PaginationState,
} from '@core';
import { GuidbookPageHeaderWrapper, IssuersAddEdit, IssuersFilter } from '@features';
import {
	convertToClientIssuerData,
	convertToServerIssuerAddData,
	convertToServerIssuerEditData,
	convertToServerIssuerFilterData,
} from '@features/guidbooks/converters';
import {
	getGuidebooksCreate,
	getGuidebooksDelete,
	getGuidebooksDetail,
	getGuidebooksEdit,
	getGuidebooksPaginated,
} from '@features/guidbooks/services';
import {
	Guidebooks,
	RuCountryNamesMap,
	type Country,
	type Issuer,
} from '@features/guidbooks/types';
import {
	IssuersAddAndEditConfig,
	IssuersFilterConfig,
	useHeaderForm,
} from '@features/guidbooks/utils';
import type { ColumnDef } from '@tanstack/react-table';
import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';

const IssuersScreen = () => {
	const navigate = useAppNavigate();
	const { t } = useI18n();
	const [search] = useSearchParams();
	const [singleIssuer, setSingleIssuer] = useState<Issuer>();
	const [tableData, setTableData] = useState<Array<Issuer>>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [itemToDelete, setItemToDelete] = useState({
		id: '',
		name: '',
	});

	const form = useHeaderForm<Issuer>(
		{
			filter: IssuersFilterConfig.defaultValues,
			edit: IssuersAddAndEditConfig.defaultValues,
			add: IssuersAddAndEditConfig.defaultValues,
		},
		{
			filter: IssuersFilterConfig.schema,
			edit: IssuersAddAndEditConfig.schema,
			add: IssuersAddAndEditConfig.schema,
		},
	);

	const [filterName, filterCountry, filterWebSite] = form.filterForm.watch([
		'name',
		'countries',
		'webSite',
	]);

	useEffect(() => {
		if (search.get('edit') && search.get('entityId')) {
			handleGetOneTableData(search.get('entityId')!);
		}
	}, [search]);

	useEffect(() => {
		if (singleIssuer) form.editForm.reset(singleIssuer);
	}, [singleIssuer]);

	useEffect(() => {
		handleGetTableData(form.filterForm.getValues(), paginationState);
	}, [filterCountry, filterName, filterWebSite]);

	const handleGetTableData = (
		data: Issuer,
		pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
	) => {
		from(
			getGuidebooksPaginated({
				data: convertToServerIssuerFilterData(data),
				guidebookType: Guidebooks.ISSUER,
				pagination,
			}),
		)
			.pipe(
				switchMap((response: AxiosResponse) => {
					const res = convertToPaginatedType(convertToClientIssuerData)(
						response.data,
						pagination,
					);
					return from([res]);
				}),
				tap((res) => {
					setTableData(res.items);
					setPaginationState(res.pagination);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const handleAddTableData = (data: Issuer) => {
		from(
			getGuidebooksCreate({
				data: convertToServerIssuerAddData(data),
				guidebookType: Guidebooks.ISSUER,
			}),
		)
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
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success(t('guides.issuers.addSuccess'));
					navigate('');
				}
			});
	};

	const handleDeleteTableData = (id: string) => {
		from(getGuidebooksDelete({ data: { id: id }, guidebookType: Guidebooks.ISSUER }))
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
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success(t('guides.issuers.deleteSuccess'));
				}
			});
	};

	const handleEditTableData = (data: Issuer) => {
		from(
			getGuidebooksEdit({
				data: convertToServerIssuerEditData(data),
				guidebookType: Guidebooks.ISSUER,
			}),
		)
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
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success(t('guides.issuers.editSuccess'));
					navigate('');
				}
			});
	};

	const handleGetOneTableData = (id: string) => {
		from(getGuidebooksDetail({ id: id, guidebookType: Guidebooks.ISSUER }))
			.pipe(
				switchMap((response: AxiosResponse) => {
					const data = convertToClientIssuerData(response.data as IssuerDto);
					return from([data]);
				}),
				tap((data) => setSingleIssuer(data!)),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const onSaveHandle = useCallback(() => {
		handleAddTableData(form.addForm.getValues());
	}, [handleAddTableData, form.editForm.getValues()]);

	const onEditHandle = useCallback(() => {
		handleEditTableData(form.editForm.getValues());
	}, [handleEditTableData, form.editForm.getValues()]);

	const columns = useMemo(() => {
		const cols: ColumnDef<Issuer>[] = [
			{
				accessorKey: 'logoUrl',
				header: () => <SimpleTableHeaderCell text={t('guides.issuers.columns.logo')} />,
				cell: (info) => {
					return (
						<SimpleTableCell
							contentClassName="flex items-center size-[80px]"
							content={
								info.getValue() ? (
									<img
										src={info.getValue() as string}
										className="size-fit rounded-lg"
									/>
								) : (
									''
								)
							}
						/>
					);
				},
			},
			{
				accessorKey: 'name',
				header: () => <SimpleTableHeaderCell text={t('guides.issuers.columns.name')} />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'countries',
				header: () => <SimpleTableHeaderCell text={t('guides.issuers.columns.country')} />,
				cell: (info) => {
					return (
						<SimpleTableCell
							content={info.row.original.countries
								.map((ct) => RuCountryNamesMap[ct as Country])
								.join(', ')}
						/>
					);
				},
			},
			{
				accessorKey: 'webSite',
				header: () => <SimpleTableHeaderCell text={t('guides.issuers.columns.site')} />,
				cell: (info) => (
					<SimpleTableCell
						content={
							<a
								href={info.getValue() as string}
								target="_blank"
								style={{ color: 'blue', textDecoration: 'underline' }}
								rel="noreferrer"
							>
								{info.getValue() as string}
							</a>
						}
					/>
				),
			},
			{
				accessorKey: 'id',
				header: () => <SimpleTableHeaderCell text={t('guides.issuers.columns.actions')} />,
				cell: (info) => {
					return (
						<SimpleTableCell
							content={
								<div className="flex gap-2">
									<EditIcon
										onClick={() => {
											navigate('', {
												edit: 'true',
												entityId: info.row.original.id!,
											});
										}}
									/>
									<DeleteIcon
										onClick={() => {
											{
												setItemToDelete({
													id: info.row.original.id!,
													name: info.row.original.name!,
												});
											}
											setIsModalOpen(true);
										}}
									/>
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
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={search.get('add') ? onSaveHandle : onEditHandle}
				titles={{
					pageTitleKey: 'guides.issuers.pageTitle',
					editTitleKey: 'guides.issuers.editTitle',
					addTitleKey: 'guides.issuers.addTitle',
				}}
				forms={form}
				formElements={{
					filter: IssuersFilter,
					add: IssuersAddEdit,
					edit: IssuersAddEdit,
				}}
			/>
			<SimpleTable
				data={tableData}
				columns={columns}
				paginationState={paginationState}
				onChangePaginationState={(newState) => {
					setPaginationState((prev) => ({ ...prev, ...newState }));
					handleGetTableData(form.filterForm.getValues(), newState);
				}}
			/>
			<DeleteModal
				isOpen={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				onClose={() => setIsModalOpen(false)}
				onConfirm={() => {
					handleDeleteTableData(itemToDelete.id);
					setIsModalOpen(false);
				}}
				headerTitle={t('guides.deleteModal.title')}
			>
				{t('guides.deleteModal.issuerQuestion')} {itemToDelete.name}
			</DeleteModal>
		</div>
	);
};

export default IssuersScreen;
