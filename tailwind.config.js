import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				raleway: ['Raleway', 'sans-serif'],
				sans: ['Source Sans Pro', 'sans-serif'],
			},
			colors: {
				primary: '#2175F3',
				gray: {
					navHeader: '#F5F6F7',
					navBg: '#F9F9F9',
					border: '#EDEFF2',
				},
				input: {
					border: {
						primary: '#CFD0D1',
					},
					value: {
						black: '#14181F',
					},
					label: {
						primary: '#6F7671',
					},
				},
				error: '#FF0800',
				background: {
					container: '#FFFFFF',
					primary: '#F9F9F9',
					secondary: '#F5F6F7',
					button: {
						secondary: '#EDF2FA',
					},
				},
			},
		},
	},
	plugins: [
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.scrollbar-none': {
					'-ms-overflow-style': 'none',
					/* Internet Explorer 10+ */ 'scrollbar-width': 'none' /* Firefox */,
				},
				'.scrollbar-none::-webkit-scrollbar': { display: 'none' /* Safari and Chrome */ },
			});
		}),
	],
};
