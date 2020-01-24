module.exports = {
  chainWebpack: (config) => {
    config.output.globalObject('self');
    // if (config.plugins.has('preload')) {
    //   config.plugin('preload').tap((options) => {
    //     options[0] = {
    //       rel: 'preload',
    //       include: {
    //         type: 'initial'
    //       },
    //       fileBlacklist: [/\.map$/, /hot-update\.js$/]
    //     };
    //     return options;
    //   });
    // }
  },
  productionSourceMap: false
};
