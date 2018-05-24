import { MATERIAL_ICONS } from './styles';

export const PROMOTED = {
  icon: MATERIAL_ICONS.promoted,
  id: 'promoted',
  label: 'sort_promoted',
};

export const HOT = {
  icon: MATERIAL_ICONS.hot,
  id: 'hot',
  label: 'sort_hot',
};

export const ACTIVE = {
  icon: MATERIAL_ICONS.active,
  id: 'active',
  label: 'sort_active',
};

export const NEW = {
  icon: MATERIAL_ICONS.new,
  id: 'new',
  label: 'sort_newest',
};

export const TRENDING = {
  icon: MATERIAL_ICONS.trending,
  id: 'trending',
  label: 'sort_trending',
};

export const FEED_FILTERS = [TRENDING, HOT, ACTIVE, NEW];
