const GOOGLE = 'google';
const REDDIT = 'reddit';
const TWITTER = 'twitter';

export default class VerifierMaps {
    testnet() {
        return {
            [GOOGLE]: {
                name: 'Google',
                typeOfLogin: 'google',
                clientId: '1071240514641-0ga4pvni5i2c06uv4tsqtfcqmel7eupj.apps.googleusercontent.com',
                verifier: 'tezsure',
                caseSensitiveVerifierID: false
            },
            [REDDIT]: {
                name: 'Reddit',
                typeOfLogin: 'reddit',
                clientId: 'H0nhRv1leU9pGQ',
                verifier: 'tezos-reddit-testnet',
                caseSensitiveVerifierID: false
            },
            [TWITTER]: {
                name: 'Twitter',
                typeOfLogin: 'twitter',
                clientId: 'vKFgnaYZzKLUnhxnX5xqTqeMcumdVTz1',
                verifier: 'tezos-twitter-test',
                caseSensitiveVerifierID: false
            }
        }
    }
    mainnet() {
        return {
            [GOOGLE]: {
                name: 'Google',
                typeOfLogin: 'google',
                clientId: '1071240514641-0ga4pvni5i2c06uv4tsqtfcqmel7eupj.apps.googleusercontent.com',
                verifier: 'tezsure',
                caseSensitiveVerifierID: false
            },
            [REDDIT]: {
                name: 'Reddit',
                typeOfLogin: 'reddit',
                clientId: 'YivAW_t3iCp9QA',
                verifier: 'tezos-reddit',
                caseSensitiveVerifierID: false
            },
            [TWITTER]: {
                name: 'Twitter',
                typeOfLogin: 'twitter',
                clientId: 'UJl5d4iHVgbrAaSlucXNf2F2uKlC0m25',
                verifier: 'tezos-twitter',
                caseSensitiveVerifierID: false
            }
        }
    }
}