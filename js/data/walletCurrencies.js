import _ from 'underscore';
import app from '../app';
import bitcoreLib from 'bitcore-lib';
import bech32 from 'bech32';

// If a currency does not support fee bumping or you want to disable it, do not provide a
// feeBumpTransactionSize setting.

const currencies = [
  {
    code: 'PHR',
    testnetCode: 'TPHR',
    baseUnit: 100000000,
    averageModeratedTransactionSize: 184,
    // Not allowing fee bump on BTC right now given the fees.
    // feeBumpTransactionSize: 154,
    qrCodeText: address => `phore:${address}`,
    icon: 'imgs/cryptoIcons/PHR.png',
    url: 'https://phore.io/',
    getBlockChainAddressUrl: (address, _) => ( // eslint-disable-line
        `https://chainz.cryptoid.info/phr/address.dws?${address}.htm`
    ),
    getBlockChainTxUrl: (txid, _) => ( // eslint-disable-line
        `https://chainz.cryptoid.info/phr/tx.dws?${txid}.htm`
    ),
    isValidAddress: address => {
      if (typeof address !== 'string') {
        throw new Error('Please provide a string.');
      }

      try {
        bitcoreLib.encoding.Base58Check.decode(address);
        return true;
      } catch (exc) {
        try {
          bech32.decode(address);
          return true;
        } catch (exc2) {
          return false;
        }
      }
    },
    supportsEscrowTimeout: false,
    blockTime: 1000 * 60,
  },
  {
    code: 'BTC',
    testnetCode: 'TBTC',
    symbol: '₿',
    baseUnit: 100000000,
    averageModeratedTransactionSize: 184,
    // Not allowing fee bump on BTC right now given the fees.
    // feeBumpTransactionSize: 154,
    qrCodeText: address => `bitcoin:${address}`,
    icon: 'imgs/cryptoIcons/BTC.png',
    url: 'https://bitcoin.org/',
    getBlockChainAddressUrl: (address, isTestnet) => (
      isTestnet ?
        `https://chain.so/address/BTCTEST/${address}` :
        `https://blockchair.com/bitcoin/address/${address}`
    ),
    getBlockChainTxUrl: (txid, isTestnet) => (
      isTestnet ?
        `https://chain.so/tx/BTCTEST/${txid}` :
        `https://blockchair.com/bitcoin/transaction/${txid}`
    ),
    isValidAddress: address => {
      if (typeof address !== 'string') {
        throw new Error('Please provide a string.');
      }

      try {
        bitcoreLib.encoding.Base58Check.decode(address);
        return true;
      } catch (exc) {
        try {
          bech32.decode(address);
          return true;
        } catch (exc2) {
          return false;
        }
      }
    },
    supportsEscrowTimeout: true,
    blockTime: 1000 * 60 * 10,
  },
  {
    code: 'BCH',
    testnetCode: 'TBCH',
    baseUnit: 100000000,
    averageModeratedTransactionSize: 184,
    feeBumpTransactionSize: 154,
    qrCodeText: address => {
      let prefixedAddress = address;

      const prefix = app.serverConfig.testnet ? 'bchtest' : 'bitcoincash';
      prefixedAddress = address.startsWith(prefix) ?
        prefixedAddress : `${prefix}:${address}`;

      return prefixedAddress;
    },
    icon: 'imgs/cryptoIcons/BCH.png',
    url: 'https://bitcoincash.org/',
    getBlockChainAddressUrl: (address, isTestnet) => (
      isTestnet ?
        `https://explorer.bitcoin.com/tbch/address/bchtest:${address}` :
        `https://blockchair.com/bitcoin-cash/address/${address}`
    ),
    getBlockChainTxUrl: (txid, isTestnet) => (
      isTestnet ?
        `https://explorer.bitcoin.com/tbch/tx/${txid}` :
        `https://blockchair.com/bitcoin-cash/transaction/${txid}`
    ),
    supportsEscrowTimeout: true,
    blockTime: 1000 * 60 * 10,
  },
  {
    code: 'LTC',
    testnetCode: 'TLTC',
    baseUnit: 100000000,
    averageModeratedTransactionSize: 184,
    feeBumpTransactionSize: 154,
    qrCodeText: address => `litecoin:${address}`,
    icon: 'imgs/cryptoIcons/LTC.png',
    url: 'https://litecoin.org/',
    getBlockChainAddressUrl: (address, isTestnet) => (
      isTestnet ?
        `https://chain.so/address/LTCTEST/${address}` :
        `https://blockchair.com/litecoin/address/${address}`
    ),
    getBlockChainTxUrl: (txid, isTestnet) => (
      isTestnet ?
        `https://chain.so/tx/LTCTEST/${txid}` :
        `https://blockchair.com/litecoin/transaction/${txid}`
    ),
    supportsEscrowTimeout: true,
    blockTime: 1000 * 60 * 2.5,
  },
  {
    code: 'ZEC',
    testnetCode: 'TZEC',
    baseUnit: 100000000,
    averageModeratedTransactionSize: 184,
    feeBumpTransactionSize: 154,
    qrCodeText: address => `zcash:${address}`,
    icon: 'imgs/cryptoIcons/ZEC.png',
    url: 'https://z.cash',
    getBlockChainAddressUrl: (address, isTestnet) => (
      isTestnet ?
        `https://explorer.testnet.z.cash/address/${address}` :
        `https://explorer.zcha.in/accounts/${address}`
    ),
    getBlockChainTxUrl: (txid, isTestnet) => (
      isTestnet ?
        `https://explorer.testnet.z.cash/tx/${txid}` :
        `https://explorer.zcha.in/transactions/${txid}`
    ),
    supportsEscrowTimeout: false,
    blockTime: 1000 * 60 * 2.5,
  },
  {
    code: 'RDD',
    testnetCode: 'TRDD',
    baseUnit: 100000000,
    averageModeratedTransactionSize: 184,
    qrCodeText: address => `reddcoin:${address}`,
    icon: 'imgs/cryptoIcons/RDD-icon.png',
    url: 'https://reddcoin.com',
    getBlockChainAddressUrl: (address, isTestnet) => (
      isTestnet ? `https://test.reddcoin.com/address/${address}` :
        `https://live.reddcoin.com/address/${address}`
    ),
    getBlockChainTxUrl: (txid, isTestnet) => (
      isTestnet ? `https://test.reddcoin.com/tx/${txid}` :
        `https://live.reddcoin.com/tx/${txid}`
    ),
    supportsEscrowTimeout: false,
    blockTime: 1000 * 60,
    externallyFundableOrders: false,
  },
];

