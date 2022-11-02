export class BlockHeader implements IBlockHeader {
  public version: string;
  public height: number;
  public timestamp: number;
  public previousHash: string;
  constructor(_previousBlock: IBlock) {
    this.version = "";
    this.timestamp = 1;
    this.height = _previousBlock.height + 1;
    this.previousHash = _previousBlock.hash;
  }

  /** 클래스 내에서 함수를 만들어 사용하고 싶을 때 static 메서드를 주로 활용 */
  // static 메서드를 사용하면 인스턴스에 메서드가 포함되지 않아서 인서턴스 생성마다
  // 메서드가 생성되는 비효율적 방지 가능

  /** 버전 반환 함수 */
  public static getVersion() {
    return "1.0.0";
  }

  public static getTimestamp() {
    return new Date().getTime();
  }
}

// 여기서  implements는
// extends와 implements 차이

// extends : 클래스를 상속받을 때 사용한다. 클래스를 정의할 때 extends를 사용해서
// 부모 클래스를 상속받게 되면 자식 클래스는 부모 클래스의 속성과 메서드를 가져올 수 있다.
// 자식 클래스에서 추가 정의할 필요가 없다.

// implements : 특정 클래스 혹은 미리 정해놓은 인터페이스와 똑같은 형태로
// 클래스를 정의 하고 싶을 때(extends이거랑 다른 것)
