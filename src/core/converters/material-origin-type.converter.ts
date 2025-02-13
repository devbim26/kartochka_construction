import { MaterialOriginType as ServerMaterialOriginType } from '@api-gen';
import { createDataRecordConverter } from '@core/utils';
import { MaterialType as ClientMaterialOriginType } from '@features';

export const MaterialOriginTypeConverter = createDataRecordConverter({
	[ClientMaterialOriginType.Generic]: ServerMaterialOriginType.Generic,
	[ClientMaterialOriginType.Manufacturer]: ServerMaterialOriginType.Manufacturer,
	[ClientMaterialOriginType.UserDefinedProduct]: ServerMaterialOriginType.UserDefinedProduct,
});
