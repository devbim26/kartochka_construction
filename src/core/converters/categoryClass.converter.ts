import { CategoryClass as ServerCategoryClass } from '@api-gen/api';
import { createDataRecordConverter } from '@core/utils/helpers';
import { CategoryClass as ClientCategoryClass } from '@features/guidbooks/types';

export const categoryClassMap = createDataRecordConverter({
	[ClientCategoryClass.General]: ServerCategoryClass.General,
	[ClientCategoryClass.A]: ServerCategoryClass.A,
	[ClientCategoryClass.B]: ServerCategoryClass.B,
	[ClientCategoryClass.C]: ServerCategoryClass.C,
});

export const convertToServerCategoryClassData = (
	type: ClientCategoryClass,
): ServerCategoryClass => {
	return categoryClassMap.toServer[type];
};

export const convertToClientCategoryClassData = (
	type: ServerCategoryClass,
): ClientCategoryClass => {
	return categoryClassMap.toClient[type];
};
