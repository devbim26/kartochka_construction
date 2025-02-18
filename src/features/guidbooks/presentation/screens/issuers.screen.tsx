import type { IssuerDto } from '@api-gen';
import {
	convertToPaginatedType,
	DeleteIcon,
	EditIcon,
	mapColumns,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
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
import type { Issuer } from '@features/guidbooks/types';
import { Guidebooks } from '@features/guidbooks/types';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IssuersDataConfig, IssuersFormCofig, useHeaderForm } from '../../utils';
import { GuidbookPageHeaderWrapper } from '../components';
import { IssuersAddEdit, IssuersFilter } from '../components/header/forms/issuers';

const IssuersScreen = () => {
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const [singleIssuer, setSingleIssuer] = useState<Issuer>();
	const [tableData, setTableData] = useState<Array<Issuer>>([]);

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
		handleGetTableData(form.filterForm.getValues());
	}, [filterCountry, filterName, filterWebSite]);

	const handleGetTableData = useCallback(async (data: Issuer) => {
		try {
			const response = await getGuidebooksPaginated({
				data: convertToServerIssuerData(data),
				guidebookType: Guidebooks.ISSUER,
			});
			const items = convertToPaginatedType(convertToClientIssuerData)(response.data as any);
			setTableData(items);
		} catch (error) {
			console.log('Error:', error);
		}
	}, []);

	const handleAddTableData = useCallback(
		async (data: Issuer) => {
			try {
				const response = await getGuidebooksCreate({
					data: convertToServerIssuerData(data),
					guidebookType: Guidebooks.ISSUER,
				});
				if (response.status === 200) {
					handleGetTableData(form.filterForm.getValues());
				}
			} catch (error) {
				console.log('Error:', error);
			}
		},
		[handleGetTableData, form.filterForm.getValues()],
	);

	const handleGetOneTableData = useCallback(async (id: string) => {
		try {
			const response = await getGuidebooksDetail({
				id: id,
				guidebookType: Guidebooks.ISSUER,
			});
			if (response.status === 200) {
				const data = convertToClientIssuerData(response.data as IssuerDto);
				setSingleIssuer(data);
			}
		} catch (error) {
			console.log('Error:', error);
		}
	}, []);

	const handleEditTableData = useCallback(
		async (data: Issuer) => {
			try {
				const response = await getGuidebooksEdit({
					data: convertToServerIssuerData(data),
					guidebookType: Guidebooks.ISSUER,
				});
				if (response.status === 200) {
					handleGetTableData(form.filterForm.getValues());
				}
			} catch (error) {
				console.log(error);
			}
		},
		[handleGetTableData, form.filterForm.getValues()],
	);

	const handleDeleteTableData = useCallback(
		async (id: string) => {
			try {
				const response = await getGuidebooksDelete({
					data: { id: id },
					guidebookType: Guidebooks.ISSUER,
				});
				if (response.status === 200) {
					handleGetTableData(form.filterForm.getValues());
				}
			} catch (error) {
				console.log('Error:', error);
			}
		},
		[handleGetTableData, form.filterForm.getValues()],
	);

	const onSaveHandle = useCallback(() => {
		handleAddTableData(form.addForm.getValues());
	}, [handleAddTableData, form.editForm.getValues()]);

	const onEditHandle = useCallback(() => {
		handleEditTableData(form.editForm.getValues());
	}, [handleEditTableData, form.editForm.getValues()]);

	const createColumns = (data: Issuer[]): ColumnDef<Issuer>[] => {
		if (!data) return [];
		const columns: ColumnDef<Issuer>[] = [
			{
				accessorKey: 'name',
				header: () => <SimpleTableHeaderCell text={'Производитель'} />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'country',
				header: () => <SimpleTableHeaderCell text={'Страна'} />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'logoUrl',
				header: () => <SimpleTableHeaderCell text={'Логотип'} />,
				cell: (info) => {
					const value = info.getValue() as string | null;
					return (
						<SimpleTableCell
							contentClassName="h-[39px] w-[39px]"
							content={
								value ? (
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
					const value = info.getValue() as string;
					return (
						<SimpleTableCell
							content={
								<div className="flex gap-2">
									<DeleteIcon onClick={() => handleDeleteTableData(value)} />
									<EditIcon
										onClick={() =>
											navigate('', { edit: 'true', entityId: value })
										}
									/>
								</div>
							}
						/>
					);
				},
			},
		];
		return mapColumns(columns);
	};

	const columns = useMemo(() => createColumns(tableData), [tableData]);

	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={!!search.get('add') ? onSaveHandle : onEditHandle}
				titles={{
					pageTitle: 'Производители',
					editTitle: 'Редактировать производителя',
					addTitle: 'Добавить производителя',
				}}
				forms={form}
				formElements={{
					filter: IssuersFilter,
					add: IssuersAddEdit,
					edit: IssuersAddEdit,
				}}
			/>
			{!!tableData.length && <SimpleTable pageSize={10} data={tableData} columns={columns} />}
		</div>
	);
};

export default IssuersScreen;
