import { fetchApi } from '@api-gen';

export const checkAiAccess = async (): Promise<boolean> => {
	try {
		const response = await fetchApi.api.openRouterModelsIsHaveAccessList();
		return response.status === 200;
	} catch {
		return false;
	}
};
