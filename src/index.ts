import { Wallet } from "./Wallet.js";
import { Blockchain } from "./Blockchain.js";

const miner = new Wallet();
const blockchain = new Blockchain();

blockchain.minePendingTransactions(miner.publicKey);

console.log("Blockchain válida antes de alterar:");
console.log(blockchain.isValid());

const block = blockchain.chain[1];

if (!block) {
  throw new Error("No existe el bloque 1.");
}

const reward = block.transactions[0];

if (!reward) {
  throw new Error("El bloque no contiene recompensa.");
}

// Alteramos la recompensa únicamente para esta prueba.
// Usamos Object.defineProperty porque amount es readonly a nivel de TypeScript.
Object.defineProperty(reward, "amount", {
  value: 1_000_000,
  writable: false,
  configurable: true
});

block.hash = block.calculateHash();

console.log("\nRecompensa alterada:");
console.log(reward.amount);

console.log("\n¿La blockchain es válida después de alterar?");
console.log(blockchain.isValid());
