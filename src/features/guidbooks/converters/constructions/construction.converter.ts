import { ConstructionClass as ServerConstructionType } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers';
import { ConstructionType as ClientConstructionType } from '@features/guidbooks/types';

export const constructionTypeMap = createDataRecordConverter({
	[ClientConstructionType.Wall]: ServerConstructionType.Wall,
	[ClientConstructionType.Floor]: ServerConstructionType.Floor,
});

export const convertToServerConstructionTypeData = (
	type: ClientConstructionType,
): ServerConstructionType => {
	return constructionTypeMap.toServer[type];
};

export const convertToClientConstructionTypeData = (
	type: ServerConstructionType,
): ClientConstructionType => {
	return constructionTypeMap.toClient[type];
};
