// @flow

import bip39 from 'bip39';
import { Blake2b, Wallet } from 'rust-cardano-crypto';
import {
  encryptWithPassword,
  decryptWithPassword
} from '../../../../utils/passwordCipher';
import { getOrFail } from './cryptoUtils';

import type { ConfigType } from '../../../../../config/config-types';

export type WalletSeed = {
  encryptedSeed: string,
};

declare var CONFIG: ConfigType;

const protocolMagic = CONFIG.network.protocolMagic;

export const generateAdaMnemonic = () => bip39.generateMnemonic(128).split(' ');

export const isValidAdaMnemonic = (
  phrase: string,
  numberOfWords: number = 12
) =>
  phrase.split(' ').length === numberOfWords && bip39.validateMnemonic(phrase);

export function generateWalletSeed(secretWords: string, password: string): WalletSeed {
  const entropy = bip39.mnemonicToEntropy(secretWords);
  const seed: Uint8Array = Blake2b.blake2b_256(entropy);
  return {
    encryptedSeed: encryptWithPassword(password, seed)
  };
}

export function getCryptoWalletFromSeed(
  walletSeed: WalletSeed,
  password: string
): CryptoWallet {
  const seed = decryptWithPassword(password, walletSeed.encryptedSeed);
  const seedAsArray = Object.values(seed);
  const wallet = getOrFail(Wallet.fromSeed(seedAsArray));
  wallet.config.protocol_magic = protocolMagic;
  return wallet;
}

/* FIXME: Should be pass a encrypted mnemonic and also the password to decrypt it*/
export function getCryptoDaedalusWalletFromMnemonics(
  secretWords: string,
): CryptoDaedalusWallet {
  const wallet = getOrFail(Wallet.fromDaedalusMnemonic(secretWords));
  wallet.config.protocol_magic = protocolMagic;
  return wallet;
}
