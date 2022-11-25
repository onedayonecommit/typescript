// 오늘은 어제 스마트 컨트랙트 자바스크립트 콘솔에서
// 배포를 했는데
// 자바스크립트 노드 환경에서 구현 해볼것. 

// 자바스크립트로 스마트 컨트랙트 배포

// 우분투에 .puppeth 폴더 안에 keystore 폴더에 계정파일 생성
// 단방향 암호화가 아니라 복화화가능
// keythereum / solc 설치

const keythereum = require("keythereum");
const path = require("path");

// key파일 안에서 주소 부분 가져와서 0x뒤 붙힘

const address = "0x2d556bab2aa57bbb81f93c31afcaa460fc55cdd7"

// 이 경로는 키파일 들어있는 폴더 상위 까지 경로
const dir = path.join(__dirname);

// 키파일의 계정 정보 객체 만들기
const keyObject = keythereum.importFromFile(address, dir);
// importFromFile 계정 정보 만들어 주는 함수 매개변수 첫번째: 주소 두번째: 경로

const privateKey = keythereum.recover("123", keyObject).toString("hex")
console.log("0x" + privateKey)