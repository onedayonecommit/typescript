const Web3 = require('web3');

let instance;
class Client {
    constructor(_url) {
        // instance의 내용이 있으면 그 instance 반환
        if (instance) return instance;
        this.web3 = new Web3(_url);
        instance = this;
    }
}

module.exports = { Client };
