import {
  createHash,
  createSign,
  createVerify,
} from "node:crypto";

export class Transaction {
  public readonly from: string | null;
  public readonly to: string;
  public readonly amount: number;
  public readonly id: string;
  public signature: string | null;

  constructor(
    from: string | null,
    to: string,
    amount: number
  ) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.signature = null;
    this.id = this.calculateId();
  }

  public calculateHash(): string {
    return `${this.from}${this.to}${this.amount}`;
  }

  public calculateId(): string {
    return createHash("sha256")
      .update(this.calculateHash())
      .digest("hex");
  }

  public signTransaction(privateKey: string): void {
    if (this.from === null) {
      throw new Error("Una recompensa minera no necesita firma.");
    }

    const signer = createSign("SHA256");

    signer.update(this.calculateHash());
    signer.end();

    this.signature = signer.sign(privateKey, "hex");
  }

  public verifySignature(): boolean {
    if (this.from === null) {
      return true;
    }

    if (this.signature === null) {
      return false;
    }

    const verifier = createVerify("SHA256");

    verifier.update(this.calculateHash());
    verifier.end();

    return verifier.verify(this.from, this.signature, "hex");
  }
}
