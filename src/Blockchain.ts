import { Block } from "./Block.js";

export class Blockchain {
  public readonly chain: Block[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  private createGenesisBlock(): Block {
    return new Block(
      0,
      Date.now(),
      "Bloque Génesis",
      "0"
    );
  }

  public addBlock(data: string): void {
    const previousBlock = this.chain[this.chain.length - 1];

    if (!previousBlock) {
      throw new Error("La blockchain no tiene bloques.");
    }

    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      data,
      previousBlock.hash
    );

    this.chain.push(newBlock);
  }

  public isValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock || !previousBlock) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}
