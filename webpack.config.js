var webpack = require('webpack');
var path = require('path');
var production = process.env.NODE_ENV === 'production';

module.exports = {
	devtool: production ? '#source-map' : '#eval',
	entry: production ? ['./src/app.js'] : [
		'webpack-dev-server/client?http://localhost:3000',
		'webpack/hot/only-dev-server',
		'./src/app.js'
	],
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'app.js',
		publicPath: '/build/'
	},
	resolve: {
		extensions: ['', '.js'],
		modulesDirectories: ['node_modules', 'bower_components', 'src']
	},
	module: {
		loaders: [
			{test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
			{test: /\.css$/, loader: 'style!css!autoprefixer?browsers=last 2 version'},
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				BROWSER: JSON.stringify(true),
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		})
	].concat(production ? [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	] : [
		new webpack.HotModuleReplacementPlugin()
	]),
	svgoConfig: [
		{removeTitle: true},
		{convertColors: {shorthex: false}},
		{convertPathData: false}
	]
};
