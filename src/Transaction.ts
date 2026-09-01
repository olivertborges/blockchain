import { createSign, createVerify } from "node:crypto";

export class Transaction {
  public readonly from: string;
  public readonly to: string;
  public readonly amount: number;
  public signature: string | null;

  constructor(
    from: string,
    to: string,
    amount: number
  ) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.signature = null;
  }

  public calculateHash(): string {
    return `${this.from}${this.to}${this.amount}`;
  }

  public signTransaction(privateKey: string): void {
    const signer = createSign("SHA256");

    signer.update(this.calculateHash());
    signer.end();

    this.signature = signer.sign(privateKey, "hex");
  }

  public verifySignature(): boolean {
    if (this.signature === null) {
      return false;
    }

    const verifier = createVerify("SHA256");

    verifier.update(this.calculateHash());
    verifier.end();

    return verifier.verify(this.from, this.signature, "hex");
  }
}
