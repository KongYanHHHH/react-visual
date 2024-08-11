const path = require('path');

const packageName = require('./package.json').name;

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            // 设置输出库名称和UMD目标
            // webpackConfig.output.library = `${packageName}-[name]`;
            // webpackConfig.output.libraryTarget = 'umd';
            webpackConfig.output.library = {
                name: `${packageName}-[name]`,
                type: 'umd',
            };
            webpackConfig.output.chunkLoadingGlobal = `webpackJsonp_${packageName}`;
            webpackConfig.output.globalObject = 'window';

            // 添加别名
            webpackConfig.resolve.alias = {
                ...webpackConfig.resolve.alias,
                '@': path.resolve(__dirname, 'src'),
                reduxDir: path.resolve(__dirname, 'src/redux'),
            };
            
            if (env === 'production') {
                // 打包配置
                webpackConfig.optimization = {
                    ...webpackConfig.optimization,
                    runtimeChunk: 'single',
                    moduleIds: 'deterministic',
                    splitChunks: {
                        chunks: 'all',
                        minChunks: 2,
                        cacheGroups: {
                            vendor: {
                                test: /[\\/]node_modules[\\/]/,
                                name: 'vendors',
                                chunks: 'all',
                            },
                        },
                    },
                };

                webpackConfig.devtool = 'source-map';
            }

            return webpackConfig;
        },
    },
    devServer: {
        proxy: {
            // 将以 '/api' 开头的请求代理到本地的 Egg.js 服务
            '/api': {
                target: 'http://www.yan121.com', // 线上
                // target: 'http://localhost:7001', // 本地
                changeOrigin: true, // 允许跨域
                pathRewrite: { '^/api(.*)': '/api/egg$1' }, // 重写路径，改为 '/api/egg'
            },
        },
    },
};