export default currencies;

function getTranslatedCurrencies(
  lang = app && app.localSettings &&
  app.localSettings.standardizedTranslatedLang() || 'en-US',
  sort = true
) {
  if (!lang) {
    throw new Error('Please provide the language the translated currencies' +
      ' should be returned in.');
  }

  let translated = currencies.map((currency) => ({
    ...currency,
    name: app.polyglot.t(`cryptoCurrencies.${currency.code}`),
  }));

  if (sort) {
    translated = translated.sort((a, b) => a.name.localeCompare(b.name, lang));
  }

  return translated;
}

const memoizedGetTranslatedCurrencies =
  _.memoize(getTranslatedCurrencies, (lang, sort) => `${lang}-${!!sort}`);

export { memoizedGetTranslatedCurrencies as getTranslatedCurrencies };

let _indexedCurrencies;

function getIndexedCurrencies() {
  if (_indexedCurrencies) return _indexedCurrencies;

  _indexedCurrencies = currencies
    .reduce((indexedObj, currency) => {
      indexedObj[currency.code] = indexedObj[currency.testnetCode] = { ...currency };
      return indexedObj;
    }, {});

  return _indexedCurrencies;
}

export function getCurrencyByCode(code) {
  if (typeof code !== 'string') {
    throw new Error('Please provide a currency code as a string.');
  }

  return getIndexedCurrencies()[code];
}

