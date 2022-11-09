import { Chain } from "@core/blockChain/chain";

export class BlockChain {
  public chain: Chain;
  constructor() {
    this.chain = new Chain();
  }
}
