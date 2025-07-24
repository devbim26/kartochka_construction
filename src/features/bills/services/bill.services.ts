import { fetchApi } from '@api-gen';
import type { PaginationState } from '@core';
import { convertBillFiltersToServer, convertBillToServer } from '../converters';
import type { BillFilter, UpdateBill } from '../types';

export const getBillById = async (id: string) => {
	return await fetchApi.api.billDetail(id);
};

export const deleteBill = async (id: string) => {
	return await fetchApi.api.billDelete({ id: id });
};

export const createBill = async (id: string) => {
	return await fetchApi.api.billCreate({ subscriptionId: id });
};

export const updateBill = async (data: UpdateBill) => {
	return await fetchApi.api.subscriptionUpdate(convertBillToServer(data));
};

type PaginatedProps = {
	data: BillFilter;
	pagination: Pick<PaginationState, 'pageNumber' | 'pageSize'>;
};

export const getPaginatedBills = async ({ data, pagination }: PaginatedProps) => {
	return await fetchApi.api.billGetPaginatedCreate({
		...convertBillFiltersToServer(data),
		...pagination,
	});
};
