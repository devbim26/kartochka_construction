/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				gray: {
					navHeader: '#F5F6F7',
					navBg: '#F9F9F9',
				},
			},
		},
	},
	plugins: [],
};
