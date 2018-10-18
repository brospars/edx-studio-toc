var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WebpackOnBuildPlugin = require('on-build-webpack')
var fs = require('fs')

module.exports = {
  configureWebpack: {
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Table of Content',
        template: 'public/index.html',
        inlineSource: '.(js|css)$' // embed all javascript and css inline
      }),
      new HtmlWebpackInlineSourcePlugin(),
      new WebpackOnBuildPlugin(function (stats) {
        var options = {
          appSrc: './dist/index.html',
          input: './src/bookmark/bookmark.js',
          output: './dist/bookmark.js'
        }

        fs.readFile(options.appSrc, 'utf8', function (err,appSrc) {
          if (err) {
            return console.log(err);
          }
          fs.readFile(options.input, 'utf8', function (err,data) {
            if (err) {
              return console.log(err);
            }
            var result = data.replace(/__APP__/g, escape(appSrc));

            fs.writeFile(options.output, result, 'utf8', function (err) {
              if (err) return console.log(err);
            });
          });
        });
      })
    ]
  }
}

var escape = function (str) {
  return str
    .replace(/[\\]/g, '\\\\')
    .replace(/[\"]/g, '\\\"')
    .replace(/[\']/g, '\\\'')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t');
};
