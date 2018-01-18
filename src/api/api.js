import _ from 'lodash';
import * as feedFilters from 'constants/feedFilters';

async function sendRequest(url, requestParams) {
  let response = await fetch(url, requestParams);
  let result;

  try {
    result = await response.json();
  } catch (e) {
    result = { error: e };
  }
  return result;
}

async function sendPostRequest(url, requestParams) {
  const response = await fetch(url, {
    body: JSON.stringify(requestParams),
    method: 'post',
    mode: 'cors',
  });
  let result;
  try {
    result = await response.json();
  } catch (e) {
    result = { error: e };
  }

  return result;
}

class API {
  static DEFAULT_ACCOUNT_LIMIT = 1000;

  static BASE_URL = 'https://api.steemit.com';

  static createRequestQuery(method, query) {
    return {
      method: method,
      params: query,
      jsonrpc: '2.0',
    };
  }

  static async getTrending(query) {
    const requestQuery = API.createRequestQuery('get_discussions_by_trending', [query]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getActive(query) {
    const requestQuery = API.createRequestQuery('get_discussions_by_active', [query]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getPromoted(query) {
    const requestQuery = API.createRequestQuery('get_discussions_by_promoted', [query]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getHot(query) {
    const requestQuery = API.createRequestQuery('get_discussions_by_hot', [query]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getCreated(query) {
    const requestQuery = API.createRequestQuery('get_discussions_by_created', [query]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getTags() {
    const requestQuery = API.createRequestQuery('get_trending_tags', [null, 50]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getComments(postUrl) {
    const requestQuery = API.createRequestQuery('get_state', [postUrl]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getAccount(username) {
    const requestQuery = API.createRequestQuery('get_accounts', [[username]]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getDiscussionsByBlog(query) {
    const requestQuery = API.createRequestQuery('get_discussions_by_blog', [query]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getDiscussionsByComments(query) {
    const requestQuery = API.createRequestQuery('get_discussions_by_comments', [query]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getFollowCount(username) {
    const requestQuery = API.createRequestQuery('call', [
      'follow_api',
      'get_follow_count',
      [username],
    ]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getAskSteemSearch(search, page) {
    return sendRequest(`https://api.asksteem.com/search?q=${search}&types=post&pg=${page}`);
  }

  static async getContent(author, permlink) {
    const requestQuery = API.createRequestQuery('get_discussions_by_comments', [author, permlink]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getAccountReputation(name, limit = 20) {
    const requestQuery = API.createRequestQuery('get_account_reputations', [name, limit]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getDiscussionsByFeed(query) {
    const requestQuery = API.createRequestQuery('get_discussions_by_feed', [query]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getFollowers(following, startFollower, followType, limit) {
    const requestQuery = API.createRequestQuery('call', [
      'follow_api',
      'get_followers',
      [following, startFollower, followType, limit],
    ]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getFollowing(follower, startFollowing, followType, limit) {
    const requestQuery = API.createRequestQuery('call', [
      'follow_api',
      'get_following',
      [follower, startFollowing, followType, limit],
    ]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getAllFollowing(username) {
    return new Promise(async resolve => {
      try {
        const following = await API.getFollowCount(username);
        const chunkSize = 100;
        const limitArray = _.fill(
          Array(Math.ceil(following.following_count / chunkSize)),
          chunkSize,
        );
        const list = limitArray.reduce(async (currentListP, value) => {
          const currentList = await currentListP;
          const startFrom = currentList[currentList.length - 1] || '';
          const followers = await API.getFollowing(username, startFrom.following, 'blog', value);
          return currentList.slice(0, currentList.length - 1).concat(followers);
        }, []);
        resolve(list);
      } catch (error) {
        console.warn(error);
      }
    });
  }

  static async getAllFollowers(username) {
    return new Promise(async resolve => {
      try {
        const following = await API.getFollowCount(username);
        const chunkSize = 100;
        const limitArray = _.fill(
          Array(Math.ceil(following.follower_count / chunkSize)),
          chunkSize,
        );
        const list = limitArray.reduce(async (currentListP, value) => {
          const currentList = await currentListP;
          const startFrom = currentList[currentList.length - 1] || '';
          const followers = await API.getFollowers(username, startFrom.follower, 'blog', value);
          return currentList.slice(0, currentList.length - 1).concat(followers);
        }, []);
        resolve(list);
      } catch (error) {
        console.warn(error);
      }
    });
  }

  static async getAccountHistory(account, from = -1, limit = API.DEFAULT_ACCOUNT_LIMIT) {
    const requestQuery = API.createRequestQuery('get_account_history', [account, from, limit]);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getDynamicGlobalProperties() {
    const requestQuery = API.createRequestQuery('get_dynamic_global_properties', []);
    return sendPostRequest(API.BASE_URL, requestQuery);
  }

  static async getSteemRate() {
    return sendRequest('https://api.coinmarketcap.com/v1/ticker/steem/');
  }
}

export const getAPIByFilter = filterId => {
  switch (filterId) {
    case feedFilters.PROMOTED.id:
      return API.getPromoted;
    case feedFilters.HOT.id:
      return API.getHot;
    case feedFilters.ACTIVE.id:
      return API.getActive;
    case feedFilters.NEW.id:
      return API.getCreated;
    case feedFilters.TRENDING.id:
    default:
      return API.getTrending;
  }
};

export default API;
