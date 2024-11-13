import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	{
		extends: ['prettier'],
	},
	{
		settings: {
			'import/resolver': {
				alias: {
					map: [
						['@components', path.resolve(__dirname, 'src/components')],
						['@pages', path.resolve(__dirname, 'src/pages')],
						['@assets', path.resolve(__dirname, 'src/assets')],
						['@router', path.resolve(__dirname, 'src/router')],
						['@features', path.resolve(__dirname, 'src/features')],
					],
					extensions: ['.ts', '.js', '.jsx', 'tsx', '.json'],
				},
			},
		},
	},
];
