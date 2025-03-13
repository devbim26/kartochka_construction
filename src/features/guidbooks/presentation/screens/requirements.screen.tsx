import type { RequirementDto } from '@api-gen';
import type { PaginationState } from '@core';
import {
	convertToPaginatedType,
	DeleteIcon,
	DeleteModal,
	paginationStateDefault,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
} from '@core';

import { EditIcon } from '@core/presentation/icons/edit.icon';
import {
	convertToClientRequirementData,
	convertToClientRequirementTableData,
	convertToServerFilterRequirementData,
	convertToServerRequirementData,
	convertToServerRequirementUpdateData,
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
	ConstructionClass,
	Country,
	FormRequirement,
	Requirement,
	RequirementFilter,
} from '@features/guidbooks/types';
import {
	Guidebooks,
	RuBuildingTypeNamesMap,
	RuConstructionTypeNamesMap,
	RuCountryNamesMap,
} from '@features/guidbooks/types';
import type { ColumnDef } from '@tanstack/react-table';
import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import {
	RequirementsFilterDataConfig,
	RequirementsFormDataConfig,
	useHeaderForm,
} from '../../utils';
import {
	GuidbookPageHeaderWrapper,
	RequirementsAddAndEdit,
	RequirementsFilter,
} from '../components';

const RequirementsScreen = () => {
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const [singleRequirement, setSingleRequirement] = useState<FormRequirement>();
	const [tableData, setTableData] = useState<Array<Requirement>>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [itemToDelete, setItemToDelete] = useState({
		id: '',
		name: '',
	});

	const form = useHeaderForm<FormRequirement | RequirementFilter>(
		{
			filter: RequirementsFilterDataConfig.defaultValues,
			edit: RequirementsFormDataConfig.defaultValues,
			add: RequirementsFormDataConfig.defaultValues,
		},
		{
			filter: RequirementsFilterDataConfig.schema,
			edit: RequirementsFormDataConfig.schema,
			add: RequirementsFormDataConfig.schema,
		},
	);

	const [
		filterCountry,
		filterConstructionType,
		filterFirstPlacementRoom,
		filterSecondPlacementRoom,
		filterBuildingType,
	] = form.filterForm.watch([
		'countryType',
		'constructionType',
		'firstPlacementRoomId',
		'secondPlacementRoomId',
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
		filterCountry,
		filterConstructionType,
		filterFirstPlacementRoom,
		filterSecondPlacementRoom,
		filterBuildingType,
	]);

	const handleGetTableData = (
		data: RequirementFilter,
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
					const res = convertToPaginatedType(convertToClientRequirementTableData)(
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
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const handleAddTableData = (data: FormRequirement) => {
		from(
			getGuidebooksCreate({
				data: convertToServerRequirementData(data),
				guidebookType: Guidebooks.REQUIREMENT,
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
					Object.entries(data).forEach(([key, value]) => {
						if (!['noizeIsolationIndex', 'noizeImpactIndex', 'notice'].includes(key)) {
							sessionStorage.setItem(key, JSON.stringify(value));
						}
					});
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success('Требование успешно добавлено');
					setPaginationState(paginationStateDefault);
					navigate('');
				}
			});
	};

	const handleEditTableData = (data: FormRequirement) => {
		from(
			getGuidebooksEdit({
				data: convertToServerRequirementUpdateData(data),
				guidebookType: Guidebooks.REQUIREMENT,
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
					toast.success('Требование успешно отредактировано');
					setPaginationState(paginationStateDefault);
					navigate('');
				}
			});
	};

	const handleGetOneTableData = (id: string) => {
		from(getGuidebooksDetail({ id: id, guidebookType: Guidebooks.REQUIREMENT }))
			.pipe(
				switchMap((response: AxiosResponse) => {
					const data = convertToClientRequirementData(response.data as RequirementDto);
					return from([data]);
				}),
				tap((data) => setSingleRequirement(data!)),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const handleDeleteTableData = (id: string) => {
		from(getGuidebooksDelete({ data: { id: id }, guidebookType: Guidebooks.REQUIREMENT }))
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
					setPaginationState(paginationStateDefault);
					toast.success('Требование успешно удалено');
				}
			});
	};

	const onSaveHandle = useCallback(() => {
		handleAddTableData(form.addForm.getValues() as FormRequirement);
	}, [handleAddTableData, form.addForm.getValues()]);

	const onEditHandle = useCallback(() => {
		handleEditTableData(form.editForm.getValues() as FormRequirement);
	}, [handleEditTableData, form.editForm.getValues()]);

	const columns = useMemo(() => {
		const cols: ColumnDef<Requirement>[] = [
			{
				accessorKey: 'countryType',
				header: () => <SimpleTableHeaderCell text={'Регион'} />,
				cell: (info) => {
					return (
						<SimpleTableCell content={RuCountryNamesMap[info.getValue() as Country]} />
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
								RuConstructionTypeNamesMap[info.getValue() as ConstructionClass]
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
					return <SimpleTableCell content={info.getValue() as string} />;
				},
			},
			{
				accessorKey: 'secondPlacementRoom',
				header: () => <SimpleTableHeaderCell text={'Второе помещение'} />,
				cell: (info) => {
					return <SimpleTableCell content={info.getValue() as string} />;
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
												entityId: info.row.original.id!,
											})
										}
									/>
									<DeleteIcon
										onClick={() => {
											{
												setItemToDelete({
													id: info.row.original.id!,
													name: info.row.original.standartFullName,
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

			<SimpleTable
				data={tableData}
				columns={columns}
				paginationState={paginationState}
				onChangePaginationState={(newState) => {
					handleGetTableData(form.filterForm.getValues(), newState);
				}}
			/>

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
				Вы уверены, что хотите удалить требование {itemToDelete.name}?
			</DeleteModal>
		</div>
	);
};

export default RequirementsScreen;
