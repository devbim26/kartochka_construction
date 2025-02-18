import { MaterialOriginType as ServerMaterialOriginType } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers';
import { MaterialOriginType as ClientMaterialOriginType } from '@features/guidbooks/types';

export const materialOriginTypeMap = createDataRecordConverter({
	[ClientMaterialOriginType.Generic]: ServerMaterialOriginType.Generic,
	[ClientMaterialOriginType.Manufacturer]: ServerMaterialOriginType.Manufacturer,
	[ClientMaterialOriginType.UserDefinedProduct]: ServerMaterialOriginType.UserDefinedProduct,
});

export const convertToServerMaterialOriginTypeData = (
	type: ClientMaterialOriginType,
): ServerMaterialOriginType => {
	return materialOriginTypeMap.toServer[type];
};

export const convertToClientMaterialOriginTypeData = (
	type: ServerMaterialOriginType,
): ClientMaterialOriginType => {
	return materialOriginTypeMap.toClient[type];
};
