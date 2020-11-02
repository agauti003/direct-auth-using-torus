import * as elliptic from 'elliptic';

export default class Operations {
    spPointsToPkh(pubX, pubY) {
        const key = (new elliptic.ec('secp256k1')).keyFromPublic({ x: pubX, y: pubY });
        const prefixVal = key.getPublic().getY().toArray()[31] % 2 ? 3 : 2;
        const pad = new Array(32).fill(0);
        const publicKey = new Uint8Array(
            [prefixVal].concat(pad.concat(key.getPublic().getX().toArray()).slice(-32)
            ));
        const pk = this.b58cencode(publicKey, this.prefix.sppk);
        const pkh = this.pk2pkh(pk);
        return pkh;
    }

    spPrivKeyToKeyPair(secretKey) {
        let sk;
        if (secretKey.match(/^[0-9a-f]{64}$/g)) {
            sk = this.b58cencode(this.hex2buf(secretKey), this.prefix.spsk);
        } else if (secretKey.match(/^spsk[1-9a-km-zA-HJ-NP-Z]{50}$/g)) {
            sk = secretKey;
        } else {
            throw new Error('Invalid private key');
        }
        const keyPair = (new elliptic.ec('secp256k1')).keyFromPrivate(
            new Uint8Array(this.b58cdecode(sk, this.prefix.spsk))
        );
        const prefixVal = keyPair.getPublic().getY().toArray()[31] % 2 ? 3 : 2; // Y odd / even
        const pad = new Array(32).fill(0); // Zero-padding
        const publicKey = new Uint8Array(
            [prefixVal].concat(pad.concat(keyPair.getPublic().getX().toArray()).slice(-32)
            ));
        const pk = this.b58cencode(publicKey, this.prefix.sppk);
        const pkh = this.pk2pkh(pk);
        return { sk, pk, pkh };
    }
}