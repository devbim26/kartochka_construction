import { createDataRecordConverter } from '@core';
import { ConstructionClass as ClientConstructionType } from '@features/guidbooks/types';

export const constructionTypeMap = createDataRecordConverter({
	[ClientConstructionType.Wall]: ClientConstructionType.Wall,
	[ClientConstructionType.Floor]: ClientConstructionType.Floor,
});

export const convertToServerConstructionTypeData = (
	type: ClientConstructionType,
): ClientConstructionType => {
	return constructionTypeMap.toServer[type];
};

export const convertToClientConstructionTypeData = (
	type: ClientConstructionType,
): ClientConstructionType => {
	return constructionTypeMap.toClient[type];
};
