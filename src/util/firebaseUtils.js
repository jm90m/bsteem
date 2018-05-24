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
export const getUserSettings = username => `${baseUserSettingsRef}/${username}/settings`;
export const getNSFWDisplaySettingsRef = username =>
  `${getUserSettings(username)}/display-nsfw-setting`;
export const getPostPreviewCompactModeSettingRef = username =>
  `${getUserSettings(username)}/post-preview-compact-mode`;
export const getUserSavedTagsRef = username => `${baseUserSettingsRef}/${username}/saved-tags`;
export const getSaveTagRef = (username, tag) => `${getUserSavedTagsRef(username)}/${tag}`;

export const getUserSavedPostsRef = username => `${baseUserSettingsRef}/${username}/saved-posts`;
export const getSavePostRef = (username, postID) => `${getUserSavedPostsRef(username)}/${postID}`;

export const getUserSavedUsersRef = username => `${baseUserSettingsRef}/${username}/saved-users`;
export const getSaveUserRef = (username, saveUser) =>
  `${getUserSavedUsersRef(username)}/${saveUser}`;

export const getUserReportedPostsRef = username =>
  `${baseUserSettingsRef}/${username}/reported-posts`;
export const getReportPostRef = (username, postID) =>
  `${getUserReportedPostsRef(username)}/${postID}`;

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

export const getUserEnableVoteSliderRef = username => `${getUserSettings(username)}/vote-slider`;
export const getUserVotePercentRef = username => `${getUserSettings(username)}/vote-percent`;

export const getUserCustomThemeSettingsRef = username =>
  `${getUserSettings(username)}/custom-theme`;

export const getUserLanguageSettingRef = username =>
  `${getUserSettings(username)}/language-setting`;

export const getUserSignatureSettingRef = username => `${getUserSettings(username)}/user-signature`;
export const getUserEnableSignatureSettingRef = username =>
  `${getUserSettings(username)}/user-signature-enabled`;

export const getUserUploadsRef = username => `${getUserSettings(username)}/uploads`;
