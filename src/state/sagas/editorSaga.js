import sc2 from 'api/sc2';
import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import _ from 'lodash';
import { createPermlink, createCommentPermlink } from 'util/steemitUtils';
import ERRORS from 'constants/errors';
import { imgurConfig } from 'constants/config';
import { CREATE_COMMENT, CREATE_POST, UPLOAD_IMAGE } from '../actions/actionTypes';
import { getAuthUsername, getUsersDetails } from '../rootReducer';
import * as editorActions from '../actions/editorActions';
import * as appActions from '../actions/appActions';
import { getBodyPatchIfSmaller } from '../../util/steemitUtils';
import API from '../../api/api';
import { refreshUserBlog } from '../actions/usersActions';

export const rewardsValues = {
  all: '100',
  half: '50',
  none: '0',
};

const broadcastPost = (
  parentAuthor,
  parentPermlink,
  author,
  title,
  body,
  jsonMetadata,
  reward,
  upvote,
  permlink,
) => {
  const operations = [];
  const commentOp = [
    'comment',
    {
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      author,
      permlink,
      title,
      body,
      json_metadata: JSON.stringify(jsonMetadata),
    },
  ];
  operations.push(commentOp);

  const commentOptionsConfig = {
    author,
    permlink,
    allow_votes: true,
    allow_curation_rewards: true,
    max_accepted_payout: '1000000.000 SBD',
    percent_steem_dollars: 10000,
  };

  if (reward === rewardsValues.none) {
    commentOptionsConfig.max_accepted_payout = '0.000 SBD';
  } else if (reward === rewardsValues.all) {
    commentOptionsConfig.percent_steem_dollars = 0;
  }

  if (reward === rewardsValues.none || reward === rewardsValues.all) {
    operations.push(['comment_options', commentOptionsConfig]);
  }

  if (upvote) {
    operations.push([
      'vote',
      {
        voter: author,
        author,
        permlink,
        weight: 10000,
      },
    ]);
  }

  return sc2.broadcast(operations);
};

function broadcastComment(
  parentAuthor,
  parentPermlink,
  author,
  permlink,
  title,
  body,
  jsonMetadata,
  isUpdating,
) {
  const operations = [];

  operations.push([
    'comment',
    {
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      author,
      permlink,
      title,
      body,
      json_metadata: JSON.stringify(jsonMetadata),
    },
  ]);

  if (!isUpdating) {
    operations.push([
      'comment_options',
      {
        author,
        permlink,
        allow_votes: true,
        allow_curation_rewards: true,
        max_accepted_payout: '1000000.000 SBD',
        percent_steem_dollars: 10000,
      },
    ]);
  }

  return sc2.broadcast(operations);
}

const createPost = function*(action) {
  try {
    const { postData, callback } = action.payload;
    const {
      parentAuthor,
      parentPermlink,
      author,
      title,
      body,
      jsonMetadata,
      reward,
      upvote,
      draftId,
      isUpdating,
    } = postData;
    let { permlink } = postData;
    const noUpvote = false;

    if (!isUpdating) {
      const generatedPermlink = yield call(
        createPermlink,
        title,
        author,
        parentAuthor,
        parentPermlink,
      );
      permlink = generatedPermlink;
    }

    // use getBodyPatchIfSmall func in steemitUtils
    const newBody = isUpdating ? getBodyPatchIfSmaller(postData.originalBody, body) : body;
    console.log('POST CREATION START', newBody, author, permlink);
    const result = yield call(
      broadcastPost,
      parentAuthor,
      parentPermlink,
      author,
      title,
      newBody,
      jsonMetadata,
      !isUpdating && reward,
      noUpvote,
      permlink,
    );
    const payload = result.result;
    console.log('POST CREATION RESULTS', result);

    if (callback) callback(author, permlink);

    yield put(editorActions.createPost.success(payload));
    yield put(refreshUserBlog.action({ username: author }));
  } catch (error) {
    console.log(error);
    const postCreationError = ERRORS.POST_INTERVAL;
    yield put(appActions.displayNotifyModal(postCreationError.title, postCreationError.message));
    yield put(editorActions.createPost.fail(error));
  }
};

