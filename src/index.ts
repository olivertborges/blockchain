import { Wallet } from "./Wallet.js";
import { Transaction } from "./Transaction.js";
import { Blockchain } from "./Blockchain.js";

const alice = new Wallet();
const blockchain = new Blockchain();

const transaction = new Transaction(
  alice.publicKey,
  "Bob",
  10
);

transaction.signTransaction(alice.privateKey);

blockchain.addTransaction(transaction);

console.log("Balance de Alice antes de minar:");
console.log(blockchain.getBalance(alice.publicKey));

console.log("\nBalance de Bob antes de minar:");
console.log(blockchain.getBalance("Bob"));

blockchain.minePendingTransactions();

console.log("\nBalance de Alice después de minar:");
console.log(blockchain.getBalance(alice.publicKey));

console.log("\nBalance de Bob después de minar:");
console.log(blockchain.getBalance("Bob"));

console.log("\n¿La blockchain es válida?");
console.log(blockchain.isValid());
