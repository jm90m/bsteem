import i18n from 'i18n/i18n';
import { MATERIAL_COMMUNITY_ICONS } from './styles';

export const SORT_COMMENTS = {
  BEST: { id: 'BEST', label: i18n.comments.best, icon: MATERIAL_COMMUNITY_ICONS.best },
  NEWEST: { id: 'NEWEST', label: i18n.comments.newest, icon: MATERIAL_COMMUNITY_ICONS.newest },
  OLDEST: { id: 'OLDEST', label: i18n.comments.oldest, icon: MATERIAL_COMMUNITY_ICONS.oldest },
  REPUTATION: {
    id: 'REPUTATION',
    label: i18n.comments.reputation,
    icon: MATERIAL_COMMUNITY_ICONS.reputation,
  },
};

export const COMMENT_FILTERS = [
  SORT_COMMENTS.BEST,
  SORT_COMMENTS.NEWEST,
  SORT_COMMENTS.OLDEST,
  SORT_COMMENTS.REPUTATION,
];
