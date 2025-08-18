import type { DeleteUserCommand, GetUsersWithPaginationParamsQuery } from '@api-gen';
import { fetchApi } from '@api-gen';
import type { RegistrationFormData } from '@features/auth/types';

export const getUserById = async (id: string) => {
	return await fetchApi.api.userDetail(id);
};

export const createUser = async (data: RegistrationFormData) => {
	return await fetchApi.api.accountRegisterCreate(data);
};

export const deleteUser = async (data: DeleteUserCommand) => {
	return await fetchApi.api.userDelete(data);
};

export const getPaginatedUsers = async (data: GetUsersWithPaginationParamsQuery) => {
	return await fetchApi.api.userGetPaginatedCreate(data);
};
