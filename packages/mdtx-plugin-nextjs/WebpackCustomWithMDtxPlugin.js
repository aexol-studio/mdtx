const watchMDtx = import('../mdtx-core/lib/watch.js');

class WebpackCustomWithMDtxPlugin {
  apply(compiler) {
    compiler.hooks.initialize.tap(
      'WebpackCustomWithMDtxPlugin',
      (context, entry) => {
        watchMDtx.then((module) => {
          module.watch();
        });
      },
    );
  }
}

module.exports = WebpackCustomWithMDtxPlugin;

// class WebpackCustomWithMDtxPlugin {
//   constructor(opts) {
//     this.opts = opts;
//   }

//   apply(compiler) {
//     const isWebpack5 = Boolean(
//       compiler.webpack &&
//         compiler.webpack.version &&
//         compiler.webpack.version.startsWith('5'),
//     );

//     compiler.hooks.watchRun.tap('WebpackCustomWithMDtxPlugin', (comp) => {
//       let changedFile;

//       if (isWebpack5) {
//         if (!comp.modifiedFiles) return;

//         changedFile = [...comp.modifiedFiles][0]; // Just Get One
//       } else {
//         const mtimes = Object.keys(comp.watchFileSystem.watcher.mtimes);
//         if (!mtimes || !mtimes.length) return;

//         changedFile = mtimes[0]; // Just Get One
//       }

//       if (!changedFile) return;

//       this.opts.matchs.forEach((m) => {
//         if (!m.filePath || m.filePath !== changedFile) return;

//         if (m.callback && typeof m.callback === 'function') {
//           console.log('');
//           console.log('✨ watch-file-change-and-run-callback-webpack-plugin');
//           console.log('');
//           console.log('   -', changedFile, '\n');

//           m.callback();
//         }
//       });
//     });
//   }
// }

// module.exports = WebpackCustomWithMDtxPlugin;
