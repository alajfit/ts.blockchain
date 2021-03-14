import { Chain, Transaction } from '../src'
import { createKeys } from '../src/utils'
import { ec as EC } from 'elliptic'

describe('Blockchain', () => {
    const ec = new EC('secp256k1')
    const keys = createKeys()
    const myKey = ec.keyFromPrivate(keys.private)
    const walletAddress = myKey.getPublic('hex')

    let tsBlockchain: Chain

    it ('Should allow us to create a Blockchain with a Genesis block', () => {
        tsBlockchain = new Chain()
        expect(tsBlockchain.getLatestBlock().previousHash).toBe('0')
    })

    it ('Should allow us to mine Blocks on the blockchain', () => {
        tsBlockchain = new Chain()
        tsBlockchain.minePendingTransactions(walletAddress)
        expect(tsBlockchain.pendingTransactions.length).toBe(1)
    })

    it ('Should be able to determine the chain is valid', () => {
        tsBlockchain = new Chain()
        tsBlockchain.minePendingTransactions(walletAddress)
        tsBlockchain.minePendingTransactions(walletAddress)
        tsBlockchain.minePendingTransactions(walletAddress)
        tsBlockchain.minePendingTransactions(walletAddress)
        expect(tsBlockchain.isChainValid()).toBe(true)
    })

    it ('Should be able to determine if the data has been corrupted', () => {
        tsBlockchain = new Chain()
        tsBlockchain.minePendingTransactions(walletAddress)
        tsBlockchain.minePendingTransactions(walletAddress)
        tsBlockchain.minePendingTransactions(walletAddress)
        tsBlockchain.chain[1].transactions = [new Transaction(null, walletAddress, 10000)]
        expect(tsBlockchain.isChainValid()).toBe(false)
    })

    it ('Should be able to check if a bad actor tries to recalculate the hash', () => {
        tsBlockchain = new Chain()
        tsBlockchain.minePendingTransactions(walletAddress)
        tsBlockchain.minePendingTransactions(walletAddress)
        tsBlockchain.minePendingTransactions(walletAddress)
        tsBlockchain.chain[1].transactions = [new Transaction(null, walletAddress, 10000)]
        tsBlockchain.chain[1].calculateHash()
        expect(tsBlockchain.isChainValid()).toBe(false)
    })

    it ('Will check the block has been mined with valid difficulty', () => {
        tsBlockchain = new Chain(3)
        tsBlockchain.minePendingTransactions(walletAddress)
        expect(tsBlockchain.getLatestBlock().hash.substring(0, 3)).toBe('000')
    })

    it ('Will rewards are available once a new block has been mined', () => {
        tsBlockchain = new Chain()
        tsBlockchain.minePendingTransactions(walletAddress)
        tsBlockchain.minePendingTransactions(walletAddress)
        expect(tsBlockchain.getBalanceOfAddress(walletAddress)).toBe(10)
    })

    it ('Allows signed Transactions to be added', () => {
        tsBlockchain = new Chain()
        const transaction = new Transaction(walletAddress, 'test', 50)
        transaction.signTransaction(myKey)
        tsBlockchain.addTransaction(transaction)
        tsBlockchain.minePendingTransactions(walletAddress)
        expect(tsBlockchain.getBalanceOfAddress(walletAddress)).toBe(-50)
    })
})