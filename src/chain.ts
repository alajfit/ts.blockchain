import { Block } from './block'

export class Chain {
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