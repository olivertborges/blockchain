import { Wallet } from "./Wallet.js";
import { Transaction } from "./Transaction.js";
import { Blockchain } from "./Blockchain.js";

const alice = new Wallet();
const bob = new Wallet();
const carlos = new Wallet();

const blockchain = new Blockchain();

// Alice consigue 50 monedas.
blockchain.minePendingTransactions(alice.publicKey);

console.log("Balance de Alice:");
console.log(blockchain.getBalance(alice.publicKey));

// Primera transacción: Alice → Bob: 40
const transaction1 = new Transaction(
  alice.publicKey,
  bob.publicKey,
  40
);

transaction1.signTransaction(alice.privateKey);

blockchain.addTransaction(transaction1);

console.log("\nPrimera transacción agregada.");

// Segunda transacción: Alice → Carlos: 40
const transaction2 = new Transaction(
  alice.publicKey,
  carlos.publicKey,
  40
);

transaction2.signTransaction(alice.privateKey);

blockchain.addTransaction(transaction2);

console.log("Segunda transacción agregada.");

console.log("\nTransacciones pendientes:");
console.log(blockchain.pendingTransactions);
