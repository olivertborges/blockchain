import { createHash } from "node:crypto";
import { Transaction } from "./Transaction.js";

export class Block {
  public readonly index: number;
  public readonly timestamp: number;
  public readonly transactions: Transaction[];
  public readonly previousHash: string;
  public hash: string;
  public nonce: number;

  constructor(
    index: number,
    timestamp: number,
    transactions: Transaction[],
    previousHash: string,
    nonce: number = 0
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = nonce;
    this.hash = this.calculateHash();
  }

  public calculateHash(): string {
    return createHash("sha256")
      .update(
        `${this.index}${this.timestamp}${JSON.stringify(this.transactions)}${this.previousHash}${this.nonce}`
      )
      .digest("hex");
  }

  public mine(difficulty: number): void {
    const target = "0".repeat(difficulty);

    while (!this.hash.startsWith(target)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}
