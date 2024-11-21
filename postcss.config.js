const tailwindConfig = require('./tailwind.config');
const tailwindcss = require('tailwindcss');

module.exports = {
	plugins: { tailwindcss: tailwindcss(tailwindConfig), autoprefixer: {} },
};
