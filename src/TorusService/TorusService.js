/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import TorusSdk from "@toruslabs/torus-direct-web-sdk";
import TorusUtils from '@toruslabs/torus.js';
import FetchNodeDetails from '@toruslabs/fetch-node-details';
import VerifierMaps from './VerifierMaps';
import Operations from './Operations';

const GOOGLE = 'google';
const REDDIT = 'reddit';
const TWITTER = 'twitter';
const AUTH_DOMAIN = 'https://dev-0li4gssz.eu.auth0.com';

export default class TorusService {
    constructor() {
        this.verifierMaps = new VerifierMaps();
        this.operationService = new Operations();
        this.verifierMap = '';
        this.proxy = {};
        this.torusdirectsdk = '';
    }
    async initTorus(NETWORK) {
        try {
            if (NETWORK === 'mainnet') {
                this.verifierMap = this.verifierMaps.mainnet();
                this.proxy = {
                    address: '0x638646503746d5456209e33a2ff5e3226d698bea',
                    network: 'mainnet'
                };
            } else if (NETWORK === 'testnet') {
                this.verifierMap = this.verifierMaps.testnet();
                this.proxy = {
                    address: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183',
                    network: 'ropsten'
                };
            }
            this.torusdirectsdk = new TorusSdk({
                baseUrl: `${location.origin}/serviceworker`,
                enableLogging: !(this.proxy.network === 'mainnet'),
                proxyContractAddress: this.proxy.address,
                network: (this.proxy.network === 'mainnet') ? this.proxy.network : 'testnet',
            });
            await this.torusdirectsdk.init({ skipSw: false });
            return this.torusdirectsdk;
        } catch (error) {
            console.error(error, "mounted caught");
        }
    }

    async lookupPkh(selectedVerifier, verifierId) {
        const fetchNodeDetails = new FetchNodeDetails({
            network: this.proxy.network,
            proxyAddress: this.proxy.address
        });
        const torus = new TorusUtils();
        const verifier = this.verifierMap[selectedVerifier].verifier;
        if (!this.nodeDetails) {
            const { torusNodeEndpoints, torusNodePub } = await fetchNodeDetails.getNodeDetails();
            this.nodeDetails = { torusNodeEndpoints, torusNodePub };
        }
        let sanitizedVerifierId = verifierId;
        if (!this.verifierMap[selectedVerifier].caseSensitiveVerifierID) {
            sanitizedVerifierId = sanitizedVerifierId.toLocaleLowerCase();
        }
        let twitterId = '';
        if (selectedVerifier === 'twitter') {
            const username = sanitizedVerifierId.replace('@', '');
            const { id } = await this.twitterLookup(username);
            if (this.inputValidationService.twitterId(id)) {
                sanitizedVerifierId = `twitter|${id}`;
                twitterId = id;
            } else {
                throw new Error('Twitter handle not found');
            }
        }
        const pk = await torus.getPublicAddress(
            this.nodeDetails.torusNodeEndpoints,
            this.nodeDetails.torusNodePub,
            {
                verifier,
                verifierId: sanitizedVerifierId
            },
            true
        );
        const pkh = this.operationService.spPointsToPkh(pk.X, pk.Y);
        return { pkh, twitterId };
    }
    async twitterLookup(username, id) {
        let req = {};
        if ((id && username) || (!id && !username)) {
            console.log({ username, id });
            throw new Error('Invalid input');
        } else if (id) {
            req = { id };
        } else {
            req = { username: username.replace('@', '') };
        }
        return await fetch(`https://api.tezos.help/twitter-lookup/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(req)
        }).then(
            (ans) => {
                return ans.json();
            }
        );
    }
    async loginTorus(selectedVerifier, verifierId = '') {
        try {
            debugger;
            const jwtParams = this._loginToConnectionMap()[selectedVerifier] || {};
            if (verifierId && selectedVerifier === GOOGLE) {
                jwtParams.login_hint = verifierId;
                console.log('login_hint: ' + verifierId);
            }
            const { typeOfLogin, clientId, verifier } = this.verifierMap[selectedVerifier];
            const loginDetails = await this.torusdirectsdk.triggerLogin({
                verifier,
                typeOfLogin,
                clientId,
                jwtParams
            });
            const keyPair = this.operationService.spPrivKeyToKeyPair(loginDetails.privateKey);
            return { keyPair, userInfo: loginDetails.userInfo };
        } catch (e) {
            console.error(e, 'login caught');
            return { keyPair: null, userInfo: null };
        }
    }
    _loginToConnectionMap() {
        return {
            [TWITTER]: {
                domain: AUTH_DOMAIN,
            }
        };
    }
};