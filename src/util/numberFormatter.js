const NUMBERS = {
  ONE_BILLION: {
    value: 1000000000,
    abbrev: 'B',
  },
  ONE_MILLION: {
    value: 1000000,
    abbrev: 'M',
  },
  ONE_THOUSAND: {
    value: 1000,
    abbrev: 'K',
  },
};

export const abbreviateLargeNumber = n => {
  const number = parseInt(n, 10);
  if (number >= NUMBERS.ONE_BILLION.value) {
    return `${Math.floor(number / NUMBERS.ONE_BILLION.value)}${NUMBERS.ONE_BILLION.abbrev}`;
  } else if (number >= NUMBERS.ONE_MILLION.value) {
    return `${Math.floor(number / NUMBERS.ONE_MILLION.value)}${NUMBERS.ONE_MILLION.abbrev}`;
  } else if (number >= NUMBERS.ONE_THOUSAND.value) {
    return `${Math.floor(number / NUMBERS.ONE_THOUSAND.value)}${NUMBERS.ONE_THOUSAND.abbrev}`;
  } else {
    return `${number}`;
  }
};

export default null;
