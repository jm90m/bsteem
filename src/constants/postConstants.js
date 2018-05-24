import { MATERIAL_COMMUNITY_ICONS } from './styles';

export const DEFAULT_VOTE_WEIGHT = 10000;
export const DEFAULT_UNVOTE_WEIGHT = 0;

export const POST_HTML_BODY_TAG = '/**=-=-=**/--bsteemTAG--/**=-=-=/';
export const POST_HTML_BODY_USER = '/**=-=-=**/--bsteemUSER--/**=-=-=/';

export const REWARDS = {
  ALL: '100',
  HALF: '50',
  NONE: '0',
};

// Vote Sorts
export const REPUTATION_SORT = {
  icon: MATERIAL_COMMUNITY_ICONS.crown,
  id: 'reputation',
  label: 'Reputation',
};

export const VOTE_VALUE_SORT = {
  icon: MATERIAL_COMMUNITY_ICONS.cashUSD,
  id: 'vote_value',
  label: 'Vote Value',
};

export const USERNAME_SORT = {
  icon: MATERIAL_COMMUNITY_ICONS.sortAlphabetical,
  id: 'username',
  label: 'Username',
};

export const TIME_SORT = {
  icon: MATERIAL_COMMUNITY_ICONS.timer,
  id: 'time',
  label: 'Time',
};

export const VOTE_SORT = [VOTE_VALUE_SORT, REPUTATION_SORT, USERNAME_SORT, TIME_SORT];
