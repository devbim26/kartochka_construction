import { IndexType as ServerIndexType } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers';
import { IndexType as ClientIndexType } from '@features/guidbooks/types';

export const indexTypeMap = createDataRecordConverter({
	[ClientIndexType.Rw]: ServerIndexType.Rw,
	[ClientIndexType.Lnw]: ServerIndexType.Lnw,
	[ClientIndexType.ValueΔRw]: ServerIndexType.ValueΔRw,
});

export const convertToServerIndexTypeData = (type: ClientIndexType): ServerIndexType => {
	return indexTypeMap.toServer[type];
};

export const convertToClientIndexTypeData = (type: ServerIndexType): ClientIndexType => {
	return indexTypeMap.toClient[type];
};
