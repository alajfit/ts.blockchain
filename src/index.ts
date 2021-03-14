import { SHA256 } from 'crypto-js'

export class Block {
    index: Number
    timestamp: Date
    data: Object
    previousHash: String
    hash: String
    nounce: number

    constructor(index: Number, timestamp: Date, data: Object, previousHash: String = '') {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.nounce = 0
        this.hash = this.calculateHash()
    }

    calculateHash(): String {
        return SHA256(
            this.index.toString() + 
            this.previousHash + 
            this.timestamp + 
            JSON.stringify(this.data) +
            this.nounce
        ).toString()
    }

    mineBlock(difficulty) {
        const difficultyCheck = '0'.repeat(difficulty)
        while(this.hash.substring(0, difficulty) !== difficultyCheck) {
            this.nounce++
            this.hash = this.calculateHash()
        }
    }
}

export class Blockchain {
    chain: Block[]
    difficulty: Number

    constructor(difficulty: Number = 2) {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = difficulty
    }

    createGenesisBlock(): Block {
        return new Block(0, new Date(), 'Genesis Block', '0')
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1]
    }

    addBlock(block: Block) {
        block.previousHash = this.getLatestBlock().hash
        block.mineBlock(this.difficulty)
        this.chain.push(block)
    }

    isChainValid(): Boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currBlock = this.chain[i]
            const prevBlock = this.chain[i - 1]

            if (currBlock.hash !== currBlock.calculateHash()) {
                return false
            }

            if (currBlock.previousHash !== prevBlock.hash) {
                return false
            }
        }
        return true
    }
}
