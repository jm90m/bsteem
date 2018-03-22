import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18n/i18n';
import { FEATHER_ICONS, ICON_SIZES, COLORS } from 'constants/styles';
import PrimaryButton from 'components/common/PrimaryButton';
import { connect } from 'react-redux';
import sc2 from 'api/sc2';
import _ from 'lodash';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { getUsersDetails, getAuthUsername } from 'state/rootReducer';
import { fetchUserTransferHistory } from 'state/actions/userActivityActions';

const Container = styled.View`
  padding: 10px;
  background: ${COLORS.PRIMARY_BACKGROUND_COLOR};
  border-bottom-width: 1px;
  border-top-width: 1px;
  border-top-color: ${COLORS.PRIMARY_BORDER_COLOR};
  border-bottom-color: ${COLORS.PRIMARY_BORDER_COLOR};
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const TitleText = styled.Text`
  color: ${COLORS.SECONDARY_COLOR};
  font-weight: bold;
`;

const Content = styled.View`
  justify-content: center;
  align-items: center;
`;

const RewardContent = styled.View`
  padding: 10px;
`;

const Reward = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const RewardField = styled.Text`
  font-weight: bold;
  color: ${COLORS.SECONDARY_COLOR};
`;

const RewardValue = styled.Text`
  font-weight: bold;
  color: ${COLORS.PRIMARY_COLOR};
`;

const mapStateToProps = state => ({
  usersDetails: getUsersDetails(state),
  authUsername: getAuthUsername(state),
});

const mapDispatchToProps = dispatch => ({
  fetchUserTransferHistory: username => dispatch(fetchUserTransferHistory.action({ username })),
});

class ClaimRewardsBlock extends Component {
  static propTypes = {
    usersDetails: PropTypes.shape().isRequired,
    fetchUserTransferHistory: PropTypes.func.isRequired,
    authUsername: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      rewardClaimed: false,
    };

    this.handleClaimRewards = this.handleClaimRewards.bind(this);
    this.renderReward = this.renderReward.bind(this);
  }

  handleClaimRewards() {
    const { usersDetails, authUsername } = this.props;
    const user = _.get(usersDetails, authUsername, {});
    const {
      reward_steem_balance: steemBalance,
      reward_sbd_balance: sbdBalance,
      reward_vesting_balance: vestingBalance,
    } = user;

    this.setState({
      loading: true,
    });

    sc2.claimRewardBalance(authUsername, steemBalance, sbdBalance, vestingBalance, err => {
      if (!err) {
        this.setState({
          loading: false,
          rewardClaimed: true,
        });
        this.props.fetchUserTransferHistory(authUsername);
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  }

  renderReward(value, currency, rewardField) {
    return (
      <Reward>
        <RewardField>{`${rewardField}:`}</RewardField>
        <RewardValue>{` ${parseFloat(value).toFixed(3)} ${currency}`}</RewardValue>
      </Reward>
    );
  }

  render() {
    const { usersDetails, authUsername } = this.props;
    const { rewardClaimed } = this.state;
    const user = _.get(usersDetails, authUsername, {});
    const rewardSteem = parseFloat(_.get(user, 'reward_steem_balance', 0));
    const rewardSbd = parseFloat(_.get(user, 'reward_sbd_balance', 0));
    const rewardSP = parseFloat(_.get(user, 'reward_vesting_steem', 0));
    const userHasRewards = rewardSteem > 0 || rewardSbd > 0 || rewardSP > 0;

    const buttonText = rewardClaimed ? i18n.user.rewardClaimed : i18n.user.claimRewards;

    if (!userHasRewards) return null;

    return (
      <Container>
        <TitleContainer>
          <Feather
            name={FEATHER_ICONS.award}
            size={ICON_SIZES.contentTitleBlockIcon}
            color={COLORS.SECONDARY_COLOR}
          />
          <TitleText>{i18n.titles.rewards}</TitleText>
        </TitleContainer>
        <Content>
          {!rewardClaimed && (
            <RewardContent>
              {rewardSteem > 0 && this.renderReward(rewardSteem, 'STEEM', 'Steem')}
              {rewardSbd > 0 && this.renderReward(rewardSbd, 'SBD', 'Steem Dollar')}
              {rewardSP > 0 && this.renderReward(rewardSP, 'SP', 'Steem Power')}
            </RewardContent>
          )}
          <PrimaryButton
            title={buttonText}
            disabled={rewardClaimed}
            onPress={this.handleClaimRewards}
            loading={this.state.loading}
          />
        </Content>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimRewardsBlock);
