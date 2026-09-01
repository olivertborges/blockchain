import { Block } from "./Block.js";
import { Transaction } from "./Transaction.js";

export class Blockchain {
  public readonly chain: Block[];
  public readonly pendingTransactions: Transaction[];
  public readonly difficulty: number;
  public readonly miningReward: number;

  constructor(
    difficulty: number = 3,
    miningReward: number = 50
  ) {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.difficulty = difficulty;
    this.miningReward = miningReward;
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
    if (!transaction.verifySignature()) {
      throw new Error("La transacción tiene una firma inválida.");
    }

    if (transaction.from === null) {
      throw new Error(
        "Una recompensa minera no puede agregarse como una transacción normal."
      );
    }

    const balance = this.getBalance(transaction.from);

    const pendingOutgoing = this.pendingTransactions
      .filter((pending) => pending.from === transaction.from)
      .reduce((total, pending) => total + pending.amount, 0);

    const availableBalance = balance - pendingOutgoing;

    if (availableBalance < transaction.amount) {
      throw new Error(
        `Saldo insuficiente. Disponible: ${availableBalance}, necesario: ${transaction.amount}`
      );
    }

    this.pendingTransactions.push(transaction);
  }

  public minePendingTransactions(minerAddress: string): void {
    const previousBlock = this.chain[this.chain.length - 1];

    if (!previousBlock) {
      throw new Error("La blockchain no tiene bloques.");
    }

    const rewardTransaction = new Transaction(
      null,
      minerAddress,
      this.miningReward
    );

    const transactions = [
      ...this.pendingTransactions,
      rewardTransaction
    ];

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

  public getBalance(address: string | null): number {
    if (address === null) {
      return 0;
    }

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

      const rewardTransaction = currentBlock.transactions[0];

      if (!rewardTransaction) {
        return false;
      }

      if (rewardTransaction.from !== null) {
        return false;
      }

      if (rewardTransaction.amount !== this.miningReward) {
        return false;
      }

      if (!rewardTransaction.verifySignature()) {
        return false;
      }

      for (const transaction of currentBlock.transactions.slice(1)) {
        if (!transaction.verifySignature()) {
          return false;
        }
      }
    }

    return true;
  }
}
