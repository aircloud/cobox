/**
 * Created by iconie on 22/08/2017.
 */
const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

//由于资源不多,使用happyPack并不能加速反而因为额外的开销减速,所以移除

var outPulgins = [];

if(process.env.NODE_ENV === "production") {
    outPulgins = [new UglifyJSPlugin()];
} else {

}

module.exports = {

    entry:{
        cobox: './src/index.js'
    },

    output:{
        path: path.join(__dirname, 'demo'),
        filename: '[name].min.js'
    },

    plugins: [
        ...outPulgins
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader?presets[]=es2015',
            }, {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },{
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1500
                        }
                    }
                ]
            }
        ]
    },
};
