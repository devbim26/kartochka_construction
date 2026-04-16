export type Bill = {
	id: string;
	number: number;
	date: string;
	clientName: string;
	billType: BillTypeEnum;
	fileUrl: string;
	userId: string;
	subsctiptionName: string;
};

export type UpdateBill = {
	id: string;
	number?: number;
	date?: string;
	billType: BillTypeEnum;
	userId: string;
};

export type BillFilter = {
	number: string;
	date: string;
	clientName: string;
	billType: BillTypeEnum;
};

export enum BillTypeEnum {
	UnPaid = 'UnPaid',
	Paid = 'Paid',
}

export const billType2title: Record<BillTypeEnum, string> = {
	UnPaid: 'Не оплачен',
	Paid: 'Оплачен',
};

export const BillTypeSelectValues = [
	{ label: billType2title[BillTypeEnum.Paid], value: BillTypeEnum.Paid },
	{ label: billType2title[BillTypeEnum.UnPaid], value: BillTypeEnum.UnPaid },
];
