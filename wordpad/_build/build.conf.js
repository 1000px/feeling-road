/**
 * @filename webpack.prod.conf.js
 * @description 发布环境(prod)配置文件
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
const webpack = require('webpack');
const merge = require('webpack-merge');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

process.env.NODE_ENV = JSON.stringify('production');

const Config = merge(WebpackBaseConf, {
    /**
     * @prod环境插件列表
     * 
     * @module webpack-parallel-uglify-plugin
     * @description 该插件会开启多个子进程，将对多个文件的压缩工作分配给多个
     * 子进程去完成
     * 
     */
    plugins: [
        new ParallelUglifyPlugin({
            uglifyJS: {
                output: {
                    beautify: false, // 最紧凑的输出
                    comments: false, // 删除所有注释
                },
                compress: {
                    warnings: false, // 在UglifyJS删除没有用到的js代码时，不输出警告
                    drop_console: true, // 删除所有的console语句
                    collapse_vars: true, // 内嵌已定义的仅用到一次的变量
                    reduce_vars: true // 提取出现多次但没有定义成变量的静态值
                }
            }
        })
    ]
});

/**
 * 导出prod环境配置对象
 * 以便webpack使用
 */
module.exports = Config;