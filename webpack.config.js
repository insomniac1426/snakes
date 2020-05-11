var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	devtool: "soure-map-eval",
	entry: "./index.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: "babel-loader",
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.html$/,
				use: "html-loader",
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html",
			filename: "index.html",
		}),
	],
	devServer: {
		port: 3002,
		hot: true,
	},
};
