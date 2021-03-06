console.time('[start]');
const bel = require('bel');
const sca = require('smartcontract-app');
const solcjs = require('../');

function selector(list, action) {
  const onchange = event => action(event.target.value);
  return bel`
    <select onchange=${onchange}>
      ${list.map(x => bel`<option value="${x}">${x}</option>`)}
    </select>`;
}

async function useVersion(version) {
  try {
    console.time('[compile]');
    let compiler = await solcjs(version);
    const sourcecode = `
    import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';

    contract Sample {
      bool bool1 = true;
      bool bool2 = false;

      int num = 0;
      int8 num8 = 8;
      int16 num16 = 16;
      int32 num32 = 32;
      int40 num40 = 40;
      int48 num48 = 48;
      int56 num56 = 56;
      int64 num64 = 64;
      int72 num72 = 72;
      int128 num128 = 128;
      int256 num256 = 256;

      uint unum = 0;
      uint8 unum8 = 255;
      uint16 unum16 = 16;
      uint32 unum32 = 32;
      uint256 unum256 = 256;

      address addr;

      bytes myBytes;
      bytes1 myBytes1;
      bytes2 myBytes2;
      bytes3 myBytes3;
      bytes8 myBytes8;
      bytes32 myBytes32;

      string name;

      enum State { Start, Pending, End }
      State state = State.Start;

      uint[] myArray = new uint[](5);
      int[5] myArray2;
      address[] funderIndexs;

      struct Person {
        string name;
        uint height;
      }

      Person customer;

      mapping (address => Funder) funders;

      struct Funder {
        address addr;
        uint amount;
        uint createdAt;
        string name;
      }

      function function1() public {}

      function setBoolean(bool _a) public returns(bool) {
          bool1 = _a;
          return bool1;
      }

      function getNumber() public returns(uint) {
          return unum;
      }

      function setNumber(uint _a) public returns(uint) {
          unum = _a;
          return unum;
      }

      function setOwner(address _addr) public returns(address) {
          addr = _addr;
          return addr;
      }

      function setBytes1(bytes1 _a) public returns(bytes1) {
          myBytes1 = _a;
          return myBytes1;
      }

      function setBytes(bytes memory _a) public returns(bytes memory) {
          myBytes = _a;
          return myBytes;
      }

      function setString(string memory _a) public returns(string memory) {
          name = _a;
          return name;
      }

      function getState() view public returns (uint) {
        return uint(state);
      }

      function setPerson(string memory _name, uint height) public {
        customer = Person({ name: 'alincode', height: 160 });
      }

      function fund(string memory _name) public payable {
        funders[msg.sender] = Funder(msg.sender, msg.value, now, _name);
      }

      function addMyArray(uint _a) public {
          myArray.push(_a);
      }

    }
    `;
    let output = await compiler(sourcecode);
    console.timeEnd('[compile]');

    console.log('***   success   ***');
    document.body.appendChild(bel`<h1>success</h1>`);
    console.log('[output]', output);

    var opts = {
      metadata: {
        compiler: { version: output[0].compiler.version },
        language: output[0].compiler.language,
        output: {
          abi: output[0].abi,
          devdoc: output[0].metadata.devdoc,
          userdoc: output[0].metadata.userdoc
        },
        settings: {
          compilationTarget: { '': output[0].sources.compilationTarget },
          evmVersion: output[0].compiler.evmVersion,
          libraries: output[0].sources.libraries,
          optimizer: { enabled: output[0].compiler.optimizer, runs: output[0].compiler.runs },
          remapings: output[0].sources.remappings
        },
        sources: { '': output[0].sources.sourcecode }
      }
    };
    var el = sca(opts);
    document.body.appendChild(el);
  } catch (error) {
    console.log('***   fail   ***');
    document.body.appendChild(bel`<h1>fail</h1>`);
    console.error('[error]', error);
  } finally {
    console.timeEnd('[start]');
  }
}

async function start() {
  let select = await solcjs.versions();
  const { releases } = select;
  const version = releases[0];
  await useVersion(version);
  document.body.appendChild(selector(releases, v => useVersion(v)));
}

start();
