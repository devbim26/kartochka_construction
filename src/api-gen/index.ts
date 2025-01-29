import { Api } from './api';

export const fetchApi = new Api({
	baseURL: 'https://192.168.10.23:5001',
});
export * from './api';
