import type { GetUsersWithPaginationParamsQuery } from '@api-gen';
import type { PaginationState } from '@core';
import type { AccountData } from '@features/account/types';

export const convertToServerUserFilterData = (
	data: Partial<AccountData>,
	pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>,
): GetUsersWithPaginationParamsQuery => ({
	directorFullName: data.directorFullName || undefined,
	companyName: data.companyName || undefined,
	mail: data.email || undefined,
	pageNumber: pagination.pageNumber,
	pageSize: pagination.pageSize,
});
