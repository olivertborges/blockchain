import { describe, expect, it } from "vitest";
import { Wallet } from "../src/Wallet.js";
import { Transaction } from "../src/Transaction.js";

describe("Transaction", () => {
  it("debe aceptar una transacción con una firma válida", () => {
    const alice = new Wallet();
    const bob = new Wallet();

    const transaction = new Transaction(
      alice.publicKey,
      bob.publicKey,
      10
    );

    transaction.signTransaction(alice.privateKey);

    expect(transaction.verifySignature()).toBe(true);
  });

  it("debe rechazar una transacción con una firma manipulada", () => {
    const alice = new Wallet();
    const bob = new Wallet();

    const transaction = new Transaction(
      alice.publicKey,
      bob.publicKey,
      10
    );

    transaction.signTransaction(alice.privateKey);

    transaction.signature = "firma-falsa";

    expect(transaction.verifySignature()).toBe(false);
  });

  it("debe detectar cuando se modifica el monto después de firmar", () => {
    const alice = new Wallet();
    const bob = new Wallet();

    const transaction = new Transaction(
      alice.publicKey,
      bob.publicKey,
      10
    );

    transaction.signTransaction(alice.privateKey);

    Object.defineProperty(transaction, "amount", {
      value: 100,
    });

    expect(transaction.verifySignature()).toBe(false);
  });

  it("debe generar un ID SHA-256 para la transacción", () => {
    const alice = new Wallet();
    const bob = new Wallet();

    const transaction = new Transaction(
      alice.publicKey,
      bob.publicKey,
      10
    );

    expect(transaction.id).toBe(transaction.calculateId());
    expect(transaction.id).toMatch(/^[a-f0-9]{64}$/);
  });
});
