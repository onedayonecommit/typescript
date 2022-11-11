import { Block } from "@core/blockChain/block";
import { DIFFICULTY_ADJUSTMENT_INTERVAL } from "@core/config";

export class Chain {
  private blockchain: Block[];
  constructor() {
    this.blockchain = [Block.getGENESIS()];
  }

  public getChain(): Block[] {
    return this.blockchain;
  }

  public getLength(): number {
    return this.blockchain.length;
  }

  /** 맨 마지막 블록을 확인하는 함수 맨 마지막 노드 확인*/
  public getLatestBlock(): Block {
    return this.blockchain[this.blockchain.length - 1];
  }

  // 블록체인에 블록을 추가하는 함수 매개변수로는 블록의 내용을 받는다.
  //
  public addBlock(data: string[]): Failable<Block, string> {
    // getLatestBlock 함수로 마지막블록을 가져오고
    const previousBlock = this.getLatestBlock();
    // getAdjustmentBlock 함수로 10번째 전 블록 가져오고
    const adjustmentBlock: Block = this.getAdjustmentBlock();
    // generateBlock 함수로 마이닝이 끝난 추가할 블록 가져오고
    const newBlock = Block.generateBlock(previousBlock, data, adjustmentBlock);
    // 새로운 블록을 검증 하는데 isValidNewBlock 이전블록과 새로운 블록을
    // 매개변수로 전달해서 블록의 높이 검사와 새로운 블록과 이전블록 해시검사
    const isValid = Block.isValidNewBlock(newBlock, previousBlock);

    // 블록의 검증이 끝나고 에러가 있으면 반환
    if (isValid.isError) return { isError: true, value: "에러남" };

    // 다 통과했으면 새로운 블록을 블록체인에 추가
    this.blockchain.push(newBlock);

    // 에러가 없다고 알려주고 value로 Block 타입의 newBlock 반환
    return { isError: false, value: newBlock };
  }

  // 체인 검증 코드
  public isValidChain(chain: Block[]): Failable<undefined, string> {
    // 최초 블록 검사 하는 코드
    // const genesis = chain[0]

    // 체인의 유효성 검사
    for (let i = 1; i < chain.length; i++) {
      // 현재 인덱스의 블록
      const newBlock = chain[i];
      // 그 인덱스의 이전블록
      const previousBlock = chain[i - 1];
      // 블록 검증 시도
      const isValid = Block.isValidNewBlock(newBlock, previousBlock);
      if (isValid.isError) return { isError: true, value: isValid.value };
    }
    return { isError: false, value: undefined };
  }

  public replaceChain(receivedChain: Block[]): Failable<undefined, string> {
    // 본인 체인과 상대방 체인을 검사하는
    // 상대방
    const latestReceivedBlock: Block = receivedChain[receivedChain.length - 1];
    // 본인
    const latestBlock: Block = this.getLatestBlock();
    //높이가 0 받은블록이 최초라 검사 필요 X
    if (latestReceivedBlock.height == 0) {
      return { isError: true, value: "받은 블록이 최초 블록" };
    }
    // 본인의 블록이 더 길거나 같은 블록이면 검사 필요 없음.
    if (latestReceivedBlock.height <= latestBlock.height) {
      return { isError: true, value: "본인의 블록 길거나 더 길거나 같은 블록" };
    }
    // 여러명이 빠르게 추가하다보면 검증단계에서 블록의 길이 차이가 있는데
    // 해시 비교를 해서 이전 블록의 해시가 같다면 블록의 갯수 차이가 있는것으로 검사 에러
    // 이 문제는 사람들이 빠르게 블록을 추가하다가 여러명이 비슷하게 블록 생성이 됐을 때 일어남
    if (latestReceivedBlock.previousHash === latestBlock.hash) {
      return { isError: true, value: "블록이 하나만큼 모자라다." };
    }

    // 체인을 갱신해줌
    this.blockchain = receivedChain;

    return { isError: false, value: undefined };
  }

  // 생성 시점기준으로 블록 높이 -10인 블록 구하기

  // 현재 높이값 < DIFFICULTY_ADJUSTMENT_INTERVAL : 최초 블록 반환 하고
  // 현재 높이값 > DIFFICULTY_ADJUSTMENT_INTERVAL : -10번째 블록 반환
  public getAdjustmentBlock() {
    // 자신의 길이를 getLength함수로 가져오고
    // 자신의 길이가 10보다 작으면 최초의  블록을 반환한다
    // 길이가 10보다 크면 -10번째 블록을 반환해준다.
    const currentLength = this.getLength();
    const adjustmentBlock: Block = this.getLength() < DIFFICULTY_ADJUSTMENT_INTERVAL ? Block.getGENESIS() : this.blockchain[currentLength - DIFFICULTY_ADJUSTMENT_INTERVAL];

    return adjustmentBlock; // 최초 블록 or -10번째 블록 반환
  }
}
