import { Api } from './api';

export const fetchApi = new Api({
	baseURL: 'https://192.168.12.61:5001',
});
export * from './api';
