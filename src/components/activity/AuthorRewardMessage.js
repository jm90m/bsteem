import React from 'react';
import PropTypes from 'prop-types';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import _ from 'lodash';
import { connect } from 'react-redux';
import { vestToSteem } from 'util/steemitFormatters';
import PrimaryText from 'components/common/text/PrimaryText';
import styled from 'styled-components/native';

const LinkText = styled(PrimaryText)`
  color: ${props => props.customTheme.primaryColor}
  margin-right: 5px;
`;

const Touchable = styled.TouchableWithoutFeedback`
  padding-right: 10px;
`;

const AuthorRewardMessage = ({
  actionDetails,
  intl,
  totalVestingShares,
  totalVestingFundSteem,
  handleNavigateToPost,
  customTheme,
}) => {
  const rewards = [
    { payout: actionDetails.sbd_payout, currency: 'SBD' },
    { payout: actionDetails.steem_payout, currency: 'STEEM' },
    { payout: actionDetails.vesting_payout, currency: 'SP' },
  ];

  const parsedRewards = _.reduce(
    rewards,
    (array, reward) => {
      const parsedPayout = parseFloat(reward.payout);

      if (parsedPayout > 0) {
        let rewardsStr;
        if (reward.currency === 'SP') {
          const vestsToSP = vestToSteem(parsedPayout, totalVestingShares, totalVestingFundSteem);
          rewardsStr = parseFloat(vestsToSP).toFixed(3);
        } else {
          rewardsStr = parseFloat(parsedPayout).toFixed(3);
        }

        array.push(`${rewardsStr} ${reward.currency}`);
      }

      return array;
    },
    [],
  );

  return (
    <StyledTextByBackground>
      {`${intl.author_reward}: `}
      {parsedRewards.join(', ')}
      {` ${actionDetails.author} - `}
      <Touchable>
        <LinkText
          customTheme={customTheme}
          onPress={handleNavigateToPost(actionDetails.author, actionDetails.permlink)}
        >
          {actionDetails.permlink}
        </LinkText>
      </Touchable>
    </StyledTextByBackground>
  );
};

AuthorRewardMessage.propTypes = {
  actionDetails: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
  customTheme: PropTypes.shape().isRequired,
  handleNavigateToPost: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(AuthorRewardMessage);
