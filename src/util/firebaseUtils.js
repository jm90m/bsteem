import firebase from 'firebase';
import _ from 'lodash';

export const getFirebaseValueOnce = (ref, key) =>
  firebase
    .database()
    .ref(ref)
    .once(key);

export const setFirebaseData = (ref, values = {}) => {
  firebase
    .database()
    .ref(ref)
    .set(values);
};

export const baseUserSettingsRef = 'user-settings';
export const getUserSavedTagsRef = username => `${baseUserSettingsRef}/${username}/saved-tags`;
export const getSaveTagRef = (username, tag) => `${getUserSavedTagsRef(username)}/${tag}`;

export const getUserSavedPostsRef = username => `${baseUserSettingsRef}/${username}/saved-posts`;
export const getSavePostRef = (username, postID) => `${getUserSavedPostsRef(username)}/${postID}`;

export const getUserSavedUsersRef = username => `${baseUserSettingsRef}/${username}/saved-users`;
export const getSaveUserRef = (username, saveUser) =>
  `${getUserSavedUsersRef(username)}/${saveUser}`;

export const getUserRebloggedPostsRef = username =>
  `${baseUserSettingsRef}/${username}/reblogged-posts`;
export const getRebloggedPostRef = (username, postID) =>
  `${getUserRebloggedPostsRef(username)}/${postID}`;

export const getUserPostDraftsRef = username => `${baseUserSettingsRef}/${username}/post-drafts`;
export const getSavedDraftRef = (username, draftID) =>
  `${getUserPostDraftsRef(username)}/${draftID}`;

export const getUserAllPrivateMessagesRef = username =>
  `${baseUserSettingsRef}/${username}/private-messages`;
export const getUserDisplayedPrivateMessagesRef = (username, toUser) =>
  `${baseUserSettingsRef}/${username}/private-messages/${toUser}`;

export const baseMessagesRef = 'user-messages';
export const getUsersMessagesRef = (firstUser = '', secondUser = '') => {
  const userMessageRef = _.join([firstUser, secondUser].sort(), '--');
  return `${baseMessagesRef}/${userMessageRef}`;
};
export const getSendUserMessagesRef = (firstUser, secondUser, timestamp) => {
  const baseUserMessagesRef = getUsersMessagesRef(firstUser, secondUser);

  return `${baseUserMessagesRef}/${timestamp}`;
};

export const getUserBlockedUsersRef = username =>
  `${baseUserSettingsRef}/${username}/blocked-users`;
export const getBlockedUserRef = (username, blockUsername) =>
  `${getUserBlockedUsersRef(username)}/${blockUsername}`;
