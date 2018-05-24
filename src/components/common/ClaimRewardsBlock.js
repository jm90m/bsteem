import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FEATHER_ICONS, ICON_SIZES } from 'constants/styles';
import PrimaryButton from 'components/common/PrimaryButton';
import { connect } from 'react-redux';
import sc2 from 'api/sc2';
import _ from 'lodash';
import { Feather } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { getUsersDetails, getAuthUsername, getCustomTheme, getIntl } from 'state/rootReducer';
import { fetchUserTransferHistory } from 'state/actions/userActivityActions';
import { fetchUser } from 'state/actions/usersActions';
import TitleText from 'components/common/TitleText';

const Container = styled.View`
  padding: 10px;
  background: ${props => props.customTheme.primaryBackgroundColor};
  border-bottom-width: 1px;
  border-top-width: 1px;
  border-top-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const Content = styled.View`
  justify-content: center;
  align-items: center;
`;

const RewardContent = styled.View`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
`;

const Reward = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const RewardField = styled.Text`
  font-weight: bold;
  color: ${props => props.customTheme.secondaryColor};
`;

const RewardValue = styled.Text`
  font-weight: bold;
  color: ${props => props.customTheme.primaryColor};
`;

const mapStateToProps = state => ({
  usersDetails: getUsersDetails(state),
  authUsername: getAuthUsername(state),
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  fetchUserTransferHistory: username => dispatch(fetchUserTransferHistory.action({ username })),
  fetchUser: username => dispatch(fetchUser.action({ username })),
});

class ClaimRewardsBlock extends Component {
  static propTypes = {
    usersDetails: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    fetchUserTransferHistory: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
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
        this.props.fetchUser(authUsername);
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  }

  renderReward(value, currency, rewardField) {
    const { customTheme } = this.props;
    return (
      <Reward>
        <RewardField customTheme={customTheme}>{`${rewardField}:`}</RewardField>
        <RewardValue customTheme={customTheme}>
          {` ${parseFloat(value).toFixed(3)} ${currency}`}
        </RewardValue>
      </Reward>
    );
  }

  render() {
    const { usersDetails, authUsername, customTheme, intl } = this.props;
    const { rewardClaimed } = this.state;
    const user = _.get(usersDetails, authUsername, {});
    const rewardSteem = parseFloat(_.get(user, 'reward_steem_balance', 0));
    const rewardSbd = parseFloat(_.get(user, 'reward_sbd_balance', 0));
    const rewardSP = parseFloat(_.get(user, 'reward_vesting_steem', 0));
    const userHasRewards = rewardSteem > 0 || rewardSbd > 0 || rewardSP > 0;

    const buttonText = rewardClaimed ? intl.reward_claimed : intl.claim_rewards;

    if (!userHasRewards) return null;

    return (
      <Container customTheme={customTheme}>
        <TitleContainer>
          <Feather
            name={FEATHER_ICONS.award}
            size={ICON_SIZES.contentTitleBlockIcon}
            color={customTheme.secondaryColor}
          />
          <TitleText>{intl.rewards}</TitleText>
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
