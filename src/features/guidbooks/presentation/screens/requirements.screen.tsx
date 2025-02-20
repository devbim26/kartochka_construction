import type { RequirementDto } from '@api-gen';
import {
	convertToPaginatedType,
	DeleteIcon,
	mapColumns,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
} from '@core';
import { EditIcon } from '@core/presentation/icons/edit.icon';
import {
	convertToClientRequirementData,
	convertToServerRequirementData,
} from '@features/guidbooks/converters';
import {
	getGuidebooksCreate,
	getGuidebooksDelete,
	getGuidebooksDetail,
	getGuidebooksEdit,
	getGuidebooksPaginated,
} from '@features/guidbooks/services';
import type {
	BuildingType,
	ConstructionType,
	Region,
	Requirement,
	RoomType,
} from '@features/guidbooks/types';
import {
	Guidebooks,
	RuBuildingTypeNamesMap,
	RuConstructionTypeNamesMap,
	RuRegionNamesMap,
	RuRoomTypeNamesMap,
} from '@features/guidbooks/types';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RequirementsDataConfig, useHeaderForm } from '../../utils';
import { GuidbookPageHeaderWrapper } from '../components';
import { RequirementsAddAndEdit, RequirementsFilter } from '../components/header/forms';

const RequirementsScreen = () => {
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const [singleRequirement, setSingleRequirement] = useState<Requirement>();
	const [tableData, setTableData] = useState<Array<Requirement>>([]);

	const form = useHeaderForm<Requirement>(
		{
			filter: RequirementsDataConfig.defaultValues,
			edit: RequirementsDataConfig.defaultValues,
			add: RequirementsDataConfig.defaultValues,
		},
		{
			filter: RequirementsDataConfig.schema,
			edit: RequirementsDataConfig.schema,
			add: RequirementsDataConfig.schema,
		},
	);

	const [
		filterRegion,
		filterConstructionType,
		filterFirstPlacementRoom,
		filterSecondPlacementRoom,
		filterBuildingType,
	] = form.filterForm.watch([
		'region',
		'constructionType',
		'firstPlacementRoom',
		'secondPlacementRoom',
		'buildingType',
	]);

	useEffect(() => {
		if (search.get('edit') && search.get('entityId')) {
			handleGetOneTableData(search.get('entityId')!);
		}
	}, [search]);

	useEffect(() => {
		if (singleRequirement) form.editForm.reset(singleRequirement);
	}, [singleRequirement]);

	useEffect(() => {
		handleGetTableData(form.filterForm.getValues());
	}, [
		filterRegion,
		filterConstructionType,
		filterFirstPlacementRoom,
		filterSecondPlacementRoom,
		filterBuildingType,
	]);

	const handleGetTableData = useCallback(async (data: Requirement) => {
		try {
			const response = await getGuidebooksPaginated({
				data: convertToServerRequirementData(data),
				guidebookType: Guidebooks.REQUIREMENT,
			});
			const items = convertToPaginatedType(convertToClientRequirementData)(
				response.data as any,
			);
			setTableData(items);
		} catch (error) {
			console.log('Error:', error);
		}
	}, []);

	const handleAddTableData = useCallback(
		async (data: Requirement) => {
			try {
				const response = await getGuidebooksCreate({
					data: convertToServerRequirementData(data),
					guidebookType: Guidebooks.REQUIREMENT,
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

	const handleEditTableData = useCallback(
		async (data: Requirement) => {
			try {
				const response = await getGuidebooksEdit({
					data: convertToServerRequirementData(data),
					guidebookType: Guidebooks.REQUIREMENT,
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
					guidebookType: Guidebooks.REQUIREMENT,
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
				guidebookType: Guidebooks.REQUIREMENT,
			});
			if (response.status === 200) {
				const data = convertToClientRequirementData(response.data as RequirementDto);
				setSingleRequirement(data);
			}
		} catch (error) {
			console.log('Error:', error);
		}
	}, []);

	const onSaveHandle = useCallback(() => {
		handleAddTableData(form.addForm.getValues());
	}, [handleAddTableData, form.addForm.getValues()]);

	const onEditHandle = useCallback(() => {
		handleEditTableData(form.editForm.getValues());
	}, [handleEditTableData, form.editForm.getValues()]);

	const createColumns = (data: Requirement[]): ColumnDef<Requirement>[] => {
		if (!data) return [];
		const columns: ColumnDef<Requirement>[] = [
			{
				accessorKey: 'region',
				header: () => <SimpleTableHeaderCell text={'Регион'} />,
				cell: (info) => {
					return (
						<SimpleTableCell content={RuRegionNamesMap[info.getValue() as Region]} />
					);
				},
			},
			{
				accessorKey: 'buildingType',
				header: () => <SimpleTableHeaderCell text={'Тип здания'} />,
				cell: (info) => {
					return (
						<SimpleTableCell
							content={RuBuildingTypeNamesMap[info.getValue() as BuildingType]}
						/>
					);
				},
			},
			{
				accessorKey: 'constructionType',
				header: () => <SimpleTableHeaderCell text={'Тип конструкции'} />,
				cell: (info) => {
					return (
						<SimpleTableCell
							content={
								RuConstructionTypeNamesMap[info.getValue() as ConstructionType]
							}
						/>
					);
				},
			},
			{
				accessorKey: 'standartFullName',
				header: () => <SimpleTableHeaderCell text={'Стандарт полное'} />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'standartShortName',
				header: () => <SimpleTableHeaderCell text={'Стандарт краткое'} />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'standartValidityPeriod',
				header: () => <SimpleTableHeaderCell text={'Срок дейстия стандарта'} />,
				cell: (info) => <SimpleTableCell content={info.getValue() as string} />,
			},
			{
				accessorKey: 'firstPlacementRoom',
				header: () => <SimpleTableHeaderCell text={'Первое помещение'} />,
				cell: (info) => {
					return (
						<SimpleTableCell
							content={RuRoomTypeNamesMap[info.getValue() as RoomType]}
						/>
					);
				},
			},
			{
				accessorKey: 'secondPlacementRoom',
				header: () => <SimpleTableHeaderCell text={'Второе помещение'} />,
				cell: (info) => {
					return (
						<SimpleTableCell
							content={RuRoomTypeNamesMap[info.getValue() as RoomType]}
						/>
					);
				},
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
		return mapColumns(columns);
	};

	const columns = useMemo(() => createColumns(tableData), [tableData]);

	return (
		<div className="flex w-full flex-col gap-[40px]">
			<GuidbookPageHeaderWrapper
				onSave={!!search.get('add') ? onSaveHandle : onEditHandle}
				titles={{
					pageTitle: 'Требования',
					editTitle: 'Редактировать требования',
					addTitle: 'Добавить требования',
				}}
				forms={form}
				formElements={{
					filter: RequirementsFilter,
					add: RequirementsAddAndEdit,
					edit: RequirementsAddAndEdit,
				}}
			/>
			{!!tableData.length && <SimpleTable pageSize={10} data={tableData} columns={columns} />}
		</div>
	);
};

export default RequirementsScreen;
