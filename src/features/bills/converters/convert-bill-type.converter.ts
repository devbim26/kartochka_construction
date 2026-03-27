import { BillTypeEnum } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers/enum-converter.helper';
import { BillTypeEnum as ClientBillTypeEnum } from '../types';

const billTypeCategoryMap = createDataRecordConverter({
	[BillTypeEnum.Paid]: ClientBillTypeEnum.Paid,
	[BillTypeEnum.UnPaid]: ClientBillTypeEnum.UnPaid,
});

export const convertToServerBillType = (billType: ClientBillTypeEnum): BillTypeEnum => {
	return billTypeCategoryMap.toServer[billType];
};

export const convertToClientBillType = (billType: BillTypeEnum): ClientBillTypeEnum => {
	return billTypeCategoryMap.toClient[billType];
};