let currenciesSortedByCode;

export function getCurrenciesSortedByCode() {
  if (currenciesSortedByCode) {
    return currenciesSortedByCode;
  }

  currenciesSortedByCode = currencies.sort((a, b) => {
    if (a.code < b.code) return -1;
    if (a.code > b.code) return 1;
    return 0;
  });

  return currenciesSortedByCode;
}

/**
 * Since many of our crypto related mapping (e.g. icons) are done based off of
 * a mainnet code, this function will attempt to obtain the mainnet code if a testnet
 * one is passed in. This only works for crypto coins that we have registered as
 * accepted currencies (i.e. are enumerated in data/cryptoCurrencies), but those are
 * the only ones that should ever come as testnet codes.
 */
export function ensureMainnetCode(cur) {
  if (typeof cur !== 'string' || !cur.length) {
    throw new Error('Please provide a non-empty string.');
  }

  const curObj = getCurrencyByCode(cur);
  return curObj ? curObj.code : cur;
}

/**
 * Returns a list of the crypto currencies supported by the wallet.
 *
 * @param {object} [options={}] - Function options
 * @param {boolean} [options.clientSupported=true] - If true, it will only include
 *   currencies that are supported by both the client and the server. For the client to
 *   support the currency, it must have an entry in the walletCurrencies data file. Without
 *   that information, the client can't really support the currency since fundamental information
 *   (e.g baseUnits) aren't available. In most context, we will not want to show a currency if it
 *   is not client supported.
 * @param {Array} [options.serverCurs=app.serverConfig.wallets] - The list of currencies that
 *   are supported by the server's wallet. By default, this is obtained from the server config
 *   API. In almost all cases, the default should be used. It's mainly exposed as an option
 *   for unit testing.
 * @return {Array} An Array containing the currency codes that are supported by the wallet.
 */
export function supportedWalletCurs(options = {}) {
  const opts = {
    clientSupported: true,
    serverCurs: app && app.serverConfig && app.serverConfig.wallets || [],
    ...options,
  };

  if (!Array.isArray(opts.serverCurs)) {
    throw new Error('options.serverCurs must be provided as an Array.');
  }

  return opts.serverCurs
    .filter(cur =>
      (
        opts.clientSupported ?
          !!getIndexedCurrencies()[cur] :
          true
      )
    );
}

/**
 * Returns a boolean indicating whether the given code is supported by the wallet.
 *
 * @param {string} cur - A currency code.
 * @param {object} [options={}] - Function options - these are sent to supportedWalletCurs.
 * @return {boolean} A boolean indicating whether the given code is supported by the wallet.
 */
export function isSupportedWalletCur(cur, options = {}) {
  if (typeof cur !== 'string') {
    throw new Error('Please provide a cur as a string.');
  }

  return supportedWalletCurs(options).includes(cur);
}

/**
 * Given a list of currencies, a filtered list will be returned containing only the
 * currencies in the list that are supported by the wallet
 *
 * @param {Array} curs - A list of currencies to filter.
 * @param {object} [options={}] - Function options - these are sent to isSupportedWalletCur.
 * @return {Array} A list based off the intersection of the giveen curs and the supported
 *   wallt curs.
 */
export function onlySupportedWalletCurs(curs = [], options = {}) {
  if (!Array.isArray(curs)) {
    throw new Error('Curs must be provided as an Array.');
  }

  if (curs.filter(cur => (typeof cur !== 'string')).length) {
    throw new Error('Curs items must be provided as strings.');
  }

  return curs.filter(cur => isSupportedWalletCur(cur, options));
}

/**
 * A proxy for onlySupportedWalletCurs with the difference being that this will
 * return a boolean indicating if any of the provided curs are supported as wallet
 * currencies. (same arguments as onlySupportedWalletCurs).
 * @return {boolean} A boolean indicating if any of the provided curs are supported
 *   as wallet currencies.
 */
export function anySupportedByWallet(...args) {
  return !!(onlySupportedWalletCurs(...args).length);
}
