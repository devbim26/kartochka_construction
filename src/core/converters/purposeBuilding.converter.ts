import { PurposeBuilding as ServerPurposeBuilding } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers';
import { PurposeBuilding as ClientPurposeBuilding } from '@features/constructor/types';

export const purposeBuildingMap = createDataRecordConverter({
	[ClientPurposeBuilding.LargePanelBuilding]: ServerPurposeBuilding.LargePanelBuilding,
	[ClientPurposeBuilding.FramePanelBuilding]: ServerPurposeBuilding.FramePanelBuilding,
});

export const convertToServerPurposeBuildingData = (
	type: ClientPurposeBuilding,
): ServerPurposeBuilding => {
	return purposeBuildingMap.toServer[type];
};

export const convertToClientPurposeBuildingData = (
	type: ServerPurposeBuilding,
): ClientPurposeBuilding => {
	return purposeBuildingMap.toClient[type];
};
