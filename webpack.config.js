const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

const runStatus = process.env.NODE_ENV;

module.exports = {
	mode: runStatus,
	entry: path.resolve(__dirname, './src/index.tsx'),
	output: {
		filename: runStatus === 'production' ? '[name].[contenthash].js' : '[name].js',
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
				use: {
					loader: 'ts-loader',
					options: {
						transpileOnly: true,
						compilerOptions: {
							sourceMap: runStatus === 'development',
						},
					},
				},
			},
			{
				test: /\.s[ac]ss$/i,
				exclude: /node_modules/,
				use: [
					runStatus === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: runStatus === 'development',
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: runStatus === 'development',
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: runStatus === 'development',
						},
					},
				],
			},
			{
				test: /\.css$/i,
				use: [
					runStatus === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: runStatus === 'development',
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: runStatus === 'development',
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: runStatus === 'development',
						},
					},
				],
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},
		],
	},
	devtool: 'source-map',
	devServer: {
		watchFiles: path.resolve(__dirname, './src'),
		compress: true,
		open: ['/landing'],
		hot: true,
		port: 3000,
		historyApiFallback: true,
		client: {
			logging: 'error',
		},
		devMiddleware: {
			stats: 'minimal',
		},
		server: {
			type: 'https',
			options: {
				pfx: fs.readFileSync(
					path.resolve(__dirname, './credentials', 'astra-local.ds.pfx'),
				),
				passphrase: 'DSPass2024',
			},
		},
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, './public/index.html'),
			filename: 'index.html',
		}),
		new MiniCssExtractPlugin({
			filename: runStatus === 'production' ? '[name].[contenthash].css' : '[name].css',
		}),
		new webpack.DefinePlugin({
			'process.env': Object.keys(process.env)
				.filter((key) => key.startsWith('REACT_APP_'))
				.reduce((acc, key) => {
					acc[key] = JSON.stringify(process.env[key]);
					return acc;
				}, {}),
		}),
	],
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
	},
};
