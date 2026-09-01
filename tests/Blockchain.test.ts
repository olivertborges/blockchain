import { describe, expect, it } from "vitest";
import { Blockchain } from "../src/Blockchain.js";
import { Wallet } from "../src/Wallet.js";
import { Transaction } from "../src/Transaction.js";

describe("Blockchain", () => {
  it("debe aceptar una transacción válida", () => {
    const blockchain = new Blockchain();
    const alice = new Wallet();
    const bob = new Wallet();

    blockchain.minePendingTransactions(alice.publicKey);

    const transaction = new Transaction(
      alice.publicKey,
      bob.publicKey,
      40
    );

    transaction.signTransaction(alice.privateKey);

    blockchain.addTransaction(transaction);

    expect(blockchain.pendingTransactions).toHaveLength(1);
  });

  it("debe rechazar una transacción con saldo insuficiente", () => {
    const blockchain = new Blockchain();
    const alice = new Wallet();
    const bob = new Wallet();

    blockchain.minePendingTransactions(alice.publicKey);

    const transaction = new Transaction(
      alice.publicKey,
      bob.publicKey,
      60
    );

    transaction.signTransaction(alice.privateKey);

    expect(() => {
      blockchain.addTransaction(transaction);
    }).toThrow("Saldo insuficiente");

    expect(blockchain.pendingTransactions).toHaveLength(0);
  });

  it("debe impedir doble gasto entre transacciones pendientes", () => {
    const blockchain = new Blockchain();
    const alice = new Wallet();
    const bob = new Wallet();

    blockchain.minePendingTransactions(alice.publicKey);

    const firstTransaction = new Transaction(
      alice.publicKey,
      bob.publicKey,
      40
    );

    firstTransaction.signTransaction(alice.privateKey);
    blockchain.addTransaction(firstTransaction);

    const secondTransaction = new Transaction(
      alice.publicKey,
      bob.publicKey,
      20
    );

    secondTransaction.signTransaction(alice.privateKey);

    expect(() => {
      blockchain.addTransaction(secondTransaction);
    }).toThrow("Saldo insuficiente");

    expect(blockchain.pendingTransactions).toHaveLength(1);
  });

  it("debe detectar cuando se modifica un bloque después de minarlo", () => {
    const blockchain = new Blockchain(3, 50);
    const wallet = new Wallet();

    blockchain.minePendingTransactions(wallet.publicKey);

    expect(blockchain.isValid()).toBe(true);

    const block = blockchain.chain[1];

    if (!block) {
      throw new Error("El bloque no existe.");
    }

    block.nonce++;

    expect(blockchain.isValid()).toBe(false);
  });

  it("debe detectar cuando se modifica el previousHash de un bloque", () => {
    const blockchain = new Blockchain(3, 50);
    const wallet = new Wallet();

    blockchain.minePendingTransactions(wallet.publicKey);
    blockchain.minePendingTransactions(wallet.publicKey);

    expect(blockchain.isValid()).toBe(true);

    const block = blockchain.chain[2];

    if (!block) {
      throw new Error("El bloque no existe.");
    }

    block.previousHash = "hash-falso";

    expect(blockchain.isValid()).toBe(false);
  });

  it("debe detectar cuando se modifica una transacción después de minarla", () => {
    const blockchain = new Blockchain(3, 50);
    const alice = new Wallet();
    const bob = new Wallet();

    blockchain.minePendingTransactions(alice.publicKey);

    const transaction = new Transaction(
      alice.publicKey,
      bob.publicKey,
      40
    );

    transaction.signTransaction(alice.privateKey);
    blockchain.addTransaction(transaction);

    blockchain.minePendingTransactions(alice.publicKey);

    expect(blockchain.isValid()).toBe(true);

    const block = blockchain.chain[2];

    if (!block) {
      throw new Error("El bloque no existe.");
    }

    const storedTransaction = block.transactions[0];

    if (!storedTransaction) {
      throw new Error("La transacción no existe.");
    }

    storedTransaction.amount = 999;

    expect(blockchain.isValid()).toBe(false);
  });
});
