/* eslint-disable */

import {
  ApiPromise,
  WsProvider,
} from '@polkadot/api';

import KeyringService from './Keyring';

class Delmonicos {

  api = null;

  async connect() {
    await KeyringService.init();
    const wsProvider = new WsProvider('ws://charger-node.cleverapps.io');
    this.api = await ApiPromise.create({
      provider: wsProvider,
      /*types: {
        Attribute: {
          name: 'Vec<u8>',
          value: 'Vec<u8>',
          validity: 'BlockNumber',
          creation: 'Moment',
          nonce: 'u64',
        },
        PaymentConsent: {
          timestamp: 'Moment',
          iban: 'Vec<u8>',
          bic_code: 'Vec<u8>',
          signature: 'Vec<u8>',
        },
        ChargingSession: {
          user_id: 'AccountId',
          started_at: 'Moment',
          session_id: 'Hash',
        },
        ChargeRequest: {
          user_id: 'AccountId',
          created_at: 'Moment',
          session_id: 'Hash',
        },
      },*/
    });
  }

  async getApi() {
    if (this.api !== null) return this.api;
    await this.connect();
    return this.api;
  }

  async getChainName() {
    const api = await this.getApi();
    return api.rpc.system.name();
  }

  async changeTariff(newTariff) {
    await this.fundAccountIfRequired(KeyringService.address);
    const api = await this.getApi();
    const tx = await api.tx.tariffManager.setCurrentPrice(newTariff);
    return this.signSendAndWait(tx, KeyringService.keypair);
  }

  async getCurrentTariff() {
    const api = await this.getApi();
    const tariff = await api.query.tariffManager.currentPrice();
    return tariff.toNumber();
  }

  async addChargerLocation(latitude, longitude, chargerKeypair) {
    await this.fundAccountIfRequired(chargerKeypair.address);
    const attribute = JSON.stringify([latitude, longitude]);
    const api = await this.getApi();
    const tx = await api.tx.did.addAttribute(
      chargerKeypair.address,
      'location',
      attribute,
      null,
    );
    return this.signSendAndWait(tx, chargerKeypair);
  }

  async addNewCharger(chargerAddress) {
    const api = await this.getApi();
    const tx = await api.tx.chargeSession.addNewCharger(
      chargerAddress,
    );
    return this.signSendAndWait(tx, KeyringService.chargerAdminKeypair);
  }

  async fundAccountIfRequired(address) {
    const api = await this.getApi();
    const res = await api.query.system.account(address);
    if(res.data.free.toNumber() >= 500000000000) return;
    const tx = await api.tx.balances.transfer(address, 1000000000000);
    return this.signSendAndWait(tx, KeyringService.fundingKeypair)
  }

  signSendAndWait(tx, keypair) {
    return new Promise((resolve, reject) => {
      tx
        .signAndSend(keypair, (status) => {
          if(status.isInBlock) return resolve();
        })
        .catch(reject);
    });
  }
}

export default new Delmonicos();
