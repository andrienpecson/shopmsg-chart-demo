"use strict";

const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const nunjucks = require('nunjucks');
const _ = require('underscore');

const ReportsApiRouter = require('./source/routers/ReportsApiRouter');

const IS_PROD = "NODE_ENV" in process.env && "production" === process.env.NODE_ENV;
const config = { isProd:IS_PROD };

const app = express();
app.set('port', (process.env.PORT || 5000));

if (!config.isProd) {
  // setup the webpack server
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const wpconf = _.extend(require('./webpack.config.js'), {
    "context" : __dirname + '/'
  });

  const compiler = webpack(wpconf);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: '/'
  }));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use('/v1.0', serveStatic(path.join(__dirname,'/v1.0'), {maxAge:'0', index:false}));
}
app.use(serveStatic(path.join(__dirname,'/public'), {
  maxAge : '1h',
  index : false
}));

// configure nunjucks template environment for express
nunjucks.configure(__dirname + '/templates', {
  autoescape : false,
  watch : !config.isProd
}).express(app);

app.use(new ReportsApiRouter(config));
app.get('/', function(req, res) {
  const models = {
    ...config
  };
  res.render('index.html', models);
});

app.listen(app.get('port'), () => console.log(`shopmsg-chart-demo running on port ${app.get('port')}`));