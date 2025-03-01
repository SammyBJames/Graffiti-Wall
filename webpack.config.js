const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    mode: 'production',
    context: path.resolve(__dirname, 'src'),
    entry: {
        firebase: './firebase.js',
        realtime: './realtime.js',
        index: './index.js',
        edit: './edit.js',
        chat: './chat.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true
    },
    module: {
        rules: [
            { 
                test: /\.css$/, 
                use: ["style-loader", "css-loader"] 
            },
        ]
    },
    plugins: [
        new FaviconsWebpackPlugin({
            logo: './images/favicon.png'
        }),
        new HtmlWebpackPlugin({
            title: 'The Wall',
            filename: 'index.html',
            template: './pages/index.html',
            chunks: ['firebase', 'realtime', 'index']
        }),
        new HtmlWebpackPlugin({
            title: 'Edit The Wall',
            filename: 'edit.html',
            template: './pages/edit.html',
            chunks: ['firebase', 'edit']
        }),
        new HtmlWebpackPlugin({
            title: 'Chat - The Wall',
            filename: 'chat.html',
            template: './pages/chat.html',
            chunks: ['firebase', 'chat']
        })
    ],
    watch: true
};
