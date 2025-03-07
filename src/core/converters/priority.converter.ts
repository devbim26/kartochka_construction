import { Priority as ServerPriority } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers';
import { Priority as ClientPriority } from '@features/guidbooks/types';

export const priorityMap = createDataRecordConverter({
	[ClientPriority.]: ServerPriority.Low,
	[ClientPriority.Medium]: ServerPriority.Medium,
	[ClientPriority.High]: ServerPriority.High,
});

export const convertToServerPriorityData = (type: ClientPriority): ServerPriority => {
	return priorityMap.toServer[type];
};

export const convertToClientPriorityData = (type: ServerPriority): ClientPriority => {
	return priorityMap.toClient[type];
};
