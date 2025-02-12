import type { RequirementDto } from '@api-gen';
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
	convertToClientRequirementData,
	convertToServerRequirementData,
} from '@features/guidbooks/constants/converter';
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
} from '@features/guidbooks/types';
import {
	Guidebooks,
	RuBuildingTypeNamesMap,
	RuConstructionTypeNamesMap,
	RuCountryNamesMap,
} from '@features/guidbooks/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RequirementsDataConfig, useHeaderForm } from '../../utils';
import {
	GuidbookPageHeaderWrapper,
	RequirementsAddAndEdit,
	RequirementsFilter,
} from '../components';

export const RequirementsPage = () => {
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
		filterBuildingType,
		filterStandartFullName,
		filterStandartShortName,
		filterStandartValidityPeriod,
	] = form.filterForm.watch([
		'region',
		'buildingType',
		'standartFullName',
		'standartShortName',
		'standartValidityPeriod',
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
		filterBuildingType,
		filterStandartFullName,
		filterStandartShortName,
		filterStandartValidityPeriod,
	]);

	const handleGetTableData = async (data: Requirement) => {
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
	};

	const handleAddTableData = async (data: Requirement) => {
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
	};

	const onSaveHandle = useCallback(() => {
		handleAddTableData(form.editForm.getValues());
	}, []);

	const onEditHandle = useCallback(() => {
		handleEditTableData(form.editForm.getValues());
	}, []);

	const handleDeleteTableData = async (id: string) => {
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
	};

	const handleGetOneTableData = async (id: string) => {
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
	};

	const handleEditTableData = async (data: Requirement) => {
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
	};

	const createColumns = (data: Requirement[]): TableColumn<Requirement>[] => {
		if (!data) return [];
		const columns: TableColumn<Requirement>[] = [
			{
				dataKey: 'region',
				label: 'Регион',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
				cellRenderer: (props) =>
					ColumnCell({
						...props,
						containerClassName: 'w-[200px]',
						cellData: RuCountryNamesMap[`${props.cellData as Region}`],
					}),
			},
			{
				dataKey: 'buildingType',
				label: 'Тип здания',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
				cellRenderer: (props) =>
					ColumnCell({
						...props,
						containerClassName: 'w-[200px]',
						cellData: RuBuildingTypeNamesMap[`${props.cellData as BuildingType}`],
					}),
			},
			{
				dataKey: 'standartFullName',
				label: 'Стандарт полное',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[200px]' }),
			},
			{
				dataKey: 'standartShortName',
				label: 'Стандарт краткое',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[200px]' }),
			},
			{
				dataKey: 'standartValidityPeriod',
				label: 'Срок действия стандарта',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
				cellRenderer: (props) => ColumnCell({ ...props, containerClassName: 'w-[200px]' }),
			},
			{
				dataKey: 'firstPlacementRoom',
				label: 'Конструкция разделяет',
				width: 0,
				headerRenderer: (props) =>
					ColumnHeader({ ...props, containerClassName: 'w-[200px]' }),
				cellRenderer: (props) =>
					ColumnCell({
						...props,
						containerClassName: 'w-[200px]',
						cellData:
							RuConstructionTypeNamesMap[`${props.cellData as ConstructionType}`],
					}),
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
			/>{' '}
			{!!tableData.length && <VTable pageSize={10} data={tableData} columns={columns} />}
		</div>
	);
};
