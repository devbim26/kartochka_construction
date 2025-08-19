import type {
	AdditionalPhoneNumber,
	DeleteUserCommand,
	GetUsersWithPaginationParamsQuery,
} from '@api-gen';
import { fetchApi } from '@api-gen';
import type { RegistrationFormData } from '@features/auth/types';

export const getUserById = async (id: string) => {
	return await fetchApi.api.userDetail(id);
};

export const createUser = async (data: RegistrationFormData) => {
	return await fetchApi.api.accountRegisterCreate(data);
};

export const updateUser = async (data: {
	userId?: string;
	companyName?: string;
	phoneNumber?: string;
	payersRegistrationNumber?: string;
	paymentAccount?: string;
	bankIdNumber?: string;
	directorFullName?: string;
	bankAddress?: string;
	companyAddress?: string;
	companyDescription?: string;
	additionalPhoneNumbers?: AdditionalPhoneNumber[];
	formFile?: File;
}) => {
	return await fetchApi.api.userUpdateUpdate(data);
};

export const deleteUser = async (data: DeleteUserCommand) => {
	return await fetchApi.api.userDelete(data);
};

export const getPaginatedUsers = async (data: GetUsersWithPaginationParamsQuery) => {
	return await fetchApi.api.userGetPaginatedCreate(data);
};
