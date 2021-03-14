import { SHA256 } from 'crypto-js'

export class Block {
    index: Number
    timestamp: Date
    data: Object
    previousHash: String
    hash: String

    constructor(index: Number, timestamp: Date, data: Object, previousHash: String = '') {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
    }

    calculateHash(): String {
        return SHA256(
            this.index.toString() + 
            this.previousHash + 
            this.timestamp + 
            JSON.stringify(this.data)).toString()
    }
}

export class Blockchain {
    chain: Block[]

    constructor() {
        this.chain = [this.createGenesisBlock()]
    }

    createGenesisBlock(): Block {
        return new Block(0, new Date(), 'Genesis Block', '0')
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1]
    }

    addBlock(block: Block) {
        block.previousHash = this.getLatestBlock().hash
        block.hash = block.calculateHash()
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