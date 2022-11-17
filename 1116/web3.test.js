const Web3 = require("web3");
const ethTx = require("ethereumjs-tx").Transaction
describe("web3 test", () => {
    let web3;
    let accounts; // 가나슈로 생성한 이더 주소
    let sender; // 보내는 사람
    let received; // 받는 사람
    it("web3 연결", () => {
        // http://127.0.0.1:8545 경로의 가나슈에서 실행되고 있는 이더리움 클라이언트로
        // web3 인스턴스 생성
        web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    })

    it("ETH 단위 변경", () => {
        console.log(web3.utils.toWei('1', "gwei")) // Gwei 단위를 wei단위로 변환
        console.log(web3.utils.toWei('1', "ether")) // ether 단위를 wei단위로 변환
    })

    // 최신 블록의 높이
    it("최신 블록 높이", async () => {
        const latestBlock = await web3.eth.getBlockNumber();
        console.log(latestBlock);
    });

    // 전체 account 가져오기
    it("전체 주소", async () => {
        accounts = await web3.eth.getAccounts();
        console.log(accounts);
    })

    // 잔액 조회
    it("잔액 조회", async () => {
        balance = await web3.eth.getBalance(accounts[0]);
        console.log(balance) // Wei 단위를 Ether로 표현 한것
        // 웨이(wei)는 이더리움의 가장 작은 단위
        // 1이더는 10^18과 같다

        // 이더리움 단위
        // wei : 1
        // GWEI : 10 ** 9 wei
        // Ether : 10 ** 18 wei
        // Gas
        // 송금과 계약을 할 때 수수료로 Ether지불 해야한다.
        // 수수료를 지불할 때 Ether사용
    })

    //트랜잭션 횟수 조회
    it("트랜잭션 횟수 조회", async () => {
        const txCount = await web3.eth.getTransactionCount(accounts[0])
        console.log(txCount)
    })

    // 트랜잭션 실행 하기
    // 트랜잭션의 내용
    // nonce : 보내는 계정이 발생시킨 총 트랜잭션 횟수
    // from : 보내는 사람
    // to : 받는 사람
    // value : 보내는 금액 (wei)
    // gasLimit : 해당 트랜잭션이 사용할 수 있는 가스의 최대
    // gasPrice : 보내는 사람이 지불하는 가스 가격
    // data : 스마트 컨트랙트와 관련된 데이터

    it("트랜잭션 실행", async () => {
        const txCount = await web3.eth.getTransactionCount(accounts[0]);
        const privateKey = Buffer.from('2db02c0ac11f2d0601d858c00471e10ca7cf2ff742b532954de6fe982ea0bbeb', "hex")
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            from: accounts[0],
            to: accounts[1],
            value: web3.utils.toHex(web3.utils.toWei("1", "wei")),
            // 10 ** 18 toHex 
            gasLimit: web3.utils.toHex(50000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('1', 'gwei')),
            data: web3.utils.toHex('') // 스마트 컨트랙트 관련된 data
        }
        const tx = new ethTx(txObject)
        tx.sign(privateKey); // sign이라는 함수가 tx객체에 서명 값을 추가
        console.log(tx);
        // serialize 함수를 사용해서 내용을 정렬을 하고
        const serializedTx = tx.serialize();
        // sendSignedTransaction 함수로 트랜잭션을 전송
        const _TxObject = await web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"));
        console.log(_TxObject);
    })
})