const createComment = function*(action) {
  try {
    const {
      parentPost,
      isUpdating,
      originalComment,
      successCallback,
      commentBody,
    } = action.payload;
    const { category, id, permlink: parentPermlink, author: parentAuthor } = parentPost;
    const usersDetails = yield select(getUsersDetails);
    const author = yield select(getAuthUsername);
    const authorDetails = _.get(usersDetails, author, {});

    const permlink = isUpdating
      ? originalComment.permlink
      : createCommentPermlink(parentAuthor, parentPermlink);
    const jsonMetadata = { tags: [category], community: 'bsteem', app: 'bsteem' };
    const title = '';
    const newBody = isUpdating
      ? getBodyPatchIfSmaller(originalComment.body, commentBody)
      : commentBody;
    const result = yield call(
      broadcastComment,
      parentAuthor,
      parentPermlink,
      author,
      permlink,
      title,
      newBody,
      jsonMetadata,
      isUpdating,
    );
    const payload = result.result;
    const operations = _.get(payload, 'operations', []);
    const commentData = _.get(operations, 0, {});
    const commentDetails = _.get(commentData, 1, {});
    const created = _.replace(new Date().toISOString(), 'Z', '');

    // fetch comments and get current comment details
    const postUrl = `/${category}/@${parentAuthor}/${parentPermlink}`;
    const newComments = yield call(API.getComments, postUrl);
    const commentKey = `${author}/${permlink}`;
    const fetchedCommentData = _.get(newComments, `result.content.${commentKey}`, {
      author_reputation: authorDetails.author_reputation,
      id: `tempID-${permlink}-${created}`,
    });
    const commentDetailsPayload = {
      ...commentDetails,
      ...fetchedCommentData,
    };

    successCallback(commentDetailsPayload);

    console.log('SUCCESS COMMENT REPLY - ORIGINAL COMMENT', originalComment);
    console.log('SUCCESS COMMENT REPLY - NEW COMMENT DATA', commentData);
    console.log('SUCCESS COMMENT REPLY - NEW COMMENT DETAILS', commentDetails);
    console.log('SUCCESS COMMENT REPLY - COMMENT DETAILS PAYLOAD', commentDetailsPayload);

    yield put(editorActions.createComment.success(payload));
  } catch (error) {
    console.log('FAIL COMMENT REPLY', error);
    const { failCallback } = action.payload;
    if (failCallback) failCallback(error);
    yield put(editorActions.createComment.fail(error));
  }
};

async function uploadToBusy(uri, authUsername, callback, errorCallback) {
  let apiUrl = `https://img.busy.org/@${authUsername}/uploads`;
  let uriParts = uri.split('.');
  let fileType = uri[uri.length - 1];

  let formData = new FormData();
  formData.append('photo', {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };

  return fetch(apiUrl, options)
    .then(res => res.json())
    .then(res => callback(res.secure_url, uri.name))
    .catch(err => {
      console.log('err', err);
      errorCallback();
    });
}

async function uploadToImgur(imageData) {
  const { uri } = imageData;
  const auth = `Client-ID ${imgurConfig.clientId}`;
  const apiUrl = 'https://imgur-apiv3.p.mashape.com/3/image';
  const fileType = uri[uri.length - 1];
  const formData = new FormData();
  formData.append('image', {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  const options = {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: auth,
      'X-Mashape-Key': imgurConfig.mashapeKey,
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };

  return fetch(apiUrl, options).then(res => res.json());
}

const uploadImage = function*(action) {
  try {
    const { imageData, callback, errorCallback } = action.payload;
    const authUsername = select(getAuthUsername);
    const result = yield call(uploadToImgur, imageData);

    if (_.get(result, 'success', false)) {
      const imageData = _.get(result, 'data', {});
      const imageURL = _.get(imageData, 'link');
      const imageID = _.get(imageData, 'id');
      callback(imageURL, imageID);
    } else {
      errorCallback();
    }
    console.log('IMGUR RESULT', result);
  } catch (error) {
    console.log(error);
  }
};

export const watchCreatePost = function*() {
  yield takeLatest(CREATE_POST.ACTION, createPost);
};

export const watchUploadImage = function*() {
  yield takeLatest(UPLOAD_IMAGE.ACTION, uploadImage);
};

export const watchCreateComment = function*() {
  yield takeLatest(CREATE_COMMENT.ACTION, createComment);
};
