// eslint-disable-next-line import/extensions
import {Buffer} from 'buffer';
import Geth from 'react-native-geth';
import {removeFromAsyncStorage, setToAsyncStorage} from '../actions/utils';

const geth = new Geth({networkID: 5, testNet: 'goerli'});

global.Buffer = Buffer;

// const Buffer = require('buffer').Buffer;
// const EthereumTx = require('ethereumjs-tx').Transaction;
// const formatters = require('web3-core-helpers').formatters;
const keythereum = require('keythereum');

// sign an unsigned raw transaction and deploy
export async function signTransaction(password, tx) {
  try {
    console.log('sign scanned transaction');
    console.log(tx);
    const stx = await geth.signTransaction(password, tx);
    return {
      transaction: JSON.parse(stx),
    };
  } catch (e) {
    console.log(e);
    return {
      Error: e,
    };
  }
}

// extract privateKey against address
function extractPvtKey(keyObject, pswd) {
  return keythereum.recover(pswd, keyObject).toString('hex');
}

// create keypair and saves to AsyncStorage for now
export async function createKeyPair(password) {
  try {
    const keyObject = await geth.newAccount(password);
    console.log(keyObject);
    await setToAsyncStorage('keystore', JSON.stringify(keyObject));
    return keyObject;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// delete privateKey against address
export function deleteKeyPair(publicKey) {
  return removeFromAsyncStorage(publicKey);
}

export function getPvtKey(keystore, password) {
  try {
    const key = extractPvtKey(keystore, password);
    return key;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function listAccounts() {
  try {
    return await geth.listAccounts();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function setKs(ksIndex) {
  try {
    return await geth.setAccount(ksIndex);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
