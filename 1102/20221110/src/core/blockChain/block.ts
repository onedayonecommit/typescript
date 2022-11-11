import { SHA256 } from "crypto-js";
import merkle from "merkle";
import { BlockHeader } from "./blockHeader";
import { DIFFICULTY_ADJUSTMENT_INTERVAL,
    BLOCK_GENERATION_INTERVAL,
    BLOCK_GENERATION_TIME_UNIT,
    GENESIS } from "@core/config";
import hexToBinary from "hex-to-binary";

// 부모 속성 가져오고 IBlock 인터페이스 형태 클래스 만듬
// IBlock 형태로 클래스를 선언 가져오고 BlockHeader를 상속받은 Block
export class Block extends BlockHeader implements IBlock {
    public hash: string;
    public merkleRoot: string;
    public nonce: number;
    public difficulty: number;
    public data: string[];
    // 생성 단계에 Block 클래스 타입의 이전 블록을 매개변수로 받고
    // 블록의 내용 _data 
    // 10번째 전 블록 Block 클래스 타입인 _adjustmentBlock 
    constructor(_previousBlock : Block , _data : string[], _adjustmentBlock : Block){
        // 부모 클래스 속성 가져와야하니까 super 사용
        super(_previousBlock);
        // 테스트쪽에서 생성할때 블록의 문자열 데이터를 _data이 데이터를 getMerkleRoot함수 안에서
        // _data 블록의 n번째 (문자열)
        // 머클 트리로 뽑고 루트 값을 반환 
        this.merkleRoot = Block.getMerkleRoot(_data);
        // 블록의 해시는 블록의 내용 version, timestamp, height, merkleRoot, previousHash, difficulty, nonce
        // 가지고 해싱해서 반환 this 생성된 자신 new Block 동적할당 된 블록 인스턴스
        this.hash = Block.createBlockHash(this);
        // nonce 값은 마이닝에서 0의 갯수를 난이도에 맞춰서 찾을때까지 증가시킬 값
        // 가장많이 사용하는 해시 알고리즘인 SHA256으로 임의의 데이터를 해시한 값을 구해서
        // 256bit(32바이트)의 값을 얻는것
        // 해시함수는 단방향 함수로 데이터로부터 해시값을 구할수는 있는데
        // 해시값으로 데이터를 역산 할 수는 없다. 원본 데이터를 알수가 없다는 것
        // 해시값이 같은 임의의 데이터를 만들어 내는건 정말 어렵고 (경우의 수를 다찾는데)
        // 특정한 해시값이 나오는 데이터를 찾으려면 2256개(256비트로 나올 수 있는 모든 경우의 수)의
        // 데이터를 다 확인하는데 지금 우리 컴퓨터로는 불가능한 작업이다.

        // 해시캐시 문제는 이 불가능한 역산 작업과 유사하다.
        // 특정한 해시값이 나오는 데이터를 찾는건 너무 힘드니까
        // 특정한 범위 유추하는데 정확한 값이 아니라 범위를 찾아서
        // 해시값이 나오는 데이터를 찾도록 난이도를 사용하는것

        // 0의 갯수 찾을 확율이 (1/16)^n

        // abc를 ASCLL code 에서
        // a = 97
        // b = 98
        // c = 99

        // 이진 값으로 바꾸면
        // a = 0110 0001
        // b = 0110 0010
        // c = 0110 0011

        // abc input 값이라 하면
        // 글자 길이는 3글자 3 * 8bit
        // 24 == 0001 1000

        // 전처리 방식이
        // 메시지 길이의 bit 길이를 512bit 단위로 잘라서 저장하고
        // 길이가 512bit 안되면 bit수를 추가해주는데 zero padding
        // 0110 0001 0110 0010 0110 0011 ...0 0001 1000

        // 초기값 설정
        // 첫번째 초기값은 실제로 결과가 될값(변하는 도중임)
        // 첫번째 초기값은 256bit로 총 8개의 32bit 값으로 이루어지게 되는데

        // 가장 작은 8개의 소수의 제곱근
        // [2,3,5,7,11,13,17,19]의 제곱근
        // 이배열을 반복문으로 돌려서 제곱근을 구하고 정수값을 제거하고 왼쪽으로 32bit shift 연산 후
        // 16진수로 출력하면
        // KISA에서 제공하는 SHA256 공식 소스 코드의 고정된 초기값
        // 0x6a09e667
        // 0xbb67ae85
        // 0x3c6ef372
        // 0xa54ff53a
        // 0x510e527f
        // 0x9b05688c
        // 0x1f83d9ab
        // 0x5be0cd19

        // 두번째 초기값은 hash 연산에서 32bit 값을 가진 배열
        // 64개의 소수

        // 2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
        // 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
        // 73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
        // 127, 131, 137, 139, 149, 151, 157, 163, 167, 173,
        // 179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
        // 233, 239, 241, 251, 257, 263, 269, 271, 277, 281,
        // 283, 293, 307, 311

        // 3제곱근을 구하고 정수값을 제거 후 왼쪽으로 32bit shift 연산 후 16 진수로 출력하면
        // 0x428a2f98
        // 0x71374491
        // 0xb5c0fbcf
        // 0xe9b5dba5
        // 0x3956c25b
        // 0x59f111f1
        // 0x923f82a4
        // 0xab1c5ed5

        this.nonce = 0;
        // getDifficulty 함수로 난이도를 생성한것
        // 블록의 생성 시간을 조절해주는것 블록이 생성되는 시간을 10마다 비교해서
        // 시간을 조절해 주기 위해서 사용하는것
        this.difficulty = Block.getDifficulty(this,_adjustmentBlock,_previousBlock);

        this.data = _data;
    }

    // 최초 블록 가져오는 함수
    public static getGENESIS() : Block {
        return GENESIS
    }

