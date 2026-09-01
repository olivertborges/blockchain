import { Block } from "./Block.js";
import { Transaction } from "./Transaction.js";

export class Blockchain {
  public readonly chain: Block[];
  public readonly pendingTransactions: Transaction[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
  }

  private createGenesisBlock(): Block {
    return new Block(
      0,
      Date.now(),
      [],
      "0"
    );
  }

  public addTransaction(transaction: Transaction): void {
    this.pendingTransactions.push(transaction);
  }

  public minePendingTransactions(): void {
    const previousBlock = this.chain[this.chain.length - 1];

    if (!previousBlock) {
      throw new Error("La blockchain no tiene bloques.");
    }

    const transactions = [...this.pendingTransactions];

    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      transactions,
      previousBlock.hash
    );

    this.chain.push(newBlock);
    this.pendingTransactions.length = 0;
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
