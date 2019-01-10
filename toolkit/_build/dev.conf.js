/**
 * @filename webpack.dev.conf.js
 * @description 开发环境(dev)配置文件
 * @author 1000px
 * @fileoverview 为什么要区分环境？
 * 在开发网页的时候，一般会有两套环境
 * -1--开发过程中方便调试的dev环境
 * -2--发布到线上为用户使用的prod环境
 * 两套环境主要有以下区别
 * -1--线上代码需要压缩混淆
 * -2--开发用代码需要提供开发者日志，console.log等，普通用户不该看到这些信息
 * -3--开发用后端数据接口与线上环境接口地址有可能不同
 */
const path = require('path');
const WebpackBaseConf = require('./base.conf');
const devServer = require('webpack-dev-server');
const webpack = require('webpack');
const merge = require('webpack-merge');

const Config = merge(WebpackBaseConf, {
    /**
     * @module 启用本地服务器
     * @properties
     * -1--contentBase 服务器访问的根目录
     * -2--port 服务器的端口号
     * -3--index 设置服务器根目录映射到的html文件地址
     */
    devServer: {
        contentBase: path.join(__dirname, '../output'),
        index: 'index.html',
        port: 8080
    },
    /**
     * @dev环境插件列表
     * -1--hot-module-replace-plugin 模块热加载
     */
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});

/**
 * 导出dev环境配置对象
 * 以便webpack-dev-server使用
 */
module.exports = Config;