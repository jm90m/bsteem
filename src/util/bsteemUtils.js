import _ from 'lodash';

export const bsteemShareText =
  'View this post on bSteem App today, checkout https://bsteem.com for more details! bSteem is available for both iOS and Android.';

export const getBusyUrl = (author, permlink) => `https://busy.org/@${author}/${permlink}`;

export const jsonParse = jsonStr => {
  try {
    const jsonParsed = _.attempt(JSON.parse, jsonStr);
    return _.isError(jsonParsed) ? {} : jsonParsed;
  } catch (error) {
    return {};
  }
};
