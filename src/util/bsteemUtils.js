import _ from 'lodash';

export const bsteemShareText =
  'View this post on bSteem App today, checkout http://bsteem.com for more details! bSteem is available for both iOS and Android.';

export const getBusyUrl = (author, permlink) => `https://busy.org/@${author}/${permlink}`;

export const getSteemitURL = (author, permlink) => `https://steemit.com/@${author}/${permlink}`;

export const jsonParse = jsonStr => {
  try {
    const jsonParsed = _.attempt(JSON.parse, jsonStr);
    return _.isError(jsonParsed) ? {} : jsonParsed;
  } catch (error) {
    return {};
  }
};

export const jsonStringify = obj => {
  try {
    const jsonStringified = _.attempt(JSON.stringify, obj);
    return _.isError(jsonStringified) ? '' : jsonStringified;
  } catch (error) {
    return '';
  }
};

export const epochToUTC = epochTimestamp => new Date(0).setUTCSeconds(epochTimestamp);

export const getUserDetailsKey = username => `user-${username}`;

export const getUserDetailsHelper = (usersDetails, username, defaultReturn) => {
  const userDetails = _.get(usersDetails, username, defaultReturn);

  if (_.isFunction(userDetails)) {
    return defaultReturn;
  }

  return userDetails;
};
