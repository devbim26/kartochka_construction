import type { RequirementDto } from '@api-gen';
import {
	convertToPaginatedType,
	DeleteIcon,
	paginationStateDefault,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
	type PaginationState,
} from '@core';
import { EditIcon } from '@core/presentation/icons/edit.icon';
import {
	convertToClientRequirementData,
	convertToServerFilterRequirementData,
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
import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { RequirementsDataConfig, useHeaderForm } from '../../utils';
import {
	GuidbookPageHeaderWrapper,
	RequirementsAddAndEdit,
	RequirementsFilter,
} from '../components';

const RequirementsScreen = () => {
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const [singleRequirement, setSingleRequirement] = useState<Requirement>();
	const [tableData, setTableData] = useState<Array<Requirement>>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);

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
		handleGetTableData(form.filterForm.getValues(), paginationState);
	}, [
		filterRegion,
		filterConstructionType,
		filterFirstPlacementRoom,
		filterSecondPlacementRoom,
		filterBuildingType,
	]);

	const handleGetTableData = (
		data: Requirement,
		pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
	) => {
		from(
			getGuidebooksPaginated({
				data: convertToServerFilterRequirementData(data),
				guidebookType: Guidebooks.REQUIREMENT,
				pagination,
			}),
		)
			.pipe(
				switchMap((response: AxiosResponse) => {
					const res = convertToPaginatedType(convertToClientRequirementData)(
						response.data,
					);
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

	const handleAddTableData = (data: Requirement) => {
		from(
			getGuidebooksCreate({
				data: convertToServerRequirementData(data),
				guidebookType: Guidebooks.REQUIREMENT,
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
					toast.success('Требование успешно добавлено');
				}
			});
	};

	const handleEditTableData = (data: Requirement) => {
		from(
			getGuidebooksEdit({
				data: convertToServerRequirementData(data),
				guidebookType: Guidebooks.REQUIREMENT,
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
					toast.success('Требование успешно отредактировано');
				}
			});
	};

	const handleGetOneTableData = (id: string) => {
		from(getGuidebooksDelete({ data: { id: id }, guidebookType: Guidebooks.REQUIREMENT }))
			.pipe(
				switchMap((response: AxiosResponse) => {
					const data = convertToClientRequirementData(response.data as RequirementDto);
					return from([data]);
				}),
				tap((data) => setSingleRequirement(data!)),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data.message);
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const handleDeleteTableData = (id: string) => {
		from(getGuidebooksDetail({ id: id, guidebookType: Guidebooks.REQUIREMENT }))
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
					toast.success('Требование успешно удалено');
				}
			});
	};

	const onSaveHandle = useCallback(() => {
		handleAddTableData(form.addForm.getValues());
	}, [handleAddTableData, form.addForm.getValues()]);

	const onEditHandle = useCallback(() => {
		handleEditTableData(form.editForm.getValues());
	}, [handleEditTableData, form.editForm.getValues()]);

	const columns = useMemo(() => {
		const cols: ColumnDef<Requirement>[] = [
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
		return cols;
	}, []);

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

export default RequirementsScreen;
