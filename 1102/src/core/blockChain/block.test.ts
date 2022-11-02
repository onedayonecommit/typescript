// 작성한 코드들을 테스트 위해 만든 파일
import { Block } from "@core/blockChain/block";

import { GENESIS } from "@core/config";

describe("Block 검증", () => {
  let newBlock: Block;

  // it() : 테스트할 코드의 최소 단위 공간
  it("블록 추가", () => {
    const data = ["Block 2"];
    newBlock = Block.generateBlock(GENESIS, data);
    console.log(newBlock);
  });
});

// describe 함수를 사용해서 테스트할거고 함수들을 많이 작성할경우
// 연관 테스트 함수끼리 그룹핑 시켜주는 역할
