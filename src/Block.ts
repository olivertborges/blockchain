import { createHash } from "node:crypto";

export class Block {
  public readonly index: number;
  public readonly timestamp: number;
  public data: string;
  public readonly previousHash: string;
  public readonly hash: string;

  constructor(
    index: number,
    timestamp: number,
    data: string,
    previousHash: string
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  public calculateHash(): string {
    return createHash("sha256")
      .update(
        `${this.index}${this.timestamp}${this.data}${this.previousHash}`
      )
      .digest("hex");
  }
}
