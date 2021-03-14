import { SHA256 } from 'crypto-js'

export class Block {
    timestamp: Date
    data: Object
    previousHash: String
    hash: String
    nounce: number

    constructor(timestamp: Date, data: Object, previousHash: String = '') {
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.nounce = 0
        this.hash = this.calculateHash()
    }

    calculateHash(): String {
        return SHA256(
            this.previousHash + 
            this.timestamp.toISOString() + 
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