const Path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IsDev = process.env.NODE_ENV === 'development';
const DEFAULT_OPTIONS = {
  extractCss: true
};

module.exports = function(opts) {
  const Options = Object.assign({}, DEFAULT_OPTIONS, opts);
  const Plugins = [];

  const PublicPath = '';
  // extract css files 
  const ExtractPlugin = new ExtractTextPlugin({
    filename: `subway/style/${IsDev?'[name]':'[name].[chunkhash:8]'}.css`,
    allChunks: true,
    ignoreOrder: true
  });

  if (Options.extractCss) {
    Plugins.push(ExtractPlugin);
  }

  function GetLoaders() {
    const BaseLoaders = [];

    BaseLoaders.push({
      loader: 'css-loader',
      options: {
        url: true,
        minimize: true
      }
    });

    return {
      css: Options.extractCss ? ExtractTextPlugin.extract({
        use: BaseLoaders,
        fallback: 'vue-style-loader',
        publicPath: PublicPath
      }) : [{
        loader: 'vue-style-loader'
      }].concat(BaseLoaders),
      less: Options.extractCss ? ExtractTextPlugin.extract({
        use: BaseLoaders.concat(['less-loader']),
        fallback: 'vue-style-loader',
        publicPath: PublicPath
      }) : [{
        loader: 'vue-style-loader'
      }].concat(BaseLoaders, ['less-loader']),
      scss: Options.extractCss ? ExtractTextPlugin.extract({
        use: BaseLoaders.concat(['sass-loader']),
        fallback: 'vue-style-loader',
        publicPath: PublicPath
      }) : [{
        loader: 'vue-style-loader'
      }].concat(BaseLoaders, ['sass-loader'])
    };
  }

  const Rules = [{
    test: /\.vue$/,
    use: [{
      loader: 'vue-loader',
      options: {
        loaders: GetLoaders()
      }
    }]
  }];


  return {
    module: {
      rules: Rules
    },
    plugins: Plugins,
    resolve: {
      extensions: ['.js', '.vue', '.json']
    },
    externals: {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter'
    }
  };
};