const { Contract } = require("./controll/compile");
const { Client } = require("./controll/client");

const [abi, bytecode] = Contract.compile("test.sol");

const client = new Client("ws://127.0.0.1:8546")

const contract = new client.web3.eth.Contract(abi);
const txObject = { data: bytecode };

const Address = "0x2d556bab2aa57bbb81f93c31afcaa460fc55cdd7"

async function init() {
    // deploy() : 반환값이 promis 객체
    const instance = await contract.deploy(txObject).send({ from: Address })
    console.log(instance)
    const CA = instance.options.address;
    console.log(CA)
    const deployed = new client.web3.eth.Contract(abi, CA)
    console.log(deployed)
}
init();


uint rand = uint(keccak256(_str));

return rand % dnaModulus
        
uint rand = uint(keccak256(_str));
return rand % dnaModulus;