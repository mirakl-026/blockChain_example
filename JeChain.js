// подключаем хеш-функцию sha-256
const crypto = require("crypto"), 
SHA256 = (message) => crypto.createHash("sha256").update(message).digest("hex");


// блок
class Block {
    constructor (timestamp = "", data = []) {
        this.timestamp = timestamp;

        // в data хранятся данные о транзакциях
        this.data = data;

        this.hash = this.getHash();
        this.prevHash = ""; // хеш предыдущего блока
        this.nonce = 0;        
    }

    // наша хеш-функция
    getHash() {
        return SHA256(this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce);
    }

    mine(difficulty) {
        // тут запускается цикл, работающий до тех пор, пока хеш не будет начинаться
        // со строки 0...000 длины <difficulty>
        while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
            // инкрементируем nonce, что позволяет получить новый хеш
            this.nonce++;

            // пересчитываем хеш блока с учётом нового значения nonce
            this.hash = this.getHash();
        }
    }
}

class Blockchain {
    constructor() {
        // создаём первичный блок
        this.chain = [new Block(Date.now().toString())];
        this.difficulty = 1;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        // т.к. мы добавляем новый блок, prevHash будет хешем предыдущего последнего блока
        block.prevHash = this.getLastBlock().hash;

        // т.к. теперь в prevHash изменилось значение, нужно пересчитать хеш блока
        block.hash = block.getHash();
        block.mine(this.difficulty);
        this.chain.push(block);
    }

    // проверка блокчейна
    isValid() {
        // с 1-го, т.к. у нулевого элемента нет prevHash
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            // проверка 
            if (currentBlock.hash !== currentBlock.getHash() ||
                prevBlock.hash !== currentBlock.prevHash) {
                    return false;
            }
        }
        return true;
    }
}

module.exports = { Block, Blockchain };