import { Priority as ServerPriority } from '@api-gen';
import { createDataRecordConverter } from '@core/utils/helpers';
import { Priority as ClientPriority } from '@features/guidbooks/types';

export const priorityMap = createDataRecordConverter({
	[ClientPriority.Zero]: ServerPriority.Zero,
	[ClientPriority.One]: ServerPriority.One,
	[ClientPriority.Two]: ServerPriority.Two,
	[ClientPriority.Three]: ServerPriority.Three,
	[ClientPriority.Four]: ServerPriority.Four,
	[ClientPriority.Five]: ServerPriority.Five,
	[ClientPriority.Six]: ServerPriority.Six,
	[ClientPriority.Seven]: ServerPriority.Seven,
	[ClientPriority.Eight]: ServerPriority.Eight,
	[ClientPriority.Nine]: ServerPriority.Nine,
	[ClientPriority.Ten]: ServerPriority.Ten,
});

export const convertToServerPriorityData = (type: ClientPriority): ServerPriority => {
	return priorityMap.toServer[type];
};

export const convertToClientPriorityData = (type: ServerPriority): ClientPriority => {
	return priorityMap.toClient[type];
};