    // 블록 추가
    public static generateBlock(_previousBlock : Block, _data : string[], _adjustmentBlock : Block) : Block {
        const generateBlock = new Block(_previousBlock, _data, _adjustmentBlock);
        const newBlock = Block.findBlock(generateBlock)
        return newBlock
    }

    // 난이도 구현 함수
    public static getDifficulty(_newBlock : Block, _adjustmentBlock : Block, _previousBlock:Block) : number{ 
        // 추가된 블록의 높이가 9이거나 작으면 난이도를 0 고정시키고
        if(_newBlock.height <= 9) return 0;
        // 추가된 블록의 높이가 10이거나 작으면 난이도를 1
        if(_newBlock.height <= 10) return 1;

        // 10번째 배수의 블록에 한해서만 난이도 구현
        // 10개의 묶음씩 같은 난이도를 가지게 한다.
        // 새블록의 높이를 나머지 연산으로 10으로 나눠서 나머지가 0이 아니면
        // 이전 블록의 난이도를 보내주고 (20번째 블록 전까지 난이도가 이전블록 난이도인 1 이라는 것)
        if(_newBlock.height % DIFFICULTY_ADJUSTMENT_INTERVAL !== 0)
        {
            return _previousBlock.difficulty;
        }
        // 블록 1개당 생성시간 : 10분, 10개 생성되는데 걸리는 시간 6000초
        // _adjustmentBlock이건 10번째 전 블록
        // 10번째 전 블록의 생성 시간과 지금 생성된 블록의 시간 차이를 구해서
        // timeTaken에 담고
        const timeTaken : number = _newBlock.timestamp - _adjustmentBlock.timestamp;
        const TimeExpected : number = 
        BLOCK_GENERATION_INTERVAL *
        BLOCK_GENERATION_TIME_UNIT *
        DIFFICULTY_ADJUSTMENT_INTERVAL; // 6000

        // 난이도 조절 식
        // timeTaken이 차이값을 구한 시간이 블록의 생성 주기 시간 / 2 보다 작으면 
        // 난이도를 1 올려주고
        // timeTaken이 차이값이 블록 생성 주기 시간 * 2 보다 크면 난이도를 1 내려줍니다.
        // 이렇게 해서 블록의 난이도를 조절해서 블록 생성 주기를 조절해주는것
        if(timeTaken < TimeExpected / 2 ) return _adjustmentBlock.difficulty + 1;
        else if(timeTaken > TimeExpected * 2)
        return _adjustmentBlock.difficulty - 1;

        return _adjustmentBlock.difficulty;
    }

    // findBlock()
    // 마이닝 작업 코드
    public static findBlock(generateBlock : Block) {
        // 해시값을 담을 변수
        let hash : string;
        // nonce : number 0에서 부터
        let nonce : number = 0;

        while(true)
        {
            // 계속 반복해서 nonce를 올리고
            generateBlock.nonce = nonce;
            nonce++;
            // nonce가 올려진 블록 해시를 createBlockHash함수로 블록의 모든 내용을 해시화해서
            // 해시값을 얻고
            hash = Block.createBlockHash(generateBlock);
            // hexToBinary(hash) : 16진수 -> 2진수로 변환 함수
            // hexToBinary 모듈 설치 해서 사용
            // 설치 명령어
            // --------------------------
            // npm install hex-to-binary
            // --------------------------

            // 바이너리 코드로 바꿔서 hexToBinary함수로 바꿔서 해시값을
            const binary : string = hexToBinary(hash);
            // startsWith() 함수는 대상의 문자열에 어떤 문자열로 시작하는지 체크 00000
            // 난이도가 4면은 0이 4개 이거나 더 많은 값을 찾을때까지 비교 
            const result : boolean = binary.startsWith("0".repeat(generateBlock.difficulty));
 
            if(result)
            {
                generateBlock.hash = hash;
                return generateBlock;
            }
        }
    }

    // 머클루트 반환 함수
    public static getMerkleRoot<T>(_data:T[]) : string {
        // 머클트리를 만들어주는 라이브러리 merkle sha256알고리즘으로 해싱을 하고 
        // sync 함수에 매개변수로 _data배열을 전달해서
        // 머클 트리를 만들고 merkleTree
        const merkleTree = merkle('sha256').sync(_data);
        return merkleTree.root();
    }
    
    // 블록 해시 생성 함수
    public static createBlockHash(_block : Block) : string {
        // difficulty, nonce 
        // 블록 해시는 블록의 내용을 모두 포함해서 해시값을 뽑아냄
        const { version, timestamp, height, merkleRoot, previousHash, difficulty, nonce } = _block;
        const values : string = `${version}${timestamp}${height}${merkleRoot}${previousHash}${difficulty}${nonce}`;
        return SHA256(values).toString();
    }

    // 블록 유효 검사 함수 (새로운 블록이 생성되면 검증)
    public static isValidNewBlock(_newBlock : Block, _previousBlock : Block) : Failable<Block,string>{
        // 블록의 높이가 이전 블록 보다 1이 증가된 상태인지 체크하는 식
        if(_previousBlock.height + 1 !== _newBlock.height)
            return { isError:true, value:"블록 높이 오류"};
        // 블록의 이전 블록 해시 값이 새로운 블록의 이전 블록 해시값과 같은지
        if(_previousBlock.hash !== _newBlock.previousHash)
            return { isError:true, value:"이전 해시 오류"};
        // 생성된 블록의 정보를 가지고 다시 해싱해서 생성된 블록의 해시값과 같은지 비교
        if(Block.createBlockHash(_newBlock) !== _newBlock.hash)
            return {isError:true, value : "블록 해시 오류"};

        return {isError:false,value:_newBlock};
    }
}