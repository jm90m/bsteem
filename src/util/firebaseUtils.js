import firebase from 'firebase';
import CryptoJS from 'crypto-js';
import _ from 'lodash';
import { encryptionSecretKey } from '../constants/config';

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

const getEncryptedUsername = username =>
  CryptoJS.AES.encrypt(username, encryptionSecretKey).toString();

export const baseUserSettingsRef = 'user-settings';
export const getUserSettings = username =>
  `${baseUserSettingsRef}/${getEncryptedUsername(username)}/settings`;
export const getNSFWDisplaySettingsRef = username =>
  `${getUserSettings(getEncryptedUsername(username))}/display-nsfw-setting`;
export const getPostPreviewCompactModeSettingRef = username =>
  `${getUserSettings(getEncryptedUsername(username))}/post-preview-compact-mode`;
export const getUserSavedTagsRef = username =>
  `${baseUserSettingsRef}/${getEncryptedUsername(username)}/saved-tags`;
export const getSaveTagRef = (username, tag) =>
  `${getUserSavedTagsRef(getEncryptedUsername(username))}/${tag}`;

export const getUserSavedPostsRef = username =>
  `${baseUserSettingsRef}/${getEncryptedUsername(username)}/saved-posts`;
export const getSavePostRef = (username, postID) =>
  `${getUserSavedPostsRef(getEncryptedUsername(username))}/${postID}`;

export const getUserSavedUsersRef = username =>
  `${baseUserSettingsRef}/${getEncryptedUsername(username)}/saved-users`;
export const getSaveUserRef = (username, saveUser) =>
  `${getUserSavedUsersRef(getEncryptedUsername(username))}/${getEncryptedUsername(saveUser)}`;

export const getUserReportedPostsRef = username =>
  `${baseUserSettingsRef}/${getEncryptedUsername(username)}/reported-posts`;
export const getReportPostRef = (username, postID) =>
  `${getUserReportedPostsRef(getEncryptedUsername(username))}/${postID}`;

export const getUserRebloggedPostsRef = username =>
  `${baseUserSettingsRef}/${username}/reblogged-posts`;
export const getRebloggedPostRef = (username, postID) =>
  `${getUserRebloggedPostsRef(getEncryptedUsername(username))}/${postID}`;

export const getUserPostDraftsRef = username =>
  `${baseUserSettingsRef}/${getEncryptedUsername(username)}/post-drafts`;
export const getSavedDraftRef = (username, draftID) =>
  `${getUserPostDraftsRef(getEncryptedUsername(username))}/${draftID}`;

export const getUserAllPrivateMessagesRef = username =>
  `${baseUserSettingsRef}/${getEncryptedUsername(username)}/private-messages`;
export const getUserDisplayedPrivateMessagesRef = (username, toUser) =>
  `${baseUserSettingsRef}/${getEncryptedUsername(username)}/private-messages/${toUser}`;

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
  `${baseUserSettingsRef}/${getEncryptedUsername(username)}/blocked-users`;
export const getBlockedUserRef = (username, blockUsername) =>
  `${getUserBlockedUsersRef(getEncryptedUsername(username))}/${blockUsername}`;

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
