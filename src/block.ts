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