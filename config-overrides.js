const packageJson = require('./package.json');
const path = require('path')

module.exports = {
    webpack: (config) => {
        config.output.library = `${packageJson.name}-[name]`;
        config.output.libraryTarget = 'umd';
        // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
        config.output.chunkLoadingGlobal = `webpackJsonp_${packageJson.name}`;
        config.output.globalObject = 'window';

        config.resolve.alias = {
            '@': path.resolve(__dirname, 'src'),
            'reduxDir': path.resolve(__dirname, 'src/redux')
        }

        return config;
    },

    devServer: (_) => {
        const config = _;

        config.headers = {
            'Access-Control-Allow-Origin': '*',
        };
        config.historyApiFallback = true;
        config.hot = false;
        config.watchContentBase = false;
        config.liveReload = false;

        return config;
    },
};