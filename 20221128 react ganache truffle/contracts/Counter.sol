// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Counter {
    uint256 private _count;

    // 이벤트 등록하려면 evnet를 사용해서 (로그를 찍겠다.)
    event Count(uint256 count);
    // 이벤트를 이렇게 등록하면 본인이 실행하고 싶을때 작성해주면 된다.
    // 언제 로그를 찍을지

    // view는 상태 변수를 변경하는게 아니라 데이터를 읽기만 하는것.
    function current() public view returns(uint256){
        return _count;
    }

    function increment() public {
        _count += 1;
        emit Count(_count);
        // 변한 상태 변수의 값이 로그에 찍힌다.
    }

    function decrement() public {
        _count -= 1;
    }
}