const path = require('path');
const CracoAlias = require('craco-alias');

module.exports = {
	webpack: {
		alias: {
			'@*': path.resolve(__dirname, './src/*'),
			'@router': path.resolve(__dirname, './src/router'),
			'@router/*': path.resolve(__dirname, './src/router/*'),
			'@core': path.resolve(__dirname, './src/core'),
			'@core/*': path.resolve(__dirname, './src/core/*'),
			'@features': path.resolve(__dirname, './src/features'),
			'@features/*': path.resolve(__dirname, './src/features/*'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@assets/*': path.resolve(__dirname, './src/assets/*'),
			'@api-gen': path.resolve(__dirname, './src/api-gen'),
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
