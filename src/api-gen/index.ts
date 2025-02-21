import { Api } from './api';

const apiURL = process.env.REACT_APP_API_URL;

export const fetchApi = new Api({
	baseURL: 'https://192.168.10.23:5001',
	withCredentials: true,
	headers: {
		'Access-Control-Allow-Origin': 'https://localhost:3000',
		'Access-Control-Allow-Credentials': 'true',
	},
});

export * from './api';
