import type { RequirementDto } from '@api-gen';
import { mapColumns, useAppNavigate } from '@core';
import { convertToPaginatedType } from '@core/converters';

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
import type { Requirement } from '@features/guidbooks/types';
import { Guidebooks } from '@features/guidbooks/types';
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

	const onSaveHandle = useCallback(() => {
		handleAddTableData(form.editForm.getValues());
	}, [handleAddTableData, form.editForm.getValues()]);

	const onEditHandle = useCallback(() => {
		handleEditTableData(form.editForm.getValues());
	}, [handleEditTableData, form.editForm.getValues()]);

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

	const createColumns = (data: Requirement[]): ColumnDef<Requirement>[] => {
		if (!data) return [];
		const columns: ColumnDef<Requirement>[] = [];
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
		</div>
	);
};

export default RequirementsScreen;
