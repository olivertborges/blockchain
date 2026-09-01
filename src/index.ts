import { Wallet } from "./Wallet.js";
import { Transaction } from "./Transaction.js";
import { Blockchain } from "./Blockchain.js";

const wallet = new Wallet();
const blockchain = new Blockchain();

const transaction = new Transaction(
  wallet.publicKey,
  "Bob",
  10
);

transaction.signTransaction(wallet.privateKey);

console.log("¿La firma es válida?");
console.log(transaction.verifySignature());

blockchain.addTransaction(transaction);

console.log("\nTransacciones pendientes:");
console.log(blockchain.pendingTransactions);

blockchain.minePendingTransactions();

console.log("\nBlockchain:");
console.log(blockchain.chain);

console.log("\n¿La blockchain es válida?");
console.log(blockchain.isValid());
