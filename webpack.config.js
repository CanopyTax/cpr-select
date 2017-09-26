var path = require('path');
var webpack = require('webpack');

var version = require('./package.json').version;
var name = require('./package.json').name;

module.exports = {
	entry: "./src/select.js",
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: name + '.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: path.resolve(__dirname, "node_modules"),
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							importLoaders: 1
						}
					},
					"postcss-loader"
				]
			},
			{
				test: /\.html$/,
				loader: "html-loader"
			}
		],
	},
	externals: {
		"react": "React",
		"lodash": "_"
	},
	plugins: [
		new webpack.BannerPlugin("\
" + name + "\n\
author: Bret Little\n\
copyright: 2015\n\
license: MIT\n\
version: " + version)
	]
};
