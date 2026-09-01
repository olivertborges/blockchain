import { Wallet } from "./Wallet.js";
import { Transaction } from "./Transaction.js";
import { Blockchain } from "./Blockchain.js";

const alice = new Wallet();
const blockchain = new Blockchain();

console.log("Balance inicial de Alice:");
console.log(blockchain.getBalance(alice.publicKey));

console.log("\n--- MINERÍA ---");

blockchain.minePendingTransactions(alice.publicKey);

console.log("\nBalance de Alice después de minar:");
console.log(blockchain.getBalance(alice.publicKey));

const transaction = new Transaction(
  alice.publicKey,
  "Bob",
  10
);

transaction.signTransaction(alice.privateKey);

blockchain.addTransaction(transaction);

console.log("\nTransacción agregada:");
console.log(transaction);

console.log("\n--- SEGUNDA MINERÍA ---");

blockchain.minePendingTransactions(alice.publicKey);

console.log("\nBalance final de Alice:");
console.log(blockchain.getBalance(alice.publicKey));

console.log("\nBalance final de Bob:");
console.log(blockchain.getBalance("Bob"));

console.log("\n¿La blockchain es válida?");
console.log(blockchain.isValid());
