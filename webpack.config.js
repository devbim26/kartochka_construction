const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

module.exports = {
	mode: production ? 'production' : 'development',
	entry: path.resolve(__dirname, './src/index.tsx'),
	output: {
		filename: production ? '[name].[contenthash].js' : '[name].js',
		path: path.resolve(__dirname, './build'),
    publicPath: '/',
		clean: true,
	},
	resolve: {
		plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
			{
				test: /\.(tsx|ts)$/,
				use: 'ts-loader',
			},
			{
				test: /\.s[ac]ss$/i,
				exclude: /node_modules/,
				use: [
					production ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: !production,
						},
					},
          {
						loader: 'postcss-loader',
						options: {
							sourceMap: !production,
						},
					},
          {
						loader: 'sass-loader',
						options: {
							sourceMap: !production,
						},
					},
				],
			},
      {
        test: /\.css$/i,
        use: [
          production ? MiniCssExtractPlugin.loader : 'style-loader',
          {
						loader: 'css-loader',
						options: {
							sourceMap: !production,
						},
					},
          {
						loader: 'postcss-loader',
						options: {
							sourceMap: !production,
						},
					},
          {
						loader: 'sass-loader',
						options: {
							sourceMap: !production,
						},
					},
        ],
      },
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[hash].[ext]',
						},
					},
				],
			},
		],
	},
	devtool: 'source-map',
	devServer: {
		watchFiles: path.join(__dirname, 'src'),
		compress: true,
		open: true,
		hot: true,
		port: 3000,
		historyApiFallback: true,
		client: {
			logging: 'error',
		},
		devMiddleware: {
			stats: 'minimal',
		},
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, './public/index.html'),
			filename: 'index.html',
		}),
		new MiniCssExtractPlugin({
			filename: production ? '[name].[contenthash].css' : '[name].css',
		}),
	],
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
	},
};
