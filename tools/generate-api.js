const fs = require('fs');
const path = require('path');
const generateApi = require('swagger-typescript-api').generateApi;
const apiUrl = 'http://192.168.10.23:5000/swagger/v1/swagger.json';
const apiFilePath = path.join(__dirname, '../src/api-gen/api.ts');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/** Дополняет GraphType значениями ударного шума, пока их нет в swagger. */
const patchGraphTypeEnum = () => {
	let content = fs.readFileSync(apiFilePath, 'utf8');
	if (content.includes('ComputedImpact')) {
		console.log('GraphType already includes impact variants.');
		return;
	}

	const patched = content.replace(
		/(\tComputed = 'Computed',)\r?\n(\tLaboratory = 'Laboratory',)/,
		"$1\r\n\tComputedImpact = 'ComputedImpact',\r\n$2\r\n\tLaboratoryImpact = 'LaboratoryImpact',",
	);
	if (patched === content) {
		throw new Error('Failed to patch GraphType enum in api.ts');
	}
	fs.writeFileSync(apiFilePath, patched);
	console.log('Patched GraphType: ComputedImpact, LaboratoryImpact.');
};

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
		patchGraphTypeEnum();
		console.log('API generation completed successfully.');
	})
	.catch((error) => {
		console.error('Error during API generation:', error.message);
		process.exit(1);
	});
