/**
 * @file: webpack.base.conf.js
 * @description: webpack公共基础配置，entry、output
 * @desc: 一切文件如JavaScript、CSS、SCSS、图片、模板，对于Webpack来说
 * 都是一个个模板，这样的好处是能清晰地描述各个模块之间的依赖关系，方便
 * webpack对模块进行组合和打包。
 * @核心概念:
 * Entry: 入口，Webpack执行构建的第一步从这里开始，可抽象成输入
 * Module: 模块，在Webpack里一切皆模块，一个模块对应一个文件，Webpack会从
 * 配置的Entry开始递归找出所有依赖的模块
 * Chunk:代码块，一个Chunk由多个模块组合而成，用于代码合并与分割
 * Loader:模块转换器，用于将模块的原内容按照需求转换成新的内容
 * Plugin: 扩展插件，在Webpack构建流程中的特定时机注入扩展逻辑，来改变构建
 * 结果或做我们想要的事情
 * Output: 输出结果，在Webpack经过一系列处理并得出最终想要的代码后输出结果。
 * @author 1000px
 * ------
 * @插件说明
 * html-webpack-plugin: 
 *  -1--为多个单页应用生成html入口文件
 *  -2--为html文件中动态引入script、link等外部文件
 * clean-webpack-plugin: 在每次编译之前清空output文件夹
 * vue-loader/lib/plugin: 这个插件是必须的，它的职责是将定义过的其它规则复制
 * 并应用到.vue文件里相应语言块。例如，有一条匹配/\.js$/的规则，那么该插件就
 * 能够将之应用到.vue文件里的<script>块。
 * copy-webpack-plugin: 拷贝文件插件
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HappyPack = require('happypack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const Config = {
    /**
     * Entry类型可以是以下三种中的一种或者相互组合
     * 1--'app/entry', 入口模块的文件路径，可以是相对路径
     * 2--['./app/entry1', './app/entry2'], 入口模块的文件路径，可以是相对路径
     * 3--{a: './app/entry1', b: './app/entry2'}, 配置多入口，每个入口生成一个chunk 
     */
    entry: {
        'plain': './app-kit/app.js'
    },
    output: {
        /**
         * 输出的chunk文件名称
         */
        filename: '[name]-[hash:6].js',
        path: path.resolve(__dirname, '../output')
    },
    /**
     * resolve
     * Resolve配置webpack如何寻找模块所对应的文件。
     * -1--alias 通过别名将原导入路径映射成一个新的导入路径
     */
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'styles': path.resolve(__dirname, '../styles')
        }
    },
    /**
     * 输出source-map，以方便直接调试es6源码
     */
    devtool: 'source-map',
    /**
     * @module Loaders
     * @description 针对不同的模块，调用相应loader
     */
    module: {
        rules: [
            /**
             * css loader
             */
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                // use: ['happypack/loader?id=css'],
                // exclude: /node_modules/
            }, 
            /**
             * scss loader
             */
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
                // use: ['happypack/loader?id=scss'],
                exclude: /node_modules/
            }, 
            /**
             * vue vue-loader
             */
            {
                test: /\.vue$/,
                use: ['vue-loader'],
                // use: ['happypack/loader?id=vue'],
                exclude: /node_modules/
            },
            /**
             * js babel-loader es6
             */
            {
                test: /\.js$/,
                // use: ['babel-loader'],
                use: ['happypack/loader?id=babel'],
                exclude: /node_modules/
            },
            /**
             * img binary url-loader
             */
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // 30kb以下使用url-loader
                        limit: 1024 * 30,
                        name:'[name].[ext]',
                        outputPath:'styles/img',
                        fallback: 'file-loader'
                    }
                }],
                exclude: /node_modules/
            },
            /**
             * 字体图标 url-loader
             */
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
             },
        ]
    },
    /**
     * @module 插件的使用 plugins
     * 
     * @module html-webpack-plugin
     * @description 多页应用html入口设置
     * 
     * @module clean-webpack-plugin
     * @description 在重新编译输出之前清空output文件夹
     * 
     * @module copy-webpack-plugin
     * @description 拷贝文件
     * 
     * @module VueLoaderPlugin
     * @description VueLoader的插件，负责将vue文件中的template script style
     * 的代码使用何时的loader进行解析
     * 
     * @module happypack
     * @description 将所有打包操作进行多进程处理，文件量大时可提升速度
     */
    plugins: [
        new HtmlWebpackPlugin({
            template: './tpls/vue-tpl.html',
            filename: 'index.html',
            chunks: ['plain']
        }),
        new CleanWebpackPlugin([path.join(__dirname, '../output/')], {
            allowExternal: true,
            exclude: ['dll']
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../plugins'),
                to: path.resolve(__dirname, '../output/plugins')
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../config'),
                to: path.resolve(__dirname, '../output/config')
            }
        ]),
        new VueLoaderPlugin(),
        new HappyPack({
            id: 'babel',
            loaders: ['babel-loader']
        })
    ]
}

/**
 * 配置文件导出
 * 在webpack.dev.conf.js与webpack.prod.conf.js中引入
 */
module.exports = Config;