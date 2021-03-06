# How to use

### await solcjs(version)

```js
// let compiler = await solcjs();  // latest
let compiler = await solcjs(version);
const sourceCode = `
  pragma solidity >0.4.99 <0.6.0;

  library OldLibrary {
    function someFunction(uint8 a) public returns(bool);
  }

  contract NewContract {
    function f(uint8 a) public returns (bool) {
        return OldLibrary.someFunction(a);
    }
  }`;
let output = await compiler(sourceCode);
```

### await compiler(sourceCode, localSources)

```js
let compiler = await solcjs(version);

const sourceCode = `
  pragma solidity >0.4.99 <0.6.0;

  import "lib.sol";

  library OldLibrary {
    function someFunction(uint8 a) public returns(bool);
  }

  contract NewContract {
    function f(uint8 a) public returns (bool) {
        return OldLibrary.someFunction(a);
    }
  }`;

let localSources = [{
  path: 'lib.sol',
  content: 'library L { function f() internal returns (uint) { return 7; } }'
}];

let output = await compiler(sourceCode, localSources);
```

### await compiler(sourceCode);

```js
let compiler = await solcjs(version);

const sourceCode = `
  import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';

  library OldLibrary {
      function someFunction(uint8 a) public returns(bool);
  }

  contract NewContract {
      function f(uint8 a) public returns (bool) {
          return OldLibrary.someFunction(a);
      }
  }`;

let output = await compiler(sourceCode);
```

### await solcjs(version).version

```js
let version = 'v0.4.25-stable-2018.09.13';
let compiler = await solcjs(version);
console.dir(compiler.version);
// { name: 'v0.4.25-stable-2018.09.13',
// url: 'https://solc-bin.ethereum.org/bin/soljson-v0.4.25+commit.59dbf8f1.js' }
```

### await solcjs.versions()

```js
const solcjs = require('solc-js');
let select = await solcjs.versions();
const { releases, nightly, all } = select;
console.log(releases[0]);
// v0.4.25-stable-2018.09.13
```

### await solcjs.version2url(version)

```js
const solcjs = require('solc-js');
let version = 'v0.4.25-stable-2018.09.13';
let url = await solcjs.version2url(version);
console.log(url);
// https://solc-bin.ethereum.org/bin/soljson-v0.4.25+commit.59dbf8f1.js
```

```js
const solcjs = require('solc-js');
let version = 'latest';
let url = await solcjs.version2url(version);
console.log(url);
// https://solc-bin.ethereum.org/bin/soljson-v0.1.1+commit.6ff4cd6.js
```