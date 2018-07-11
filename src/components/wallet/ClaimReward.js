import React from 'react';
import PropTypes from 'prop-types';
import { vestToSteem } from 'util/steemitFormatters';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import TimeAgo from 'components/common/TimeAgo';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import { connect } from 'react-redux';
import tinycolor from 'tinycolor2';
import IconContainer from './IconContainer';
import WalletTransactionContainer from './WalletTransactionContainer';
import { getCustomTheme, getIntl } from '../../state/rootReducer';

const RewardsPayoutContainer = styled(StyledTextByBackground)`
`;

const ClaimRewardContent = styled.View`
  padding: 0 10px;
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
  customTheme,
  intl,
}) => (
  <WalletTransactionContainer>
    <IconContainer>
      <MaterialCommunityIcons
        name={MATERIAL_COMMUNITY_ICONS.claimReward}
        size={ICON_SIZES.actionIcon}
        color={
          tinycolor(customTheme.tertiaryColor).isDark()
            ? COLORS.LIGHT_TEXT_COLOR
            : COLORS.DARK_TEXT_COLOR
        }
      />
    </IconContainer>
    <ClaimRewardContent>
      <StyledTextByBackground style={{ fontWeight: 'bold' }}>
        {`${intl.claim_rewards} `}
      </StyledTextByBackground>
      <RewardsPayoutContainer>
        {getFormattedPayout(
          rewardSteem,
          rewardSbd,
          rewardVests,
          totalVestingShares,
          totalVestingFundSteem,
        )}
      </RewardsPayoutContainer>
      <TimeAgo created={timestamp} />
    </ClaimRewardContent>
  </WalletTransactionContainer>
);

ClaimReward.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  timestamp: PropTypes.string.isRequired,
  rewardSteem: PropTypes.string.isRequired,
  rewardSbd: PropTypes.string.isRequired,
  rewardVests: PropTypes.string.isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(ClaimReward);
