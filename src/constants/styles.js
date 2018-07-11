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
    DODGER_BLUE: '#1890ff',
    NAVY_BLUE: '#0274dc',
    BLACK_ROCK: '#282A36',
    COLUMBIA_BLUE: '#A5F7FE',
    BLACK_PEARL: '#1D252B',
    OXFORD_BLUE: '#242F38',
  },

  GREEN: {
    BUBBLES: '#EAF4EF',
    DARK_GREEN: '#000024',
    SHAMROCK: '#25D5AA',
    PALE_GREEN: '#6EFA99',
  },

  BLACK: {
    BLACK: '#030303',
  },

  RED: {
    VALENCIA: '#D9534F',
    TORCH_RED: '#FC0D1C',
  },

  GREY: {
    GONDOLA: '#353535',
    CHARCOAL: '#3E3E3E',
    NERO: '#2A2A2A',
    NIGHT_RIDER: '#323232',
    GREY: '#7C7C7C',
    BUNKER: '#222426',
    EMPRESS: '#777676',
    VERY_LIGHT_GREY: '#CACACA',
  },

  WHITE: {
    WHITE: '#FFFFFF',
    WHITE_SMOKE: '#EEEEEE',
    GAINSBORO: '#E9E7E7',
    MINT_CREAM: '#F3FFFC',
  },

  VIOLET: {
    PAUA: '#232A57',
    HAN_PURPLE: '#4630EB',
    MAUVE: '#E2C2FD',
  },
};

const appColors = {
  PRIMARY_COLOR: colorsMap.BLUE.DODGER_BLUE,
  BORDER_COLOR: colorsMap.WHITE.GAINSBORO,
  LIST_VIEW_BACKGROUND: colorsMap.WHITE.WHITE_SMOKE,
  PRIMARY_BACKGROUND_COLOR: colorsMap.WHITE.WHITE,
  PRIMARY_BORDER_COLOR: colorsMap.WHITE.GAINSBORO,
  SECONDARY_COLOR: colorsMap.GREEN.DARK_GREEN,
  TERTIARY_COLOR: colorsMap.BLUE.BOTICELLI,
  POSITIVE_COLOR: colorsMap.BLUE.MEDIUM_AQUAMARINE,
  NEGATIVE_COLOR: colorsMap.RED.VALENCIA,
  SPLASH_SCREEN_BACKGROUND: '#FCFCFC',
  LIGHT_TEXT_COLOR: colorsMap.WHITE.WHITE,
  DARK_TEXT_COLOR: colorsMap.GREY.GONDOLA,
};

// add utopian colors, dtube colors, busy colors, steemit colors,

export const bSteemColors = {
  primaryColor: colorsMap.BLUE.DODGER_BLUE,
  secondaryColor: colorsMap.GREEN.DARK_GREEN,
  tertiaryColor: colorsMap.BLUE.BOTICELLI,
  listBackgroundColor: colorsMap.WHITE.WHITE_SMOKE,
  primaryBackgroundColor: colorsMap.WHITE.WHITE,
  primaryBorderColor: colorsMap.WHITE.GAINSBORO,
  positiveColor: colorsMap.BLUE.MEDIUM_AQUAMARINE,
  negativeColor: colorsMap.RED.VALENCIA,
};

export const bSteemDarkColors = {
  primaryColor: colorsMap.VIOLET.MAUVE,
  secondaryColor: colorsMap.BLUE.COLUMBIA_BLUE,
  tertiaryColor: colorsMap.GREEN.PALE_GREEN,
  listBackgroundColor: colorsMap.WHITE.MINT_CREAM,
  primaryBackgroundColor: colorsMap.BLUE.BLACK_ROCK,
  primaryBorderColor: colorsMap.WHITE.MINT_CREAM,
  positiveColor: colorsMap.BLUE.MEDIUM_AQUAMARINE,
  negativeColor: colorsMap.RED.VALENCIA,
};

export const dTubeColors = {
  primaryColor: colorsMap.RED.TORCH_RED,
  secondaryColor: colorsMap.GREY.NIGHT_RIDER,
  tertiaryColor: colorsMap.GREY.GREY,
  listBackgroundColor: colorsMap.WHITE.GAINSBORO,
  primaryBackgroundColor: colorsMap.WHITE.WHITE,
  primaryBorderColor: colorsMap.WHITE.GAINSBORO,
  positiveColor: colorsMap.BLUE.MEDIUM_AQUAMARINE,
  negativeColor: colorsMap.RED.VALENCIA,
};

