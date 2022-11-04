import { Chain } from "@core/blockChain/chain";

/** 테스트 코드 작성 */
describe("Chain 테스트", () => {
  let node: Chain = new Chain(); // 최초 블록이 들어있는 체인 생성

  it("체인 가져오기 함수 테스트", () => {
    console.log(node.getChain);
  });
  it("체인 길이 가져오기 함수 테스트", () => {
    console.log(node.getLength);
  });
  it("체인 마지막 블록 가져오기 함수 테스트", () => {
    console.log(node.getLatestBlock);
  });
  it("체인 블록 추가 함수 테스트", () => {
    for (let i = 0; i < 100; i++) {
      node.addBlock([`블록1번째`]);
    }
    console.log(node.getChain());
  });
});
