import firebase from 'firebase';
import _ from 'lodash';

export const getFirebaseValueOnce = (ref, key) => {};

export const setFirebaseData = (ref, values = {}) => {};

export const baseUserSettingsRef = '';
export const getUserSettings = username => '';
export const getNSFWDisplaySettingsRef = username => ``;
export const getUserSavedTagsRef = username => ``;
export const getSaveTagRef = (username, tag) => ``;

export const getUserSavedPostsRef = username => ``;
export const getSavePostRef = (username, postID) => ``;

export const getUserSavedUsersRef = username => ``;
export const getSaveUserRef = (username, saveUser) => ``;

export const getUserReportedPostsRef = username => ``;
export const getReportPostRef = (username, postID) => ``;

export const getUserRebloggedPostsRef = username => ``;
export const getRebloggedPostRef = (username, postID) => ``;

export const getUserPostDraftsRef = username => ``;
export const getSavedDraftRef = (username, draftID) => ``;

export const getUserAllPrivateMessagesRef = username => ``;
export const getUserDisplayedPrivateMessagesRef = (username, toUser) => ``;

export const baseMessagesRef = '';
export const getUsersMessagesRef = () => {};
export const getSendUserMessagesRef = () => {};

export const getUserBlockedUsersRef = username => ``;
export const getBlockedUserRef = (username, blockUsername) => ``;

export const getUserEnableVoteSliderRef = username => ``;
export const getUserVotePercentRef = username => ``;
