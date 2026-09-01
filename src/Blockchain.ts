import { Block } from "./Block.js";
import { Transaction } from "./Transaction.js";

export class Blockchain {
  public readonly chain: Block[];
  public readonly pendingTransactions: Transaction[];
  public readonly difficulty: number;

  constructor(difficulty: number = 3) {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.difficulty = difficulty;
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

    console.log(`Minando bloque ${newBlock.index}...`);

    newBlock.mine(this.difficulty);

    this.chain.push(newBlock);
    this.pendingTransactions.length = 0;

    console.log(`Bloque minado.`);
    console.log(`Nonce: ${newBlock.nonce}`);
    console.log(`Hash: ${newBlock.hash}`);
  }

  public getBalance(address: string): number {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.from === address) {
          balance -= transaction.amount;
        }

        if (transaction.to === address) {
          balance += transaction.amount;
        }
      }
    }

    return balance;
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

      if (!currentBlock.hash.startsWith("0".repeat(this.difficulty))) {
        return false;
      }

      for (const transaction of currentBlock.transactions) {
        if (!transaction.verifySignature()) {
          return false;
        }
      }
    }

    return true;
  }
}
