import { SHA256 } from 'crypto-js'
import { Transaction } from './transaction'

export class Block {
    timestamp: Date
    transactions: Transaction[]
    previousHash: String
    hash: String
    nounce: number

    constructor(timestamp: Date, transactions: Transaction[], previousHash: String = '') {
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.nounce = 0
        this.hash = this.calculateHash()
    }

    calculateHash() : String {
        return SHA256(
            this.previousHash + 
            this.timestamp.toISOString() + 
            JSON.stringify(this.transactions) +
            this.nounce
        ).toString()
    }

    mineBlock(difficulty) : String {
        const difficultyCheck = '0'.repeat(difficulty)
        while(this.hash.substring(0, difficulty) !== difficultyCheck) {
            this.nounce++
            this.hash = this.calculateHash()
        }
        return this.hash
    }

    allTransactionsValid() {
        for (const transaction of this.transactions) {
            if (!transaction.isValid()) return false
        }
        return true
    }
}