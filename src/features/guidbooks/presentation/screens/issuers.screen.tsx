import type { IssuerDto } from '@api-gen';
import {
	convertToPaginatedType,
	DeleteIcon,
	EditIcon,
	paginationStateDefault,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
	type PaginationState,
} from '@core';
import {
	convertToClientIssuerData,
	convertToServerIssuerData,
} from '@features/guidbooks/converters';
import {
	getGuidebooksCreate,
	getGuidebooksDelete,
	getGuidebooksDetail,
	getGuidebooksEdit,
	getGuidebooksPaginated,
} from '@features/guidbooks/services';
import type { Country, Issuer } from '@features/guidbooks/types';
import { Guidebooks, RuCountryNamesMap } from '@features/guidbooks/types';
import type { ColumnDef } from '@tanstack/react-table';
import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { IssuersDataConfig, IssuersFormCofig, useHeaderForm } from '../../utils';
import { GuidbookPageHeaderWrapper } from '../components';
import { IssuersAddEdit, IssuersFilter } from '../components/header/forms/issuers';

const IssuersScreen = () => {
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const [singleIssuer, setSingleIssuer] = useState<Issuer>();
	const [tableData, setTableData] = useState<Array<Issuer>>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);

	const form = useHeaderForm<Issuer>(
		{
			filter: IssuersDataConfig.defaultValues,
			edit: IssuersFormCofig.defaultValues,
			add: IssuersFormCofig.defaultValues,
		},
		{
			filter: IssuersDataConfig.schema,
			edit: IssuersFormCofig.schema,
			add: IssuersFormCofig.schema,
		},
	);

	const [filterName, filterCountry, filterWebSite] = form.filterForm.watch([
		'name',
		'country',
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
				data: convertToServerIssuerData(data),
				guidebookType: Guidebooks.ISSUER,
				pagination,
			}),
		)
			.pipe(
				switchMap((response: AxiosResponse) => {
					const res = convertToPaginatedType(convertToClientIssuerData)(response.data);
					return from([res]);
				}),
				tap((res) => {
					setTableData(res.items);
					setPaginationState(res.pagination);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data.message);
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const handleAddTableData = (data: Issuer) => {
		from(
			getGuidebooksCreate({
				data: convertToServerIssuerData(data),
				guidebookType: Guidebooks.ISSUER,
			}),
		)
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data.message);
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success('Производитель успешно добавлен');
				}
			});
	};

	const handleDeleteTableData = (id: string) => {
		from(getGuidebooksDetail({ id: id, guidebookType: Guidebooks.ISSUER }))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data.message);
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success('Производитель успешно удалён');
				}
			});
	};

	const handleEditTableData = (data: Issuer) => {
		from(
			getGuidebooksEdit({
				data: convertToServerIssuerData(data),
				guidebookType: Guidebooks.ISSUER,
			}),
		)
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data.message);
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success('Производитель успешно отредактирован');
				}
			});
	};

	const handleGetOneTableData = (id: string) => {
		from(getGuidebooksDelete({ data: { id: id }, guidebookType: Guidebooks.ISSUER }))
			.pipe(
				switchMap((response: AxiosResponse) => {
					const data = convertToClientIssuerData(response.data as IssuerDto);
					return from([data]);
				}),
				tap((data) => setSingleIssuer(data!)),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data.message);
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
				accessorKey: 'name',
				header: () => <SimpleTableHeaderCell text={'Производитель'} />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'country',
				header: () => <SimpleTableHeaderCell text={'Страна'} />,
				cell: (info) => {
					return (
						<SimpleTableCell content={RuCountryNamesMap[info.getValue() as Country]} />
					);
				},
			},
			{
				accessorKey: 'logoUrl',
				header: () => <SimpleTableHeaderCell text={'Логотип'} />,
				cell: (info) => {
					return (
						<SimpleTableCell
							contentClassName="h-[39px] w-[39px]"
							content={
								info.getValue() ? (
									<img src={info.getValue() as string} className="size-[39px]" />
								) : (
									''
								)
							}
						/>
					);
				},
			},
			{
				accessorKey: 'webSite',
				header: () => <SimpleTableHeaderCell text={'Сайт'} />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'id',
				header: () => <SimpleTableHeaderCell text={'Действия'} />,
				cell: (info) => {
					return (
						<SimpleTableCell
							content={
								<div className="flex gap-2">
									<EditIcon
										onClick={() =>
											navigate('', {
												edit: 'true',
												entityId: info.getValue() as string,
											})
										}
									/>
									<DeleteIcon
										onClick={() =>
											handleDeleteTableData(info.getValue() as string)
										}
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
					pageTitle: 'Производители',
					editTitle: 'Редактировать производителя',
					addTitle: 'Добавить производителя',
				}}
				forms={form}
				formElements={{ filter: IssuersFilter, add: IssuersAddEdit, edit: IssuersAddEdit }}
			/>
			{!!tableData.length && (
				<SimpleTable
					data={tableData}
					columns={columns}
					paginationState={paginationState}
					onChangePaginationState={(newState) => {
						handleGetTableData(form.filterForm.getValues(), newState);
					}}
				/>
			)}
		</div>
	);
};

export default IssuersScreen;
