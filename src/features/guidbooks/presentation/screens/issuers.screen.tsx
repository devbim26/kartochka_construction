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
	type PaginationState,
} from '@core';
import type { Country, Issuer } from '@features';
import {
	convertToClientIssuerData,
	convertToServerIssuerAddData,
	convertToServerIssuerEditData,
	convertToServerIssuerFilterData,
	getGuidebooksCreate,
	getGuidebooksDelete,
	getGuidebooksDetail,
	getGuidebooksEdit,
	getGuidebooksPaginated,
	GuidbookPageHeaderWrapper,
	Guidebooks,
	IssuersAddAndEditConfig,
	IssuersAddEdit,
	IssuersFilter,
	IssuersFilterConfig,
	RuCountryNamesMap,
	useHeaderForm,
} from '@features';
import type { ColumnDef } from '@tanstack/react-table';
import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';

const IssuersScreen = () => {
	const navigate = useAppNavigate();
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
					const res = convertToPaginatedType(convertToClientIssuerData)(response.data);
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
					toast.success('Производитель успешно добавлен');
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
					toast.success('Производитель успешно удалён');
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
					toast.success('Производитель успешно отредактирован');
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
				accessorKey: 'name',
				header: () => <SimpleTableHeaderCell text={'Производитель'} />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'countries',
				header: () => <SimpleTableHeaderCell text={'Страна'} />,
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
				accessorKey: 'logoUrl',
				header: () => <SimpleTableHeaderCell text={'Логотип'} />,
				cell: (info) => {
					return (
						<SimpleTableCell
							contentClassName="h-[39px] w-[39px]"
							content={
								info.getValue() ? (
									<img src={info.getValue() as string} className="size-fit" />
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
					pageTitle: 'Производители',
					editTitle: 'Редактировать производителя',
					addTitle: 'Добавить производителя',
				}}
				forms={form}
				formElements={{
					filter: () => (
						<FormProvider {...form.filterForm}>
							<IssuersFilter />
						</FormProvider>
					),
					add: () => (
						<FormProvider {...form.addForm}>
							<IssuersAddEdit />
						</FormProvider>
					),
					edit: () => (
						<FormProvider {...form.editForm}>
							<IssuersAddEdit />
						</FormProvider>
					),
				}}
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
			<DeleteModal
				isOpen={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				onClose={() => setIsModalOpen(false)}
				onConfirm={() => {
					handleDeleteTableData(itemToDelete.id);
					setIsModalOpen(false);
				}}
				headerTitle="Подтвердите действие"
			>
				Вы уверены, что хотите удалить производителя {itemToDelete.name}?
			</DeleteModal>
		</div>
	);
};

export default IssuersScreen;
