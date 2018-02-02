import API from 'api/api';
import sc2 from 'api/sc2';
import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import { createPermlink } from 'util/steemitUtils';
import { CREATE_POST, UPLOAD_IMAGE } from '../actions/actionTypes';
import { getAuthUsername } from '../rootReducer';
import * as editorActions from '../actions/editorActions';

export const rewardsValues = {
  all: '100',
  half: '50',
  none: '0',
};

const broadcastComment = (
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
    let { permlink } = postData.permlink;

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
    const newBody = isUpdating ? postData.originalBody : body;
    const result = yield call(
      broadcastComment,
      parentAuthor,
      parentPermlink,
      author,
      title,
      newBody,
      jsonMetadata,
      reward,
      upvote,
      permlink,
    );
    console.log('RESULT', result);
    const payload = result.result;

    if (callback) callback(postData);

    yield put(editorActions.createPost.success(payload));
  } catch (error) {
    console.log(error);
    yield put(editorActions.createPost.fail(error));
  }
};

async function uploadToBusy(uri, authUsername, callback, errorCallback) {
  let apiUrl = `https://img.busy.org/@${authUsername}/uploads`;

  // Note:
  // Uncomment this if you want to experiment with local server
  //
  // if (Constants.isDevice) {
  //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
  // } else {
  //   apiUrl = `http://localhost:3000/upload`
  // }

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

const uploadImage = function*(action) {
  try {
    const { uri, callback, errorCallback } = action.payload;
    const authUsername = select(getAuthUsername);
    const result = yield call(uploadToBusy, uri, authUsername, callback, errorCallback);
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
