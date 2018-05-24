import { MATERIAL_COMMUNITY_ICONS } from './styles';

export const SORT_COMMENTS = {
  BEST: { id: 'BEST', label: 'sort_best', icon: MATERIAL_COMMUNITY_ICONS.best },
  NEWEST: { id: 'NEWEST', label: 'sort_newest', icon: MATERIAL_COMMUNITY_ICONS.newest },
  OLDEST: { id: 'OLDEST', label: 'sort_oldest', icon: MATERIAL_COMMUNITY_ICONS.oldest },
  REPUTATION: {
    id: 'REPUTATION',
    label: 'sort_author_reputation',
    icon: MATERIAL_COMMUNITY_ICONS.reputation,
  },
};

export const COMMENT_FILTERS = [
  SORT_COMMENTS.BEST,
  SORT_COMMENTS.NEWEST,
  SORT_COMMENTS.OLDEST,
  SORT_COMMENTS.REPUTATION,
];
