import {
	convertToPaginatedType,
	DeleteIcon,
	DeleteModal,
	EditIcon,
	paginationStateDefault,
	SimpleTable,
	SimpleTableCell,
	SimpleTableHeaderCell,
	useAppNavigate,
	type PaginationState,
} from '@core';
import {
	convertToClientAccountData,
	convertToServerAccountUpdateData,
} from '@features/account/converters';
import type { AccountData } from '@features/account/types';
import { AccountDataConfig } from '@features/account/utils';
import { convertToServerRegistrationData } from '@features/auth/converters';
import type { RegistrationFormData } from '@features/auth/types';
import { useHeaderForm } from '@features/guidbooks/utils';
import { convertToServerUserFilterData } from '@features/users/converters';
import {
	createUser,
	deleteUser,
	getPaginatedUsers,
	getUserById,
	updateUser,
} from '@features/users/services';
import { userColumns } from '@features/users/utils';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { toast } from 'sonner';
import { UserAddEdit, UserFilter, UserPageHeaderWrapper } from '../components';

export const UserScreen = () => {
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const [tableData, setTableData] = useState<Array<AccountData>>([]);
	const [paginationState, setPaginationState] = useState<PaginationState>(paginationStateDefault);

	const form = useHeaderForm<AccountData>(
		{
			filter: AccountDataConfig.defaultValues,
			edit: AccountDataConfig.defaultValues,
			add: AccountDataConfig.defaultValues,
		},
		{
			filter: AccountDataConfig.schema,
			edit: AccountDataConfig.schema,
			add: AccountDataConfig.schema,
		},
	);

	const [phoneNumber, companyName] = form.filterForm.watch(['mainPhoneNumber', 'companyName']);

	useEffect(() => {
		if (search.get('edit') && search.get('entityId')) {
			handleGetOneTableData(search.get('entityId')!);
		}
	}, [search]);

	useEffect(() => {
		handleGetTableData(form.filterForm.getValues(), paginationState);
	}, [phoneNumber, companyName]);

	const handleGetTableData = (
		data: Partial<AccountData>,
		pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
	) => {
		from(getPaginatedUsers(convertToServerUserFilterData(data, pagination)))
			.pipe(
				switchMap((response) => {
					const res = convertToPaginatedType(convertToClientAccountData)({
						items: response.data.items ?? [],
						pageNumber: response.data.pageNumber ?? 1,
						totalPages: response.data.totalPages ?? 0,
						totalCount: response.data.totalCount ?? 0,
						pageSize: response.data.pageSize ?? 10,
						hasPreviousPage: false,
						hasNextPage: false,
					});
					return from([res]);
				}),
				tap((res) => {
					setTableData(res.items);
					setPaginationState(res.pagination);
				}),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(
							error.response?.data?.message || 'Ошибка загрузки пользователей',
						);
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const handleAddTableData = (data: RegistrationFormData) => {
		from(createUser(convertToServerRegistrationData(data)))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(
							error.response?.data?.message || 'Ошибка создания пользователя',
						);
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success('Пользователь успешно добавлен');
					navigate('');
				}
			});
	};

	const handleDeleteTableData = (id: string) => {
		from(deleteUser({ userId: id }))
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
					toast.success('Пользователь успешно удален');
				}
			});
	};

	const handleEditTableData = (data: AccountData) => {
		from(updateUser(convertToServerAccountUpdateData(data)))
			.pipe(
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(
							error.response?.data?.message || 'Ошибка редактирования пользователя',
						);
					}
					return from([null]);
				}),
			)
			.subscribe((response) => {
				if (response?.status === 200) {
					handleGetTableData(form.filterForm.getValues(), paginationState);
					toast.success('Пользователь успешно отредактирован');
					navigate('');
				}
			});
	};

	const handleGetOneTableData = (id: string) => {
		from(getUserById(id))
			.pipe(
				switchMap((response) => {
					const data = convertToClientAccountData(response.data as AccountData);
					return from([data]);
				}),
				tap((data) => form.editForm.reset(data)),
				catchError((error) => {
					if (error instanceof AxiosError) {
						toast.error(error.response?.data);
					}
					return from([null]);
				}),
			)
			.subscribe();
	};

	const onSaveHandle = useCallback(() => {
		handleAddTableData(form.addForm.getValues() as RegistrationFormData);
	}, [handleAddTableData, form.addForm.getValues()]);

	const onEditHandle = useCallback(() => {
		handleEditTableData(form.editForm.getValues());
	}, [handleEditTableData, form.editForm.getValues()]);

	return (
		<div className="flex w-full flex-col gap-[40px]">
			<UserPageHeaderWrapper
				onSave={search.get('add') ? onSaveHandle : onEditHandle}
				titles={{
					pageTitle: 'Клиенты',
					editTitle: 'Редактировать Клиента',
					addTitle: 'Добавить Клиента',
				}}
				forms={form}
				formElements={{
					filter: UserFilter,
					add: UserAddEdit,
					edit: UserAddEdit,
				}}
			/>
			<SimpleTable
				data={tableData}
				columns={[
					...userColumns,
					{
						accessorKey: 'id',
						header: () => <SimpleTableHeaderCell text={'Действия'} />,
						cell: (info) => (
							<SimpleTableCell
								content={
									<div className="flex gap-2">
										<EditIcon
											onClick={() => {
												navigate('', {
													edit: 'true',
													entityId: info.row.original.id!,
												});
											}}
										/>
										<DeleteIcon
											onClick={() => {
												navigate('', {
													delete: 'true',
													entityId: info.row.original.id!,
												});
											}}
										/>
									</div>
								}
							/>
						),
					},
				]}
				paginationState={paginationState}
				onChangePaginationState={(newState) => {
					handleGetTableData(form.filterForm.getValues(), newState);
				}}
			/>
			<DeleteModal
				onClose={() => navigate('')}
				onCancel={() => navigate('')}
				isOpen={!!search.get('entityId') && !!search.get('delete')}
				onConfirm={() => {
					handleDeleteTableData(search.get('entityId')!);
					navigate('');
				}}
				headerTitle="Подтвердите действие"
			>
				Вы уверены, что хотите удалить пользователя ?
			</DeleteModal>
		</div>
	);
};
