const solcVersion = require('solc-version');
const getCompile = require('./getCompile');
const solcjsCore = require('solcjs-core');
const solcWrapper = solcjsCore.solcWrapper.wrapper;

function solcjs(_version) {
  return new Promise(async (resolve, reject) => {
    let newCompile;
    let version;

    try {
      version = await solcjsCore.getVersion(_version);
      
      console.time('[fetch compiler]');
      let url = await solcVersion.version2url(version);
      let compilersource = await solcjsCore.getCompilersource(url);
      console.timeEnd('[fetch compiler]');

      console.time('[load compiler]');
      const solc = solcjsCore.loadModule(compilersource);
      console.timeEnd('[load compiler]');

      console.time('[wrap compiler]');
      let _compiler = solcWrapper(solc);
      _compiler.opts = { version, url };

      newCompile = getCompile(_compiler);
      newCompile.version = { name: version, url };
      console.timeEnd('[wrap compiler]');

      try {
        await solcjsCore.pretest(newCompile, version);
        resolve(newCompile);
      } catch (err) { throw new Error('pretest failed'); }
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

module.exports = solcjs;