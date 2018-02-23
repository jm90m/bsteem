import base58 from 'bs58';
import getSlug from 'speakingurl';
import API from 'api/api';
import diff_match_patch from 'diff-match-patch';
import * as steemitFormatters from 'util/steemitFormatters';

const dmp = new diff_match_patch();
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
  const steemPower = steemitFormatters.vestToSteem(
    user.vesting_shares,
    totalVestingShares,
    totalVestingFundSteem,
  );
  return (
    parseFloat(steemRate) * (parseFloat(user.balance) + parseFloat(steemPower)) +
    parseFloat(user.sbd_balance)
  );
};

function checkPermLinkLength(permlink) {
  if (permlink.length > 255) {
    // STEEMIT_MAX_PERMLINK_LENGTH
    permlink = permlink.substring(permlink.length - 255, permlink.length);
  }
  // only letters numbers and dashes shall survive
  permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
  return permlink;
}
/**
 * Generate permlink
 * https://github.com/steemit/steemit.com/blob/ded8ecfcc9caf2d73b6ef12dbd0191bd9dbf990b/app/redux/TransactionSaga.js
 */

function slug(text) {
  return getSlug(text.replace(/[<>]/g, ''), { truncate: 128 });
}

export function createPermlink(title, author, parent_author, parent_permlink) {
  let permlink;
  if (title && title.trim() !== '') {
    let s = slug(title);
    if (s === '') {
      const randomSlug = `${title}-${10000 * Math.random() * Math.random()}`;
      s = base58.encode(randomSlug);
    }

    return API.createPermlink(author, s)
      .then(content => {
        const { result } = content;
        let prefix;
        if (result.body !== '') {
          // make sure slug is unique
          const randomPrefix = `${result.body}-${10000 * Math.random() * Math.random()}`;
          prefix = `${base58.encode(randomPrefix)}-`;
        } else {
          prefix = '';
        }
        permlink = prefix + s;
        return checkPermLinkLength(permlink);
      })
      .catch(err => {
        console.warn('Error while getting content', err);
        return permlink;
      });
  }
  // comments: re-parentauthor-parentpermlink-time
  const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
  parent_permlink = parent_permlink.replace(/(-\d{8}t\d{9}z)/g, '');
  permlink = `re-${parent_author}-${parent_permlink}-${timeStr}`;
  return Promise.resolve(checkPermLinkLength(permlink));
}

export const calculateTotalDelegatedSP = (user, totalVestingShares, totalVestingFundSteem) => {
  const receivedSP = parseFloat(
    steemitFormatters.vestToSteem(
      user.received_vesting_shares,
      totalVestingShares,
      totalVestingFundSteem,
    ),
  );
  const delegatedSP = parseFloat(
    steemitFormatters.vestToSteem(
      user.delegated_vesting_shares,
      totalVestingShares,
      totalVestingFundSteem,
    ),
  );
  return receivedSP - delegatedSP;
};

/**
 * This function is extracted from steemit.com source code and does the same tasks with some slight-
 * adjustments to meet our needs. Refer to the main one in case of future problems:
 * https://github.com/steemit/steemit.com/blob/edac65e307bffc23f763ed91cebcb4499223b356/app/redux/TransactionSaga.js#L340
 */

export const createCommentPermlink = (parentAuthor, parentPermlink) => {
  let permlink;

  // comments: re-parentauthor-parentpermlink-time
  const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
  const newParentPermlink = parentPermlink.replace(/(-\d{8}t\d{9}z)/g, '');
  permlink = `re-${parentAuthor}-${newParentPermlink}-${timeStr}`;

  if (permlink.length > 255) {
    // STEEMIT_MAX_PERMLINK_LENGTH
    permlink = permlink.substring(permlink.length - 255, permlink.length);
  }
  // only letters numbers and dashes shall survive
  permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
  return permlink;
};

/**
 * https://github.com/steemit/steemit.com/blob/ded8ecfcc9caf2d73b6ef12dbd0191bd9dbf990b/app/redux/TransactionSaga.js#L412
 */
function createPatch(text1, text2) {
  if (!text1 && text1 === '') return undefined;
  const patches = dmp.patch_make(text1, text2);
  const patch = dmp.patch_toText(patches);
  return patch;
}

/**
 * https://github.com/steemit/steemit.com/blob/ded8ecfcc9caf2d73b6ef12dbd0191bd9dbf990b/app/redux/TransactionSaga.js#L329
 */
export function getBodyPatchIfSmaller(originalBody, body) {
  if (!originalBody) return body;
  const patch = createPatch(originalBody, body);
  // Putting body into buffer will expand Unicode characters into their true length
  if (patch && patch.length < new Buffer(body, 'utf-8').length) {
    body = patch;
  }
  return body;
}
