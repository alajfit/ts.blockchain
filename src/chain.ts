import { Block } from './block'
import { Transaction } from './transaction'

export class Chain {
    chain: Block[]
    difficulty: number
    pendingTransactions: Transaction[]
    miningReward: number

    constructor(difficulty: number = 2) {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = difficulty
        this.pendingTransactions = []
        this.miningReward = 10
    }

    createGenesisBlock() : Block {
        return new Block(new Date(), [], '0')
    }

    getLatestBlock() : Block {
        return this.chain[this.chain.length - 1]
    }

    getBalanceOfAddress(address: String) {
        let balance = 0

        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) balance -= transaction.amount
                if (transaction.toAddress === address) balance += transaction.amount
            }
        }

        return balance
    }

    createTransaction(transaction: Transaction) : void {
        this.pendingTransactions.push(transaction)
    }

    minePendingTransactions(miningRewardAddress: string) : void {
        /**
         * Usually we will have to select the pending transactions 
         * Bitcoin does not allow anymore transactions than 1MB
         */
        let block = new Block(new Date(), this.pendingTransactions)
        block.previousHash = this.getLatestBlock().hash
        block.mineBlock(this.difficulty)
        this.chain.push(block)
        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)]
    }

    isChainValid() : Boolean {
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