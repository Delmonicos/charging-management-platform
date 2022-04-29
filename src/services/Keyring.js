/* eslint-disable */

import { Keyring } from '@polkadot/keyring';
import { mnemonicGenerate, cryptoWaitReady } from '@polkadot/util-crypto';

class KeyringService {

  _fundingKeyring = null;
  _fundingKeypair = null;

  _chargerAdminKeyring = null;
  _chargerAdminKeypair = null;

  _keyring = null;
  _keypair = null;
  _address = null;

  async init() {
    await cryptoWaitReady();
    this._keyring = new Keyring({ type: 'sr25519' });
    let mnemonic = this.getMnemonicFromLocalStorage();
    if (mnemonic === null) {
      mnemonic = mnemonicGenerate();
      console.log('Mnemonic: ' + mnemonic);
      this.storeMnemonic(mnemonic);
    }
    this._keypair = this._keyring.addFromMnemonic(mnemonic);
    this._address = this._keypair.address;
    console.log(`Operator address: ${this.address}`);

    this._fundingKeyring = new Keyring({ type: 'sr25519' });
    this._fundingKeypair = this._fundingKeyring.createFromUri('//Alice');
    console.log(`Use funding address: ${this._fundingKeypair.address}`);

    this._chargerAdminKeyring = new Keyring({ type: 'sr25519' });
    this._chargerAdminKeypair = this._chargerAdminKeyring.createFromUri('//Charlie');
    console.log(`Use charger admin address: ${this._chargerAdminKeypair.address}`);
  }

  get address() {
    return this._address;
  }

  get keypair() {
    return this._keypair;
  }

  get fundingKeypair() {
    return this._fundingKeypair;
  }

  get chargerAdminKeypair() {
    return this._chargerAdminKeypair;
  }

  getMnemonicFromLocalStorage() {
    return window.localStorage.getItem('mnemonic');
  }

  storeMnemonic(value) {
    window.localStorage.setItem('mnemonic', value);
  }

  async generateNewChargerKey() {
    const mnemonic = mnemonicGenerate();
    const keyring = new Keyring({ type: 'sr25519' });
    const chargerKeypair = keyring.addFromMnemonic(mnemonic);
    return {
      mnemonic,
      chargerKeypair,
      address: chargerKeypair.address,
    };
  }
}

export default new KeyringService();
