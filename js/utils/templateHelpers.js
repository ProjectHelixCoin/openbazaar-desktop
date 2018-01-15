import $ from 'jquery';
import app from '../app';
import {
  formatCurrency,
  convertAndFormatCurrency,
  convertCurrency,
  formatPrice,
  getCurrencyValidity,
  renderFormattedCurrency,
  renderPairedCurrency,
} from './currency';
import {
  getServerCurrency,
  renderCryptoIcon,
  getBlockChainTxUrl,
  getBlockChainAddressUrl,
  getCurrencyByCode as getCryptoCurByCode,
} from '../data/cryptoCurrencies';
import {
  isHiRez, isLargeWidth, isSmallHeight, getAvatarBgImage, getListingBgImage,
} from './responsive';
import { upToFixed } from './number';
import twemoji from 'twemoji';
import { splitIntoRows } from './';
import { tagsDelimiter } from '../utils/lib/selectize';
import is from 'is_js';

export function polyT(...args) {
  return app.polyglot.t(...args);
}

export function parseEmojis(text, className = '', attrs = {}) {
  const parsed = twemoji.parse(text,
    icon => (`../imgs/emojis/72X72/${icon}.png`));
  const $parsed = $(`<div>${parsed}</div>`);

  $parsed.find('img')
    .each((index, img) => {
      const $img = $(img);
      $img.addClass(`emoji ${className}`);

      Object.keys(attrs)
        .forEach(attr => {
          $img.attr(attr, attrs[attr]);
        });
    });

  return $parsed.html();
}

/**
 * If the average is a number, show the last 2 digits and trim any trailing zeroes.
 * @param {number} average - the average rating
 * @param {number} count - the number of ratings
 */
export function formatRating(average, count) {
  const avIsNum = typeof average === 'number';
  const countIsNum = typeof count === 'number';
  const ratingAverage = avIsNum ? average.toFixed(1) : '?';
  const ratingCount = countIsNum ? ` (${count})` : ' (?)';
  const error = !avIsNum || !countIsNum ? ` ${app.polyglot.t('ratings.invalid')}` : '';
  return `${parseEmojis('⭐')} ${ratingAverage}${ratingCount}${error}`;
}

export const getServerUrl = app.getServerUrl.bind(app);

const currencyExport = {
  formatPrice,
  formatCurrency,
  convertAndFormatCurrency,
  convertCurrency,
  getCurrencyValidity,
  getServerCurrency,
  getCryptoCurByCode,
  formattedCurrency: renderFormattedCurrency,
  pairedCurrency: renderPairedCurrency,
  cryptoIcon: renderCryptoIcon,
  getBlockChainTxUrl,
  getBlockChainAddressUrl,
};

export {
  currencyExport as currencyMod,
  isHiRez,
  isLargeWidth,
  isSmallHeight,
  getAvatarBgImage,
  getListingBgImage,
  upToFixed,
  splitIntoRows,
  is,
  tagsDelimiter,
};
