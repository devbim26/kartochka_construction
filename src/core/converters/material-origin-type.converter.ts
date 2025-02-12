import { MaterialOriginType as ServerMaterialOriginType } from '@api-gen';
import { createDataRecordConverter } from '@core/utils';
import { MaterialType as ClientMaterialType } from '@features';

export const MaterialOriginTypeConverter = createDataRecordConverter({
	[ClientMaterialType.Generic]: ServerMaterialOriginType.Generic,
	[ClientMaterialType.Manufacturer]: ServerMaterialOriginType.Manufacturer,
	[ClientMaterialType.UserDefinedProduct]: ServerMaterialOriginType.UserDefinedProduct,
});
