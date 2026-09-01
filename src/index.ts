import { Wallet } from "./Wallet.js";
import { Transaction } from "./Transaction.js";

const wallet = new Wallet();

const transaction = new Transaction(
  wallet.publicKey,
  "Bob",
  10
);

transaction.signTransaction(wallet.privateKey);

console.log("¿La firma es válida?");
console.log(transaction.verifySignature());
