import type { IssuerDto } from '@api-gen';
import type { TableColumn } from '@core';
import {
	ColumnCell,
	ColumnHeader,
	convertToPaginatedType,
	DeleteIcon,
	mapColumns,
	useAppNavigate,
	VTable,
} from '@core';
import { EditIcon } from '@core/presentation/icons/edit.icon';
import {
	convertToClientIssuerData,
	convertToServerIssuerData,
} from '@features/guidbooks/constants/converter';
import {
	getGuidebooksCreate,
	getGuidebooksDelete,
	getGuidebooksDetail,
	getGuidebooksEdit,
	getGuidebooksPaginated,
} from '@features/guidbooks/services';
import type { Country, Issuer } from '@features/guidbooks/types';
import { Guidebooks, RuCountryNamesMap } from '@features/guidbooks/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IssuersDataConfig, IssuersFormCofig, useHeaderForm } from '../../utils';
import { GuidbookPageHeaderWrapper } from '../components';
import { IssuersAddEdit, IssuersFilter } from '../components/header/forms/issuers';

const IssuersPage = () => {
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

	const handleGetTableData = async (data: Issuer) => {
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
	};

	const handleAddTableData = async (data: Issuer) => {
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
	};

	const onSaveHandle = useCallback(() => {
		handleAddTableData(form.addForm.getValues());
	}, []);

	const onEditHandle = useCallback(() => {
		handleEditTableData(form.editForm.getValues());
	}, []);

	const handleGetOneTableData = async (id: string) => {
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
	};

	const handleEditTableData = async (data: Issuer) => {
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
	};

	const handleDeleteTableData = async (id: string) => {
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
	};

	const createColumns = (data: Issuer[]): TableColumn<Issuer>[] => {
		if (!data) return [];
		const columns: TableColumn<Issuer>[] = [
			{
				dataKey: 'name',
				label: 'Имя',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
			},
			{
				dataKey: 'country',
				label: 'Страна',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) =>
					ColumnCell({
						...props,
						containerClassName: 'w-[300px]',
						cellData: RuCountryNamesMap[`${props.cellData as Country}`],
					}),
			},
			{
				dataKey: 'webSite',
				label: 'Сайт',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
			},
			{
				dataKey: 'logoUrl',
				label: 'Логотип',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
			},
			{
				dataKey: 'id',
				label: 'Действия',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
				cellRenderer: (props) =>
					ColumnCell({
						...props,
						containerClassName: 'w-[300px]',
						cellData: (
							<div className="flex gap-2">
								<EditIcon
									onClick={() =>
										navigate('', { edit: 'true', entityId: props.cellData })
									}
								/>
								<DeleteIcon
									onClick={() => handleDeleteTableData(props.cellData as string)}
								/>
							</div>
						),
					}),
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
			/>{' '}
			{!!tableData.length && <VTable pageSize={10} data={tableData} columns={columns} />}
		</div>
	);
};

export default IssuersPage;