export const busyColors = {
  primaryColor: colorsMap.BLUE.DODGER_BLUE,
  secondaryColor: colorsMap.BLUE.NAVY_BLUE,
  tertiaryColor: colorsMap.GREY.EMPRESS,
  listBackgroundColor: colorsMap.WHITE.GAINSBORO,
  primaryBackgroundColor: colorsMap.WHITE.WHITE,
  primaryBorderColor: colorsMap.WHITE.GAINSBORO,
  positiveColor: colorsMap.BLUE.MEDIUM_AQUAMARINE,
  negativeColor: colorsMap.RED.VALENCIA,
};

export const steemitColors = {
  primaryColor: colorsMap.GREEN.SHAMROCK,
  secondaryColor: colorsMap.GREY.NIGHT_RIDER,
  tertiaryColor: colorsMap.GREY.VERY_LIGHT_GREY,
  listBackgroundColor: colorsMap.WHITE.GAINSBORO,
  primaryBackgroundColor: colorsMap.WHITE.WHITE,
  primaryBorderColor: colorsMap.WHITE.GAINSBORO,
  positiveColor: colorsMap.BLUE.MEDIUM_AQUAMARINE,
  negativeColor: colorsMap.RED.VALENCIA,
};

export const steemitDarkColors = {
  primaryColor: colorsMap.GREEN.SHAMROCK,
  secondaryColor: colorsMap.WHITE.WHITE,
  tertiaryColor: colorsMap.BLUE.HEATHER,
  listBackgroundColor: colorsMap.BLUE.BLACK_PEARL,
  primaryBackgroundColor: colorsMap.BLUE.BLACK_PEARL,
  primaryBorderColor: colorsMap.BLUE.OXFORD_BLUE,
  positiveColor: colorsMap.BLUE.MEDIUM_AQUAMARINE,
  negativeColor: colorsMap.RED.VALENCIA,
};

export const COLORS = {
  ...colorsMap,
  ...appColors,
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
  keyboardHide: 'keyboard-hide',
  replyAll: 'reply-all',
  notifications: 'notifications',
  notificationsActive: 'notifications-active',
  moneyOff: 'money-off',
  playCirlceOutline: 'play-circle-outline',
  directionsRun: 'directions-run',
  apps: 'apps',
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
  star: 'star',

  // post
  savePost: 'star-outline',
  savedPost: 'star',

  closeCircle: 'close-circle-outline',
  checkCircle: 'check-circle-outline',
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
  block: 'block-helper',
  hide: 'eye-off',
  cashUSD: 'cash-usd',
  crown: 'crown', // for reputation
  sort: 'sort',
  sortAlphabetical: 'sort-alphabetical',
  timer: 'timer',
  unfollowIcon: 'account-multiple-minus',
  followIcon: 'account-multiple-plus',

  autoFix: 'auto-fix',

  compact: 'view-headline',
  card: 'view-agenda',
  contentCopy: 'content-copy',
  publish: 'publish',
  contentSave: 'content-save',
  approval: 'approval',
  logout: 'logout',
  eraser: 'eraser',

  alertCircleOutline: 'alert-circle-outline',
  alertCircle: 'alert-circle',
};

export const FEATHER_ICONS = {
  award: 'award',
};

export const FONT_AWESOME_ICONS = {
  news: 'newspaper-o',
  bolt: 'bolt',
  dollar: 'dollar',
  bank: 'bank',
  sendMessage: 'send-o',
};

export const ICON_SIZES = {
  menuIcon: 24,
  tabBarIcon: 20,
  actionIcon: 22,
  menuModalOptionIcon: 20,
  editorCloseIcon: 30,
  userHeaderIcon: 20,
  contentTitleBlockIcon: 20,
  footerActionIcon: 20,
};

export const FONTS = {
  PRIMARY: 'linetoCircularMedium',
  SECONDARY: 'linetoCircularBook',
  TITLE: 'linetoCircularBold',
};
