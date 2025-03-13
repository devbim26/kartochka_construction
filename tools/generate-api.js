const generateApi = require('swagger-typescript-api').generateApi;
const apiUrl = 'http://192.168.10.23:5000/swagger/v1/swagger.json';

if (!apiUrl) {
	console.error('API URL is not defined in .env file');
	// eslint-disable-next-line no-undef
	process.exit(1);
}

generateApi({
	name: 'api.ts',
	output: '../../../src/api-gen',
	url: apiUrl,
	httpClientType: 'axios',
	nameVariants: {
		patterns: ['camelCase'], // Выбор CamelCase для имен
	},
})
	.then(() => {
		console.log('API generation completed successfully.');
	})
	.catch((error) => {
		console.error('Error during API generation:', error.message);
	});
