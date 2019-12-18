module.exports = {
  chainWebpack: (config) => {
    config.module.rule('js').exclude.add(/\.worker\.js$/);
    config.output.globalObject('self');
    // if (config.plugins.has('preload')) {
    //   config.plugin('preload').tap((options) => {
    //     options[0] = {
    //       rel: 'preload',
    //       include: 'asyncChunks',
    //       excludeHtmlNames: [],
    //       fileBlacklist: [/\.map/]
    //     };
    //     return options;
    //   });
    // }
  },
  productionSourceMap: false
};
