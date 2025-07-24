import type { BillDto, GetBillWithPaginationParamsQuery, UpdateBillCommand } from '@api-gen';
import type { Bill, BillFilter, UpdateBill } from '../types';
import { convertToClientBillType, convertToServerBillType } from './convert-bill-type.converter';

export const convertBillToClient = (data: BillDto): Bill => {
	return {
		id: data.id!,
		number: data.number || 0,
		date: data.date || '',
		clientName: data.clientName || '',
		billType: convertToClientBillType(data.billType!),
		fileUrl: data.fileUrl || '',
		userId: data.userId || '',
	};
};

export const convertBillFiltersToServer = (data: BillFilter): GetBillWithPaginationParamsQuery => {
	return {
		number: +data.number || null,
		//TODO: Придумать что с датой делать
		clientName: data.clientName || '',
		billType: convertToServerBillType(data.billType!) || undefined,
	};
};

export const convertBillToServer = (data: UpdateBill): UpdateBillCommand => {
	return {
		id: data.id!,
		billType: convertToServerBillType(data.billType!),
	};
};
