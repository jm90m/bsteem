import _ from 'lodash';
import { CRYPTO_MAP } from 'constants/cryptos';

export function getCryptoDetails(cryptoQuery) {
  const getCryptoBySymbol = _.get(CRYPTO_MAP, _.toUpper(cryptoQuery), {});

  if (!_.isEmpty(getCryptoBySymbol)) {
    return getCryptoBySymbol;
  }

  const cryptoDetails = _.find(CRYPTO_MAP, crypto => {
    const formattedCryptoName = _.toLower(crypto.name).replace(/\s/g, ''); // lowercase & remove spaces
    const formattedCryptoSymbol = _.toLower(crypto.symbol);
    const matchesCryptoId = crypto.id === cryptoQuery;
    const matchesCryptoName = formattedCryptoName === cryptoQuery;
    const matchesCryptoSymbol = formattedCryptoSymbol === cryptoQuery;
    return matchesCryptoId || matchesCryptoName || matchesCryptoSymbol;
  });

  return cryptoDetails || {};
}

export const getCurrentDaysOfTheWeek = currentLocale => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  const daysOfTheWeek = [];
  try {
    for (let i = 0; i < 7; i += 1) {
      date.setDate(date.getDate() + 1);
      const dateLocale = date.toLocaleString(currentLocale, { weekday: 'short' });
      daysOfTheWeek.push(dateLocale);
    }
  } catch (error) {
    const defaultLocale = 'en';
    const defaultDaysOfTheWeek = [];
    for (let i = 0; i < 7; i += 1) {
      date.setDate(date.getDate() + 1);
      const dateLocale = date.toLocaleString(defaultLocale, { weekday: 'short' });
      defaultDaysOfTheWeek.push(dateLocale);
    }
    return defaultDaysOfTheWeek;
  }

  return daysOfTheWeek;
};

function getPriceDifferencePercentage(currentCryptoPrice, previousCryptoPrice) {
  const priceDifference = currentCryptoPrice - previousCryptoPrice;
  const priceIncrease = priceDifference / currentCryptoPrice;
  return Math.abs(priceIncrease) * 100;
}

export function getCryptoPriceIncreaseDetails(usdCryptoPriceHistory, btcCryptoPriceHistory) {
  const currentUSDPrice = _.last(usdCryptoPriceHistory);
  const previousUSDPrice = _.nth(usdCryptoPriceHistory, -2);
  const cryptoUSDIncrease = currentUSDPrice > previousUSDPrice;
  const usdPriceDifferencePercent = getPriceDifferencePercentage(currentUSDPrice, previousUSDPrice);

  const currentBTCPrice = _.last(btcCryptoPriceHistory);
  const previousBTCPrice = _.nth(btcCryptoPriceHistory, -2);
  const cryptoBTCIncrease = currentBTCPrice > previousBTCPrice;
  const btcPriceDifferencePercent = getPriceDifferencePercentage(currentBTCPrice, previousBTCPrice);

  return {
    currentUSDPrice,
    previousUSDPrice,
    currentBTCPrice,
    cryptoUSDIncrease,
    cryptoBTCIncrease,
    usdPriceDifferencePercent,
    btcPriceDifferencePercent,
  };
}
