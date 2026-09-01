import { createHash } from "node:crypto";
import { Transaction } from "./Transaction.js";

export class Block {
  public readonly index: number;
  public readonly timestamp: number;
  public readonly transactions: Transaction[];
  public readonly previousHash: string;
  public readonly hash: string;

  constructor(
    index: number,
    timestamp: number,
    transactions: Transaction[],
    previousHash: string
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  public calculateHash(): string {
    return createHash("sha256")
      .update(
        `${this.index}${this.timestamp}${JSON.stringify(this.transactions)}${this.previousHash}`
      )
      .digest("hex");
  }
}
