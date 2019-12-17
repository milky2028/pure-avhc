module.exports = {
  chainWebpack: (config) => {
    config.module.rule('js').exclude.add(/\.worker\.js$/);
    config.output.globalObject('self');
    // if (config.plugins.has('preload')) {
    //   config.plugin('preload').tap(options => {
    //     options[0].include = ['anything'];
    //     return options;
    //   })
    // }
  },
  productionSourceMap: false
};
