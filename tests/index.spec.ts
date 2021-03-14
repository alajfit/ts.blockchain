import { Blockchain, Block } from '../src'

describe('Blockchain', () => {
    let tsBlockchain: Blockchain

    it ('Should allow us to create a Blockchain with a Genesis block', () => {
        tsBlockchain = new Blockchain()
        expect(tsBlockchain.getLatestBlock().index).toBe(0)
    })

    it ('Should allow us to add Blocks to the blockchain', () => {
        tsBlockchain = new Blockchain()
        const data = { amount: 2 }
        tsBlockchain.addBlock(new Block(1, new Date(), data))
        expect(tsBlockchain.getLatestBlock().index).toBe(1)
        expect(tsBlockchain.getLatestBlock().data).toBe(data)
    })

    it ('Should be able to determine the chain is valid', () => {
        tsBlockchain = new Blockchain()
        tsBlockchain.addBlock(new Block(1, new Date(), { amount: 4 }))
        tsBlockchain.addBlock(new Block(2, new Date(), { amount: 6 }))
        tsBlockchain.addBlock(new Block(3, new Date(), { amount: 2 }))
        tsBlockchain.addBlock(new Block(4, new Date(), { amount: 3 }))
        expect(tsBlockchain.isChainValid()).toBe(true)
    })

    it ('Should be able to determine if the data has been corrupted', () => {
        tsBlockchain = new Blockchain()
        tsBlockchain.addBlock(new Block(1, new Date(), { amount: 2 }))
        tsBlockchain.addBlock(new Block(2, new Date(), { amount: 8 }))
        tsBlockchain.addBlock(new Block(3, new Date(), { amount: 4 }))
        tsBlockchain.chain[1].data = { amount: 1000 }
        expect(tsBlockchain.isChainValid()).toBe(false)
    })

    it ('Should be able to check if a bad actor tries to recalculate the hash', () => {
        tsBlockchain = new Blockchain()
        tsBlockchain.addBlock(new Block(1, new Date(), { amount: 5 }))
        tsBlockchain.addBlock(new Block(2, new Date(), { amount: 6 }))
        tsBlockchain.addBlock(new Block(3, new Date(), { amount: 7 }))
        tsBlockchain.chain[1].data = { amount: 1000 }
        tsBlockchain.chain[1].calculateHash()
        expect(tsBlockchain.isChainValid()).toBe(false)
    })
})