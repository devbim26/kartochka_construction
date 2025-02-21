import {
	convertToPaginatedType,
	DeleteIcon,
	EditIcon,
	PaginationState,
	paginationStateDefault,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
} from '@core';
import type {
	ConstructionsAddData,
	ConstructionsEditData,
	ConstructionsFilterData,
} from '@features';
import {
	ConstructionsAdd,
	ConstructionsAddConfig,
	ConstructionsEdit,
	ConstructionsEditConfig,
	ConstructionsFilter,
	ConstructionsFilterConfig,
	convertToClientConstructionsAddData,
	convertToClientConstructionsEditData,
	convertToServerConstructionsAddData,
	convertToServerConstructionsEditData,
	convertToServerConstructionsFilterData,
	getGuidebooksCreate,
	getGuidebooksDelete,
	getGuidebooksDetail,
	getGuidebooksEdit,
	getGuidebooksPaginated,
	GuidbookPageHeaderWrapper,
	Guidebooks,
	useHeaderForm,
} from '@features';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ConstructionsScreen = () => {
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const [singleMaterial, setSingleMaterial] = useState<ConstructionsEditData>();
	const [tableData, setTableData] = useState<ConstructionsAddData[]>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);

	const forms = useHeaderForm(
		{
			filter: ConstructionsFilterConfig.defaultValues,
			edit: ConstructionsEditConfig.defaultValues,
			add: ConstructionsAddConfig.defaultValues,
		},
		{
			filter: ConstructionsFilterConfig.schema,
			edit: ConstructionsEditConfig.schema,
			add: ConstructionsAddConfig.schema,
		},
	);

	const columns = useMemo(() => {
		const cols: ColumnDef<ConstructionsAddData>[] = [
			{
				accessorKey: 'id',
				header: () => <SimpleTableHeaderCell text="ID" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			//изображение
			{
				accessorKey: 'name',
				header: () => <SimpleTableHeaderCell text="Название" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'description',
				header: () => <SimpleTableHeaderCell text="Описание" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'descriptionSource',
				header: () => <SimpleTableHeaderCell text="Источник" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'maxHeight',
				header: () => <SimpleTableHeaderCell text="Максимальная высота" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'issuer',
				header: () => <SimpleTableHeaderCell text="Производитель" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'constructionType',
				header: () => <SimpleTableHeaderCell text="Тип конструкции" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'region',
				header: () => <SimpleTableHeaderCell text="Регион" />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'actions',
				header: () => <SimpleTableHeaderCell text="Действия" />,
				cell: (info) => {
					const entityId = info.row.original.id;
					return (
						<SimpleTableCell
							content={
								<div className="flex gap-2">
									<EditIcon
										onClick={() =>
											navigate('', { edit: 'true', entityId: entityId! })
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

	const [filterName, filterConstructionTypeId, filterDescription, filterRegion] =
		forms.filterForm.watch(['name', 'constructionTypeId', 'description', 'region']);

	useEffect(() => {
		handleGetTableData(
			forms.filterForm.getValues() as ConstructionsFilterData,
			paginationState,
		);
	}, [filterName, filterConstructionTypeId, filterDescription, filterRegion]);

	const handleGetTableData = async (
		data: ConstructionsFilterData,
		pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
	) => {
		try {
			const response = await getGuidebooksPaginated({
				data: convertToServerConstructionsFilterData(data),
				guidebookType: Guidebooks.CONSTRUCTION,
				pagination,
			});
			const res = convertToPaginatedType(convertToClientConstructionsAddData)(
				response.data as any,
			);
			setTableData(res.items);
			setPaginationState(res.pagination);
		} catch (error) {
			console.log('Error:', error);
		}
	};

	const handleGetOneTableData = useCallback(async (id: string) => {
		try {
			const response = await getGuidebooksDetail({
				id: id,
				guidebookType: Guidebooks.CONSTRUCTION,
			});
			if (response.status === 200) {
				const data = convertToClientConstructionsEditData(response.data as any);
				setSingleMaterial(data);
			}
		} catch (error) {
			console.log('Error:', error);
		}
	}, []);

	const handleAddTableData = async (data: ConstructionsAddData) => {
		try {
			const response = await getGuidebooksCreate({
				data: convertToServerConstructionsAddData(data),
				guidebookType: Guidebooks.CONSTRUCTION,
			});
			if (response.status === 200) {
				handleGetTableData(
					forms.filterForm.getValues() as ConstructionsFilterData,
					paginationState,
				);
			}
		} catch (error) {
			console.log('Error:', error);
		}
	};

	const handleEditTableData = async (data: ConstructionsEditData) => {
		try {
			const response = await getGuidebooksEdit({
				data: convertToServerConstructionsEditData(data),
				guidebookType: Guidebooks.CONSTRUCTION,
			});
			if (response.status === 200) {
				handleGetTableData(
					forms.filterForm.getValues() as ConstructionsFilterData,
					paginationState,
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeleteTableData = async (id: string) => {
		try {
			const response = await getGuidebooksDelete({
				data: { id: id },
				guidebookType: Guidebooks.CONSTRUCTION,
			});
			if (response.status === 200) {
				handleGetTableData(
					forms.filterForm.getValues() as ConstructionsFilterData,
					paginationState,
				);
			}
		} catch (error) {
			console.log('Error:', error);
		}
	};

	useEffect(() => {
		if (singleMaterial) forms.editForm.reset(singleMaterial);
	}, [singleMaterial]);

	useEffect(() => {
		if (search.get('edit') && search.get('entityId')) {
			handleGetOneTableData(search.get('entityId')!);
		}
	}, [search]);

	const onSaveHandle = useCallback(() => {
		handleAddTableData(forms.addForm.getValues() as ConstructionsAddData);
	}, [handleAddTableData, forms.editForm.getValues()]);

	const onEditHandle = useCallback(() => {
		handleEditTableData(forms.editForm.getValues() as ConstructionsEditData);
	}, [handleEditTableData, forms.editForm.getValues()]);

	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={!!search.get('add') ? onSaveHandle : onEditHandle}
				titles={{
					pageTitle: 'Конструкции',
					editTitle: 'Редактирование конструкции',
					addTitle: 'Добавление конструкции',
				}}
				forms={forms}
				formElements={{
					filter: ConstructionsFilter,
					add: ConstructionsAdd,
					edit: ConstructionsEdit,
				}}
			/>
			{!!tableData.length && (
				<SimpleTable
					data={tableData}
					columns={columns}
					paginationState={paginationState}
					onChangePaginationState={(newState) => {
						handleGetTableData(
							forms.filterForm.getValues() as ConstructionsFilterData,
							newState,
						);
					}}
				/>
			)}
		</div>
	);
};

export default ConstructionsScreen;
