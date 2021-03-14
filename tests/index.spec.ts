import { Chain, Block } from '../src'

describe('Blockchain', () => {
    let tsBlockchain: Chain

    it ('Should allow us to create a Blockchain with a Genesis block', () => {
        tsBlockchain = new Chain()
        expect(tsBlockchain.getLatestBlock().previousHash).toBe('0')
    })

    it ('Should allow us to add Blocks to the blockchain', () => {
        tsBlockchain = new Chain()
        const data = { amount: 2 }
        tsBlockchain.addBlock(new Block(new Date(), data))
        expect(tsBlockchain.getLatestBlock().data).toBe(data)
    })

    it ('Should be able to determine the chain is valid', () => {
        tsBlockchain = new Chain()
        tsBlockchain.addBlock(new Block(new Date(), { amount: 4 }))
        tsBlockchain.addBlock(new Block(new Date(), { amount: 6 }))
        tsBlockchain.addBlock(new Block(new Date(), { amount: 2 }))
        tsBlockchain.addBlock(new Block(new Date(), { amount: 3 }))
        expect(tsBlockchain.isChainValid()).toBe(true)
    })

    it ('Should be able to determine if the data has been corrupted', () => {
        tsBlockchain = new Chain()
        tsBlockchain.addBlock(new Block(new Date(), { amount: 2 }))
        tsBlockchain.addBlock(new Block(new Date(), { amount: 8 }))
        tsBlockchain.addBlock(new Block(new Date(), { amount: 4 }))
        tsBlockchain.chain[1].data = { amount: 1000 }
        expect(tsBlockchain.isChainValid()).toBe(false)
    })

    it ('Should be able to check if a bad actor tries to recalculate the hash', () => {
        tsBlockchain = new Chain()
        tsBlockchain.addBlock(new Block(new Date(), { amount: 5 }))
        tsBlockchain.addBlock(new Block(new Date(), { amount: 6 }))
        tsBlockchain.addBlock(new Block(new Date(), { amount: 7 }))
        tsBlockchain.chain[1].data = { amount: 1000 }
        tsBlockchain.chain[1].calculateHash()
        expect(tsBlockchain.isChainValid()).toBe(false)
    })

    it ('Will check the block has been mined with valid difficulty', () => {
        tsBlockchain = new Chain(3)
        tsBlockchain.addBlock(new Block(new Date(), { amount: 5 }))
        expect(tsBlockchain.getLatestBlock().hash.substring(0, 3)).toBe('000')
    })
})