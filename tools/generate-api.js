const generateApi = require('swagger-typescript-api').generateApi;
const apiUrl = 'https://192.168.10.23:5001/swagger/v1/swagger.json';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

generateApi({
	name: 'api.ts',
	output: '../../../src/api-gen',
	url: apiUrl,
	httpClientType: 'axios',
	nameVariants: {
		patterns: ['camelCase'],
	},
})
	.then(() => {
		console.log('API generation completed successfully.');
	})
	.catch((error) => {
		console.error('Error during API generation:', error.message);
	});
