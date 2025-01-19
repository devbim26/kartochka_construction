import { Api } from './api';

export const fetchApi = new Api({
	baseURL: process.env.REACT_APP_API_URL,
});
export * from './api';
