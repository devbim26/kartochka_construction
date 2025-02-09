import type { TableColumn } from '@core';
import { ColumnCell, ColumnHeader, convertToPaginatedType, mapColumns, VTable } from '@core';
import {
	convertToClientIssuerData,
	convertToServerIssuerData,
} from '@features/guidbooks/constants/converter/issuer.converter';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
import type { Country } from '@features/guidbooks/types';
import { Guidebooks, RuCountryNamesMap } from '@features/guidbooks/types';
import type { Issuer } from '@features/guidbooks/types/issuer/issuers.types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IssuersDataConfig, IssuersFormCofig, useHeaderForm } from '../../utils';
import { GuidbookPageHeaderWrapper } from '../components';
import { IssuersAddEdit, IssuersFilter } from '../components/header/forms/issuers';

const createColumns = (data: Issuer[]): TableColumn<Issuer>[] => {
	if (!data) return [];
	const columns: TableColumn<Issuer>[] = [
		{
			dataKey: 'name',
			label: 'Имя',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
		{
			dataKey: 'country',
			label: 'Страна',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
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
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
		{
			dataKey: 'logoUrl',
			label: 'Логотип',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[300px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[300px]' }),
		},
	];
	return mapColumns(columns);
};

const IssuersPage = () => {
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
	const [tableData, setTableData] = useState<Array<Issuer>>([]);

	const columns = useMemo(() => createColumns(tableData), [tableData]);

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

	useEffect(() => {
		handleGetTableData(form.filterForm.getValues());
	}, [filterCountry, filterName, filterWebSite]);

	const onSaveHandle = useCallback(() => {}, []);
	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={onSaveHandle}
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
