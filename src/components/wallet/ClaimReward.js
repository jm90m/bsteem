import React from 'react';
import PropTypes from 'prop-types';
import { vestToSteem } from 'util/steemitFormatters';
import styled from 'styled-components/native';
import moment from 'moment';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_COMMUNITY_ICONS, ICON_COLORS, ICON_SIZES } from 'constants/styles';
import WalletTransactionContainer from './WalletTransactionContainer';
import IconContainer from './IconContainer';

const RewardsPayoutContainer = styled.Text`
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: auto;
  font-weight: bold;
`;

const TimeStamp = styled.Text`
  color: ${COLORS.BLUE.BOTICELLI};
  font-size: 14px;
`;

const ClaimRewardContent = styled.View`
  padding: 0 10px;
`;

const ClaimRewardsText = styled.Text`
  font-weight: bold;
  color: ${COLORS.BLACK.BLACK};
`;

const getFormattedPayout = (
  rewardSteem,
  rewardSbd,
  rewardVests,
  totalVestingShares,
  totalVestingFundSteem,
) => {
  const payouts = [];
  const parsedRewardSteem = parseFloat(rewardSteem).toFixed(3);
  const parsedRewardSbd = parseFloat(rewardSbd).toFixed(3);
  const parsedRewardVests = parseFloat(
    vestToSteem(rewardVests, totalVestingShares, totalVestingFundSteem),
  ).toFixed(3);

  if (parsedRewardSteem > 0) {
    payouts.push(`${parsedRewardSteem} STEEM`);
  }

  if (parsedRewardSbd > 0) {
    payouts.push(`${parsedRewardSbd} SBD`);
  }

  if (parsedRewardVests > 0) {
    payouts.push(`${parsedRewardVests} SP`);
  }

  return payouts.join(', ');
};

const ClaimReward = ({
  timestamp,
  rewardSteem,
  rewardSbd,
  rewardVests,
  totalVestingShares,
  totalVestingFundSteem,
}) => (
  <WalletTransactionContainer>
    <IconContainer>
      <MaterialCommunityIcons
        name={MATERIAL_COMMUNITY_ICONS.claimReward}
        size={ICON_SIZES.actionIcon}
        color={ICON_COLORS.actionIcon}
      />
    </IconContainer>
    <ClaimRewardContent>
      <ClaimRewardsText>{'Claim Rewards '}</ClaimRewardsText>
      <TimeStamp>{moment(timestamp).fromNow()}</TimeStamp>
    </ClaimRewardContent>
    <RewardsPayoutContainer>
      {getFormattedPayout(
        rewardSteem,
        rewardSbd,
        rewardVests,
        totalVestingShares,
        totalVestingFundSteem,
      )}
    </RewardsPayoutContainer>
  </WalletTransactionContainer>
);

ClaimReward.propTypes = {
  timestamp: PropTypes.string.isRequired,
  rewardSteem: PropTypes.string.isRequired,
  rewardSbd: PropTypes.string.isRequired,
  rewardVests: PropTypes.string.isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
};

export default ClaimReward;
