import steem from 'steem';
/**
 * https://github.com/steemit/steemit.com/blob/47fd0e0846bd8c7c941ee4f95d5f971d3dc3981d/app/utils/ParsersAndFormatters.js
 */
export function parsePayoutAmount(amount) {
  return parseFloat(String(amount).replace(/\s[A-Z]*$/, ''));
}

/**
 * Calculates Payout Details Modified as needed
 * https://github.com/steemit/steemit.com/blob/47fd0e0846bd8c7c941ee4f95d5f971d3dc3981d/app/components/elements/Voting.jsx
 */
export const calculatePayout = post => {
  const payoutDetails = {};
  const { active_votes, parent_author, cashout_time } = post;

  const max_payout = parsePayoutAmount(post.max_accepted_payout);
  const pending_payout = parsePayoutAmount(post.pending_payout_value);
  const promoted = parsePayoutAmount(post.promoted);
  const total_author_payout = parsePayoutAmount(post.total_payout_value);
  const total_curator_payout = parsePayoutAmount(post.curator_payout_value);
  const is_comment = parent_author !== '';

  let payout = pending_payout + total_author_payout + total_curator_payout;
  if (payout < 0.0) payout = 0.0;
  if (payout > max_payout) payout = max_payout;
  payoutDetails.payoutLimitHit = payout >= max_payout;

  // There is an "active cashout" if: (a) there is a pending payout, OR (b)
  // there is a valid cashout_time AND it's NOT a comment with 0 votes.
  const cashout_active =
    pending_payout > 0 ||
    (cashout_time.indexOf('1969') !== 0 && !(is_comment && active_votes.length === 0));

  if (cashout_active) {
    payoutDetails.potentialPayout = pending_payout;
  }

  if (promoted > 0) {
    payoutDetails.promotionCost = promoted;
  }

  if (cashout_active) {
    payoutDetails.cashoutInTime = cashout_time;
  }

  if (max_payout === 0) {
    payoutDetails.isPayoutDeclined = true;
  } else if (max_payout < 1000000) {
    payoutDetails.maxAcceptedPayout = max_payout;
  }

  if (total_author_payout > 0) {
    payoutDetails.pastPayouts = total_author_payout + total_curator_payout;
    payoutDetails.authorPayouts = total_author_payout;
    payoutDetails.curatorPayouts = total_curator_payout;
  }

  return payoutDetails;
};

export const calculateEstAccountValue = (
  user,
  totalVestingShares,
  totalVestingFundSteem,
  steemRate,
) => {
  const steemPower = steem.formatter.vestToSteem(
    user.vesting_shares,
    totalVestingShares,
    totalVestingFundSteem,
  );
  return (
    parseFloat(steemRate) * (parseFloat(user.balance) + parseFloat(steemPower)) +
    parseFloat(user.sbd_balance)
  );
};
