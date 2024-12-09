import { apiUrl } from '../non-alias';
import { Api } from './api';

export const fetchApi = new Api({
	baseURL: apiUrl,
});
export * from './api';
