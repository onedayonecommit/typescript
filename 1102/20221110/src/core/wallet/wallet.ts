import elliptic from "elliptic";
import { SHA256 } from "crypto-js";

// 암호화폐의 지갑은 왜 쓸까
// 자신의 암호화폐를 다른 누군가에게 상대방에게 양도 및 보관하기 위해
// 사용하는 소프트웨어의 한 종류
// 개인키가 있어야 본인의 지갑에 접근 가능
// 지갑은 암호화폐 자산을 관리하고 Dapps(탈중앙화 어플리케이션)과 상호작용을 하기 위해서
// 사용한다.

// 공개키는 예를 들어 우리가 사용하는 은행 계좌 번호 ?
// 개인키는 비밀 핀번호 or 계좌 관리를 위한 수표의 서명과 비슷

// 공개키로는 네트워크 참여자의 거래내역의 사람들의 거래가 정상인지 위변조 여부 확인
// 개인키 잃어버리면 안됌
// 개인키 잃어버리면 지갑 묶임

// 단방향 암호화를 통해 키를 만든다.
// 개인키의 역할은 공개키를 만들어주고 만든 공개키로 주소를 만들어준다.

// 공개키는 타원 곡선 알고리즘으로 만들어짐
// 모든 사람들에게 공개되어도 상관없는 데이터 공개키
//

// elliptic 인스턴스 생성
const ec = new elliptic.ec("secp256k1");

export interface ReceivedTx {
  sender: string;
  received: string;
  amount: number;
  signature: elliptic.ec.Signature;
}

export class Wallet {
  public account: string;
  public publicKey: string;
  public balance: number;
  public signature: elliptic.ec.Signature;

  constructor(sender: string, signature: elliptic.ec.Signature) {
    this.publicKey = sender;
    this.account = this.getAccount();
    this.signature = signature;
    this.balance = 0;
  }

  static sendTransaction(receivedTx: ReceivedTx) {
    // 서명 검증

    // 공개키, 보내는 사람: 공개키, 받는사람 : 계정, 보낼 금액
    const verify = Wallet.getVerify(receivedTx);
    if (verify.isError) throw new Error(verify.value);
    // 보내는 사람의 지갑 정보를 최신화
    // 현재 가지고 있는 정보 공개키, 실제 트랜젝션에 넣을 정보는 account 정보
    const myWallet = new this(receivedTx.sender, receivedTx.signature);
    console.log(myWallet);
  }

  static getVerify(receivedTx: ReceivedTx): Failable<undefined, string> {
    const { sender, received, amount, signature } = receivedTx;
    const data: [string, string, number] = [sender, received, amount];
    const hash: string = SHA256(data.join("")).toString();

    // 공개키로 서명 검증
    const keyPair = ec.keyFromPublic(sender, "hex");
    const isVerify = keyPair.verify(hash, signature);
    if (!isVerify) return { isError: true, value: "서명 검증이 안됨" };

    return { isError: false, value: undefined };
  }

  public getAccount(): string {
    return Buffer.from(this.publicKey).slice(26).toString();
  }
}
