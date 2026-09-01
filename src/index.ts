import { Blockchain } from "./Blockchain.js";

const blockchain = new Blockchain();

blockchain.addBlock("Primer bloque");
blockchain.addBlock("Segundo bloque");

console.log("¿Blockchain válida antes de alterar?");
console.log(blockchain.isValid());

const bloque1 = blockchain.chain[1];

if (bloque1) {
  bloque1.data = "Primer bloque ALTERADO";
}

console.log("\n¿Blockchain válida después de alterar?");
console.log(blockchain.isValid());
