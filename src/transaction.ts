export class Transaction {
    fromAddress: string | null
    toAddress: string | null
    amount: number

    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}