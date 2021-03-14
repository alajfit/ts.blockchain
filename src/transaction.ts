import { SHA256 } from 'crypto-js'
import { ec as EC } from 'elliptic'

const ec = new EC('secp256k1')

export class Transaction {
    fromAddress: string | null
    toAddress: string | null
    amount: number
    signature: string

    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString()
    }

    signTransaction(signingKey: EC.KeyPair) {
        if (signingKey.getPublic('hex') !== this.fromAddress) throw new Error('Incorrect Public Key Provided')
        const signedKey = signingKey.sign(this.calculateHash(), 'base64')
        this.signature = signedKey.toDER('hex')
    }

    isValid() {
        if (this.fromAddress === null) return true
        if (!this.signature || this.signature.length === 0) throw new Error('No Signature Available')

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
        return publicKey.verify(this.calculateHash(), this.signature)
    }
}