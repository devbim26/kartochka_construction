import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';

export default defineConfig(async () => {
	const { default: tsconfigPaths } = await import('vite-tsconfig-paths');

	return {
		server: {
			host: 'localhost',
			port: 3000,
		},
		plugins: [react(), tsconfigPaths()],
		resolve: {
			alias: {
				'@assets': resolve(__dirname, './src/assets'),
				'@core': resolve(__dirname, './src/core'),
				'@features': resolve(__dirname, './src/features'),
				'@api-gen': resolve(__dirname, './src/api-gen'),
				'@router': resolve(__dirname, './src/router'),
			},
		},
		css: {
			postcss: {
				plugins: [tailwindcss()],
			},
		},
	};
});
