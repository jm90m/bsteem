import steem from 'steem';
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

  static async getAskSteemSearch(search) {
    return sendRequest(`https://api.asksteem.com/search?q=${search}&types=user,post`);
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
