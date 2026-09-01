import { generateKeyPairSync } from "node:crypto";

export class Wallet {
  public readonly publicKey: string;
  public readonly privateKey: string;

  constructor() {
    const { publicKey, privateKey } = generateKeyPairSync("ec", {
      namedCurve: "secp256k1",
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "sec1",
        format: "pem",
      },
    });

    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }
}
