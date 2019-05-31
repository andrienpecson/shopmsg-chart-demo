"use strict";

const webpack = require('webpack');
const _ = require('underscore');

const IS_PROD = "NODE_ENV" in process.env && ("production" === process.env.NODE_ENV || "staging" === process.env.NODE_ENV);

const moduleRules = [
  { test: /\.css$/, loader: "style-loader!css-loader" },
  {
    test: /\.less$/,
    use : [
      { loader : 'style-loader' },
      { loader : 'css-loader' },
      {
        loader: "less-loader",
        options : {
          javascriptEnabled: true
        }
      }
    ]
  },
  { test: /\.tsx?$/, loader: 'awesome-typescript-loader', exclude : /node_modules/ },
  {
    test: /.jsx?$/,
    exclude : /node_modules/,
    use: {
      loader : 'babel-loader',
      options : {
        presets : ['es2015', 'es2016', 'react', 'stage-1']
      }
    }
  },
  { // babel so that we can use es2016 features
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use : {
      loader: 'babel-loader',
      options: {
        presets: ['es2015', 'es2016', 'stage-1']
      }
    }
  }
]
if (!IS_PROD) {
  // addition - add source-map support
  moduleRules.push({ enforce: "pre", test: /\.js$/, loader: "source-map-loader" });
}

module.exports = {
    mode: IS_PROD ? "production" : "development",
    entry: {
      'app' : "./client/dashboard/index.tsx",
      // vendor.js has all common 3rd party libraries
      'vendor' : ['react', 'prop-types', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'react-router-dom', 'antd', 'underscore']
    },
    output: {
        path: __dirname,
        publicPath: "/",
        filename: "v1.0/shopmsg_[name].js",
        chunkFilename : "v1.0/[id]_[name].chunk.js"
    },
    module: { rules : moduleRules },
    optimization : {
      minimize : IS_PROD,
      splitChunks : {
        cacheGroups : {
          vendor : {
            chunks: (/*chunk*/) => true,
            test: "vendor",
            name: "vendor",
            enforce: true
          }
        }
      }
    },
    devtool: IS_PROD ? undefined : 'source-map',
    plugins : IS_PROD ? [
      new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')})
    ] : [ ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    }
};
