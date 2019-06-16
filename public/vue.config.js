// const Donenv = require('dotenv-webpack');
// const path = require('path');
// const PrerenderSpaPlugin = require('prerender-spa-plugin');

// const productionPlugins = [
//   new PrerenderSpaPlugin({
//     staticDir: path.join(__dirname, 'dist'),
//     routes: []
//   }),
//   new Dotenv()
// ];

module.exports = {
  // configureWebpack: config => {
  //   if (process.env.NODE_ENV === 'production') {
  //     config.plugins.push(...productionPlugins);
  //   }
  // },
  productionSourceMap: false,
  css: {
    modules: true
  },
}