const colorsMap = {
  BLUE: {
    MARINER: '#4757b2', // link color
    BOTICELLI: '#99AAB5',
    LINK_WATER: '#C2CCD3',
    MEDIUM_AQUAMARINE: '#54D2A0',
    SOLITUDE: '#f5f6f9',
    HAVELOCK_BLUE: '#4A80BE',
    HEATHER: '#a1afba',
    BALI_HAI: '#8798a4',
  },

  GREEN: {
    BUBBLES: '#EAF4EF',
    DARK_GREEN: '#000024',
  },

  BLACK: {
    BLACK: '#030303',
  },

  RED: {
    VALENCIA: '#D9534F',
  },

  GREY: {
    GONDOLA: '#353535',
    CHARCOAL: '#454545',
    NERO: '#2A2A2A',
  },

  WHITE: {
    WHITE: '#FFFFFF',
    WHITE_SMOKE: '#EEEEEE',
    GAINSBORO: '#E9E7E7',
  },

  VIOLET: {
    PAUA: '#232A57',
    HAN_PURPLE: '#4630EB',
  },
};

const appColors = {
  PRIMARY_COLOR: colorsMap.VIOLET.HAN_PURPLE,
  BORDER_COLOR: colorsMap.WHITE.GAINSBORO,
  LIST_VIEW_BACKGROUND: colorsMap.WHITE.WHITE_SMOKE,
  PRIMARY_BACKGROUND_COLOR: colorsMap.WHITE.WHITE,
  PRIMARY_BORDER_COLOR: colorsMap.WHITE.GAINSBORO,
  SECONDARY_COLOR: colorsMap.GREEN.DARK_GREEN,
  TERTIARY_COLOR: colorsMap.BLUE.BOTICELLI,

  SPLASH_SCREEN_BACKGROUND: '#FCFCFC',
};

export const COLORS = {
  ...colorsMap,
  ...appColors,
};

export const APP_STYLES = {
  PRIMARY_BORDER_WIDTH: 1,
};

export const FONT_SIZES = {
  TITLE: '20px',
};

export const MATERIAL_ICONS = {
  // tab bar nav
  home: 'home',
  login: 'account-circle',
  search: 'public',

  follow: 'person-add',
  followed: 'person',
  like: 'thumb-up',
  unlike: 'thumb-down',
  report: 'report',
  back: 'arrow-back',
  trending: 'trending-up',
  hot: 'whatshot',
  new: 'fiber-new',
  promoted: 'present-to-all',
  active: 'directions-run',

  // user menu
  blog: 'account-circle',
  comments: 'message',
  followers: 'group',
  following: 'supervisor-account',
  wallet: 'account-balance-wallet',
  activity: 'grade',

  // auth
  logout: 'person-outline',

  // user profile
  location: 'location-on',
  reply: 'reply',
  timer: 'timer',

  close: 'close',
  create: 'create',

  // activity
  person: 'person',
  businessCenter: 'business-center',
  voteFill: 'thumb-up',
  voteOutline: 'thumb-up-outline',
  unvoteFill: 'thumb-down',
  personAdd: 'person-add',
  personOutline: 'person-outline',
  star: 'star',
  flashOn: 'flash-on',
  modeComment: 'mode-comment',
  money: 'attach-money',

  // video
  playCircle: 'play-circle-outline',
  edit: 'edit',
  settings: 'settings',

  save: 'save',
  warning: 'warning',
  checkCircle: 'check-circle',
};

export const MATERIAL_COMMUNITY_ICONS = {
  account: 'account',
  reblog: 'tumblr-reblog',
  comment: 'comment-processing',
  menuVertical: 'dots-vertical',
  menuHorizontal: 'dots-horizontal',
  chevronDown: 'chevron-down',
  active: 'run-fast',
  linkVariant: 'link-variant',
  clock: 'clock',
  magnify: 'magnify',
  filter: 'filter',
  accountEdit: 'account-edit',

  // activity
  voteFill: 'thumb-up',
  voteOutline: 'thumb-up-outline',
  unvoteFill: 'thumb-down',
  reply: 'reply',

  // wallet
  claimReward: 'check-circle',

  // tags
  saveTag: 'star-outline',
  savedTag: 'star',

  save: 'star-outline',
  saved: 'star',

  // post
  savePost: 'star-outline',
  savedPost: 'star',

  closeCircle: 'close-circle-outline',

  image: 'image',
  pencil: 'pencil',

  // for saved screen menu navigation
  tag: 'tag',
  posts: 'file-document-box',
  shareVariant: 'share-variant',

  caretUp: 'menu-up',
  caretDown: 'menu-down',

  lineChart: 'chart-line',
  noteMultipleOutline: 'note-multiple-outline',

  // comments
  newest: 'creation',
  best: 'fire',
  oldest: 'ghost',
  reputation: 'heart',

  messageText: 'message-text',
};

export const FEATHER_ICONS = {
  award: 'award',
};

export const FONT_AWESOME_ICONS = {
  news: 'newspaper-o',
  bolt: 'bolt',
  dollar: 'dollar',
  bank: 'bank',
};

export const ICON_SIZES = {
  menuIcon: 24,
  tabBarIcon: 20,
  actionIcon: 22,
  menuModalOptionIcon: 20,
  editorCloseIcon: 30,
  userHeaderIcon: 20,
  contentTitleBlockIcon: 20,
};

export const ICON_COLORS = {
  actionIcon: COLORS.BLUE.HEATHER,
};
