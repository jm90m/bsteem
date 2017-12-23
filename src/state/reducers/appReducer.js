import { FETCH_STEEM_RATE, FETCH_STEEM_GLOBAL_PROPERTIES } from '../actions/actionTypes';

const INITIAL_STATE = {
  steemRate: '0',
  loadingSteemGlobalProperties: false,
  totalVestingFundSteem: '',
  totalVestingShares: '',
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
    default:
      return state;
  }
};

export const getSteemRate = state => state.steemRate;
export const getLoadingSteemGlobalProperties = state => state.loadingSteemGlobalProperties;
export const getTotalVestingFundSteem = state => state.totalVestingFundSteem;
export const getTotalVestingShares = state => state.totalVestingShares;
