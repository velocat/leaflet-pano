import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
//import eslint from '@rollup/plugin-eslint';
//import html from '@rollup/plugin-html';
//import html from 'html-rollup-plugin';
import html2 from 'rollup-plugin-html2';
import postcss from 'rollup-plugin-postcss';
import postcssCopy from 'postcss-copy';
import rollupGitVersion from 'rollup-plugin-git-version';
import {terser} from 'rollup-plugin-terser';
import {sizeSnapshot} from 'rollup-plugin-size-snapshot';
import visualizer from 'rollup-plugin-visualizer';
import autoNamedExports from 'rollup-plugin-auto-named-exports';
import postcssImport from 'postcss-import';
import postcssNormalize from 'postcss-normalize';
import externalGlobals from 'rollup-plugin-external-globals';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import cleanup from 'rollup-plugin-cleanup';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;
console.log('production:', production);

let plugin = require('./package.json');
let plugin_name = plugin.name.replace('@velocat/', '');

const path = require('path');
const RootDir = path.resolve(__dirname);

let input = plugin.module;
let output = {
	file: 'dist/' + plugin_name + '.js',
	format: 'umd',
	globals: {
		jquery: '$',
		leaflet: 'L'
	},
	sourcemap: true,
	name: plugin_name,
	extend: true,
	//preserveModules : true,
	/*manualChunks: {
		jquery: ['jquery'],
		leaflet: ['leaflet'],
	}*/
};

let plugins = [
	peerDepsExternal(), // Preferably set as first plugin.
	alias({
		entries: [
			{ find: '@', replacement: path.resolve(RootDir, 'src') },
			{ find: '~', replacement: path.resolve(RootDir, 'src/lib') }
		]
	}),
	autoNamedExports(),
	postcss(),
	resolve({
		jsnext: true,
		main: true,
		browser: true,
		skip: ['leaflet', 'jquery']
	}),
	
	commonJS({
		//include: '../node_modules/**'
	}),

	babel({ 
		//babelHelpers: 'bundled' 
		babelHelpers: 'runtime',
		plugins: [
			['@babel/plugin-transform-runtime',
				{
					corejs: 3,
				},
			]
		],
		exclude: ['node_modules/**',/runtime-corejs3/, /core-js/],
	}),

	externalGlobals({
		jquery: '$'
	}),
	
	rollupGitVersion(),
/*
	html({
		template: 'src/index.html',
		dest: 'dist',
		filename: 'index.html',
		inject: 'head',
		externals: [
			{type: 'css', file: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css', pos: 'before' },
			{type: 'js', file: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js', pos: 'before' },
			{type: 'js', file: 'https://code.jquery.com/jquery-3.5.1.min.js', pos: 'before' },
			{type: 'css', file: 'https://code.jquery.com/ui/1.12.1/themes/hot-sneaks/jquery-ui.css', pos: 'before' },
			{type: 'js', file: 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js', pos: 'before' },
			{type: 'css', file: 'https://unpkg.com/mapillary-js@2.18.0/dist/mapillary.min.css', pos: 'before' },
			{type: 'js', file: 'https://unpkg.com/mapillary-js@2.18.0/dist/mapillary.min.js', pos: 'before' }
		],
	}),
*/
	html2({
		// https://mentaljam.github.io/rollup-plugin-html2/interfaces/ipluginoptions.html
		//favicon: 'path',
		template: 'src/index.html',
		fileName: 'index.html',
		//inject: 'head',
		//preload: ['lib'],
		onlinePath: 'https://cdn.jsdelivr.net/npm/leaflet-pano@'+pkg.version+'/dist/',
		externals: [
			{type: 'css', file: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css', pos: 'before' },
			{type: 'js', file: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js', pos: 'before' },
			{type: 'js', file: 'https://code.jquery.com/jquery-3.5.1.min.js', pos: 'before' },
			{type: 'css', file: 'https://code.jquery.com/ui/1.12.1/themes/hot-sneaks/jquery-ui.css', pos: 'before' },
			{type: 'js', file: 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js', pos: 'before' },
			{type: 'css', file: 'https://unpkg.com/mapillary-js@2.18.0/dist/mapillary.min.css', pos: 'before' },
			{type: 'js', file: 'https://unpkg.com/mapillary-js@2.18.0/dist/mapillary.min.js', pos: 'before' }
		],
		//minify: {
		//	removeComments: true
		//},
	}),

	//eslint(),
	sizeSnapshot(),
	visualizer(),
	//serve(),
	//livereload('dist/'),
	//!production && livereload('dist/'),
];

export default [
	//** "leaflet-mapillary-pane.js" **//
	{
		input: input,
		output: output,
		plugins: (production) ? plugins.concat(cleanup()) : plugins.concat(serve()).concat(livereload('dist/')).concat(cleanup()),
		external: ['jquery, jquery-ui, leaflet']
	},

	//** "leaflet-mapillary-pane.min.js" **//
	{
		input: input,
		output: Object.assign({}, output, {
			file: 'dist/' + plugin_name + '.min.js'
		}),
		plugins: plugins.concat(terser()).concat(cleanup()),
		external: ['jquery, jquery-ui, leaflet']
	},

	//** "leaflet-mapillary-pane.css" **//
	{
		input: input.replace('.js', '.css'),
		output: {
			file: 'dist/' + plugin_name + '.css',
			format: 'es'
		},
		plugins: [
			postcssNormalize(
				/* pluginOptions (for PostCSS Normalize) */
			).postcssImport(),
			postcss({
				extract: true,
				inject: false,
				minimize: false,
				plugins: [
					postcssImport(),
					postcssCopy({
						basePath: ['node_modules', 'src/css'],
						dest: 'dist',
						template: 'images/[path][name].[ext]',
					})
				]
			}),
		]
	},

	//** "leaflet-mapillary-pane.min.css" **//
	{
		input: input.replace('.js', '.css'),
		output: {
			file: 'dist/' + plugin_name + '.min.css',
			format: 'es'
		},
		plugins: [
			postcssNormalize(
				/* pluginOptions (for PostCSS Normalize) */
			).postcssImport(),
			postcss({
				extract: true,
				inject: false,
				minimize: true,
				plugins: [
					postcssImport(),
					postcssCopy({
						basePath: ['node_modules', 'src/css'],
						dest: 'dist',
						template: 'images/[path][name].[ext]',
					})
				]
			}),
		]
	},

];
