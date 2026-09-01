import { Wallet } from "./Wallet.js";
import { Blockchain } from "./Blockchain.js";
import { Transaction } from "./Transaction.js";

const alice = new Wallet();
const bob = new Wallet();

const blockchain = new Blockchain();

// Alice recibe 50 por minería.
blockchain.minePendingTransactions(alice.publicKey);

console.log("Balance de Alice:");
console.log(blockchain.getBalance(alice.publicKey));

// Creamos una transacción válida de Alice → Bob por 40.
const transaction = new Transaction(
  alice.publicKey,
  bob.publicKey,
  40
);

transaction.signTransaction(alice.privateKey);

// La agregamos normalmente.
blockchain.addTransaction(transaction);

// Minamos el bloque.
blockchain.minePendingTransactions(alice.publicKey);

console.log("\nBalance de Alice:");
console.log(blockchain.getBalance(alice.publicKey));

console.log("\nBalance de Bob:");
console.log(blockchain.getBalance(bob.publicKey));

console.log("\n¿La blockchain es válida?");
console.log(blockchain.isValid());
