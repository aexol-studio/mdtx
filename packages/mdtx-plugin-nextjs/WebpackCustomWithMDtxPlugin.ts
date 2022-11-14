const watchMDtx = import('mdtx-core/lib/watch.js');
class WebpackCustomWithMDtxPlugin {
  opts: { out: string; in: string; markdownToHtml: boolean; };
  constructor(opts: { out: string; in: string; markdownToHtml: boolean; }) {
    this.opts = opts;
  }
  apply(compiler: {
    hooks: {
      initialize: {
        tap: (arg0: string, arg1: () => void) => void;
      };
    };
  }) {
    compiler.hooks.initialize.tap('WebpackCustomWithMDtxPlugin', () => {
      watchMDtx.then((module) => {
        module.watch(this.opts);
      });
    });
  }
}

module.exports = WebpackCustomWithMDtxPlugin;
