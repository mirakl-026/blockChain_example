const { Block, Blockchain } = require("./JeChain.js");

const JeChain = new Blockchain();

// добавим новый блок
JeChain.addBlock(new Block(Date.now().toString(), { from: "John", to: "Bob", money: 100 }));

console.log(JeChain.chain);

console.log(JeChain.difficulty);