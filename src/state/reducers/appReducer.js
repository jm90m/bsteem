import {
  FETCH_STEEM_RATE,
  FETCH_STEEM_GLOBAL_PROPERTIES,
  FETCH_NETWORK_CONNECTION,
  SET_STEEMCONNECT_ERROR_MODAL_DISPLAY,
  DISPLAY_NOTIFY_MODAL,
  HIDE_NOTIFY_MODAL,
  APP_ONBOARDING,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  steemRate: '0',
  loadingSteemGlobalProperties: false,
  totalVestingFundSteem: '',
  totalVestingShares: '',
  networkConnection: false,
  steemConnectDisplayErrorModal: false,
  displayNotifyModal: false,
  notifyTitle: '',
  notifyDescription: '',
  appLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_STEEM_RATE.SUCCESS:
      return {
        ...state,
        steemRate: action.payload,
      };
    case FETCH_STEEM_GLOBAL_PROPERTIES.ACTION:
      return {
        ...state,
        loadingSteemGlobalProperties: true,
      };
    case FETCH_STEEM_GLOBAL_PROPERTIES.SUCCESS:
      return {
        ...state,
        totalVestingFundSteem: action.payload.total_vesting_fund_steem,
        totalVestingShares: action.payload.total_vesting_shares,
        loadingSteemGlobalProperties: false,
      };
    case FETCH_STEEM_GLOBAL_PROPERTIES.ERROR:
    case FETCH_STEEM_GLOBAL_PROPERTIES.LOADING_END:
      return {
        ...state,
        loadingSteemGlobalProperties: false,
      };

    case FETCH_NETWORK_CONNECTION.SUCCESS: {
      // {type: "unknown", effectiveType: "unknown"}
      const { type } = action.payload;
      const hasNetworkConnection = type !== 'unknown';
      return {
        ...state,
        networkConnection: hasNetworkConnection,
      };
    }

    case SET_STEEMCONNECT_ERROR_MODAL_DISPLAY:
      return {
        ...state,
        steemConnectDisplayErrorModal: action.payload,
      };

    case DISPLAY_NOTIFY_MODAL:
      return {
        ...state,
        displayNotifyModal: true,
        notifyTitle: action.payload.notifyTitle,
        notifyDescription: action.payload.notifyDescription,
      };
    case HIDE_NOTIFY_MODAL:
      return {
        ...state,
        displayNotifyModal: false,
      };
    case APP_ONBOARDING.ACTION:
      return {
        ...state,
        appLoading: true,
      };
    case APP_ONBOARDING.SUCCESS:
    case APP_ONBOARDING.ERROR:
    case APP_ONBOARDING.LOADING_END:
      return {
        ...state,
        appLoading: false,
      };
    default:
      return state;
  }
};

export const getSteemRate = state => state.steemRate;
export const getLoadingSteemGlobalProperties = state => state.loadingSteemGlobalProperties;
export const getTotalVestingFundSteem = state => state.totalVestingFundSteem;
export const getTotalVestingShares = state => state.totalVestingShares;
export const getHasNetworkConnection = state => state.networkConnection;
export const getSteemConnectDisplayErrorModal = state => state.steemConnectDisplayErrorModal;
export const getDisplayNotifyModal = state => state.displayNotifyModal;
export const getNotifyTitle = state => state.notifyTitle;
export const getNotifyDescription = state => state.notifyDescription;
export const getIsAppLoading = state => state.appLoading;
