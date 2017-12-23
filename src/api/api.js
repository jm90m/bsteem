import steem from 'steem';
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

class API {
  static DEFAULT_ACCOUNT_LIMIT = 1000;

  static async getTrending(query) {
    return steem.api.getDiscussionsByTrendingAsync(query);
  }

  static async getActive(query) {
    return steem.api.getDiscussionsByActiveAsync(query);
  }
  static async getPromoted(query) {
    return steem.api.getDiscussionsByPromotedAsync(query);
  }

  static async getHot(query) {
    return steem.api.getDiscussionsByHotAsync(query);
  }

  static async getCreated(query) {
    return steem.api.getDiscussionsByCreatedAsync(query);
  }

  static async getTags() {
    return steem.api.getTrendingTagsAsync(undefined, 50);
  }

  static async getComments(postUrl) {
    return steem.api.getStateAsync(postUrl);
  }

  static async getAccount(username) {
    return steem.api.getAccountsAsync([username]);
  }

  static async getDiscussionsByBlog(query) {
    return steem.api.getDiscussionsByBlogAsync(query);
  }

  static async getDiscussionsByComments(query) {
    return steem.api.getDiscussionsByCommentsAsync(query);
  }

  static async getFollowCount(username) {
    return steem.api.getFollowCountAsync(username);
  }

  static async getAskSteemSearch(search, page) {
    return sendRequest(`https://api.asksteem.com/search?q=${search}&types=post&pg=${page}`);
  }

  static async getContent(author, permlink) {
    return steem.api.getContentAsync(author, permlink);
  }

  static async getLookupAccountNames(name, limit = 5) {
    return steem.api.lookupAccountsAsync(name, limit);
  }

  static async getDiscussionsByFeed(query) {
    return steem.api.getDiscussionsByFeedAsync(query);
  }

  static async getFollowers(following, startFollower, followType, limit) {
    return steem.api.getFollowersAsync(following, startFollower, followType, limit);
  }

  static async getFollowing(follower, startFollowing, followType, limit) {
    return steem.api.getFollowingAsync(follower, startFollowing, followType, limit);
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
    return steem.api.getAccountHistoryAsync(account, from, limit);
  }

  static async getDynamicGlobalProperties() {
    return steem.api.getDynamicGlobalPropertiesAsync();
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
