const watchMDtx = import('mdtx-core/lib/watch.js');

class WebpackCustomWithMDtxPlugin {
  apply(compiler: {
    hooks: {
      initialize: {
        tap: (arg0: string, arg1: () => void) => void;
      };
    };
  }) {
    compiler.hooks.initialize.tap('WebpackCustomWithMDtxPlugin', () => {
      watchMDtx.then((module) => {
        module.watch();
      });
    });
  }
}

module.exports = WebpackCustomWithMDtxPlugin;
