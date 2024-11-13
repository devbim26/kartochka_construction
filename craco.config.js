const path = require('path');
const CracoAlias = require('craco-alias');

module.exports = {
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
