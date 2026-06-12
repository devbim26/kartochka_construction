import { fetchApi } from '@api-gen';

export const checkAiAccess = async (): Promise<boolean> => {
	try {
		const response = await fetchApi.api.openRouterModelsIsHaveAccessList();
		return Boolean(response.data?.id);
	} catch {
		return false;
	}
};
