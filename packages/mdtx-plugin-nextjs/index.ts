const withMDtx =
  (configMDtx: { out: string; in: string; markdownToHtml: boolean }) =>
  (nextConfig: { webpack: (config: any, options: any) => any }) => {
    return Object.assign({}, nextConfig, {
      webpack(
        config: { plugins: any[] },
        options: { dev: boolean; isServer: boolean },
      ) {
        if (options.dev && !options.isServer) {
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