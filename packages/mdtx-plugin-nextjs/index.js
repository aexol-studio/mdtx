const withMDtx = (configMDtx = {}) => (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (options.dev && options.isServer) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const WebpackCustomWithMDtxPlugin = require('./WebpackCustomWithMDtxPlugin');
        config.plugins.push(new WebpackCustomWithMDtxPlugin(configMDtx));
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }
        return config;
      } else {
        return config;
      }
    },
  });
};

module.exports = withMDtx;
