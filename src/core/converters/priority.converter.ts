import { Priority as ServerPriority } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers';
import { Priority as ClientPriority } from '@features/guidbooks/types';

export const priorityMap = createDataRecordConverter({
	[ClientPriority.Zero]: ServerPriority.Low,
	[ClientPriority.One]: ServerPriority.Medium,
	[ClientPriority.Two]: ServerPriority.High,
	[ClientPriority.Three]: ServerPriority.High,
	[ClientPriority.Four]: ServerPriority.High,
	[ClientPriority.Five]: ServerPriority.High,
	[ClientPriority.Six]: ServerPriority.High,
	[ClientPriority.Seven]: ServerPriority.High,
	[ClientPriority.Eight]: ServerPriority.High,
	[ClientPriority.Nine]: ServerPriority.High,
	[ClientPriority.Ten]: ServerPriority.High,
});

export const convertToServerPriorityData = (type: ClientPriority): ServerPriority => {
	return priorityMap.toServer[type];
};

export const convertToClientPriorityData = (type: ServerPriority): ClientPriority => {
	return priorityMap.toClient[type];
};
