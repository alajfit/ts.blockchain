import { ec as EC } from 'elliptic'

const ec = new EC('secp256k1')

export function createKeys() : { public: string, private: string } {
    const keys = ec.genKeyPair()
    return {
        public: keys.getPublic('hex'),
        private: keys.getPrivate('hex')
    }
}
