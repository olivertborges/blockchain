import { Block } from "./Block.js";

const bloqueGenesis = new Block(
  0,
  Date.now(),
  "Bloque Génesis",
  "0"
);

const bloque1 = new Block(
  1,
  Date.now(),
  "Primer bloque",
  bloqueGenesis.hash
);

const bloque2 = new Block(
  2,
  Date.now(),
  "Segundo bloque",
  bloque1.hash
);

// Alguien altera el contenido del bloque 1
const bloque1Alterado = new Block(
  1,
  bloque1.timestamp,
  "Primer bloque ALTERADO",
  bloque1.previousHash
);

console.log("Hash original del bloque 1:");
console.log(bloque1.hash);

console.log("\nHash del bloque 1 alterado:");
console.log(bloque1Alterado.hash);

console.log("\n¿El bloque 2 sigue apuntando al bloque 1 original?");
console.log(bloque2.previousHash === bloque1Alterado.hash);
