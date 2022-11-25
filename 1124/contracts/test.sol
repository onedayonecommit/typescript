// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract HelloWorld {
    string public value; // value 상태 변수 만들기

    constructor(){
        value = "hi";
    }

    function setValue(string memory v) public{
        value = v;
    }
}