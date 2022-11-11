// 제네시스 블록 여기다.

// 난이도 조절 블록 범위
export const DIFFICULTY_ADJUSTMENT_INTERVAL : number = 10;

// 블록 생성 시간 (분) 10*60 == 600
export const BLOCK_GENERATION_INTERVAL : number = 10;

// 블록 생성 시간 (초)
export const BLOCK_GENERATION_TIME_UNIT : number = 60;

export const GENESIS : IBlock = {
    version : "1.0.0",
    height : 0,
    timestamp : new Date().getTime(),
    hash : "0".repeat(64),
    previousHash: "0".repeat(64),
    merkleRoot : "0".repeat(64),
    difficulty : 0,
    nonce : 0,
    data : ["The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"]
}

// 보통 최초 블록은 하드코딩으로 만들어주는 경우가 많데요
//