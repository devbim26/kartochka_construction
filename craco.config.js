const path = require('path');
const CracoAlias = require('craco-alias');

module.exports = {
	webpack: {
		alias: {
			'@assets': path.resolve(__dirname, './src/assets'),
			'@core': path.resolve(__dirname, './src/core'),
			'@features': path.resolve(__dirname, './src/features'),
			'@api-gen': path.resolve(__dirname, './src/api-gen'),
			'@router': path.resolve(__dirname, './src/router'),
		},
	},
	plugins: [
		{
			plugin: CracoAlias,
			options: {
				source: 'tsconfig',
				tsConfigPath: path.resolve(__dirname, 'tsconfig.json'),
			},
		},
	],
};
