import { Country } from '@api-gen';
import type { TableColumn } from '@core';
import { ColumnCell, ColumnHeader, convertToPaginatedType, mapColumns, VTable } from '@core';
import { convertToClientIssuerData } from '@features/guidbooks/constants/converter/issuer.converter';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
import { Guidebooks } from '@features/guidbooks/types';
import type { Issuer } from '@features/guidbooks/types/issuer/issuers.types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IssuersDataConfig, IssuersFormCofig, useHeaderForm } from '../../utils';
import { GuidbookPageHeaderWrapper } from '../components';
import { IssuersAddEdit } from '../components/header/forms/issuers';
import { IssuersFilter } from '../components/header/forms/issuers/issuers-filter.component';

const createColumns = (data: Issuer[]): TableColumn<Issuer>[] => {
	if (data.length === 0) return [];
	const columns: TableColumn<Issuer>[] = [
		{
			dataKey: 'name',
			label: 'Имя',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[100px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[100px]' }),
		},
		{
			dataKey: 'country',
			label: 'Страна',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[100px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[100px]' }),
		},
		{
			dataKey: 'webSite',
			label: 'Сайт',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[100px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[100px]' }),
		},
		{
			dataKey: 'logoUrl',
			label: 'Логотип',
			width: 0,
			headerRenderer: (props) => ColumnHeader({ ...props, containerClassName: 'w-[100px]' }),
			cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[100px]' }),
		},
	];
	return mapColumns(columns);
};

const IssuersPage = () => {
	const testtableData = [
		{
			name: '12',
			country: Country.Austria,
			logoUrl: '12',
			webSite: '12',
			id: '12',
		},
	] as Issuer[];

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

	const [tableData, setTableData] = useState<Array<Issuer>>([]);

	const columns = useMemo(() => createColumns(testtableData), [testtableData]);

	const handleGetTableData = async (data: Issuer) => {
		try {
			const response = await getGuidebooksPaginated({
				data: data,
				guidebookType: Guidebooks.ISSUER,
			});
			const items = convertToPaginatedType(convertToClientIssuerData)(response.data as any);

			setTableData(tableData);
		} catch (error) {
			console.log('Error:', error);
		}
	};

	useEffect(() => {
		handleGetTableData({ name: '', country: Country.Austria, webSite: '' });
	}, []);

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
			<VTable pageSize={10} data={testtableData} columns={columns} />
		</div>
	);
};

export default IssuersPage;
