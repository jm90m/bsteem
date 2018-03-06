import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import _ from 'lodash';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { getVoteValue } from 'util/userUtils';
import { calculateVotingPower } from 'util/steemitUtils';
import { getReputation } from 'util/steemitFormatters';
import {
  getUsersDetails,
  getUsersFollowCount,
  getIsAuthenticated,
  getAuthUsername,
  getRewardFund,
  getSteemRate,
} from 'state/rootReducer';
import UserProfile from 'components/user/user-profile/UserProfile';
import * as navigationConstants from 'constants/navigation';
import { COLORS } from 'constants/styles';
import i18n from 'i18n/i18n';
import SaveUserButton from 'components/common/SaveUserButton';
import UserStats from './UserStats';
import UserCover from './UserCover';
import UserFollowButton from './UserFollowButton';

const SaveUserButtonContainer = styled.View`
  padding-right: 10px;
`;

const ActionButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  background-color: ${COLORS.WHITE.WHITE};
  align-items: center;
`;

const mapStateToProps = state => ({
  usersDetails: getUsersDetails(state),
  usersFollowCount: getUsersFollowCount(state),
  authenticated: getIsAuthenticated(state),
  authUsername: getAuthUsername(state),
  rewardFund: getRewardFund(state),
  steemRate: getSteemRate(state),
});

const VoteText = styled.Text`
  color: ${COLORS.GREY.CHARCOAL};
`;

const VoteContainer = styled.View`
  padding: 5px 10px;
  background-color: ${COLORS.WHITE.WHITE};
`;

@connect(mapStateToProps)
class UserHeader extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    authUsername: PropTypes.string,
    usersDetails: PropTypes.shape().isRequired,
    usersFollowCount: PropTypes.shape().isRequired,
    hideFollowButton: PropTypes.bool,
    authenticated: PropTypes.bool,
    navigation: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    authUsername: '',
    authenticated: false,
    hideFollowButton: false,
  };

  constructor(props) {
    super(props);
    this.handleOnPressFollowers = this.handleOnPressFollowers.bind(this);
    this.handleOnPressFollowing = this.handleOnPressFollowing.bind(this);
  }

  handleOnPressFollowers() {
    const { username } = this.props;
    this.props.navigation.navigate(navigationConstants.USER_FOLLOWERS, { username });
  }

  handleOnPressFollowing() {
    const { username } = this.props;
    this.props.navigation.navigate(navigationConstants.USER_FOLLOWING, { username });
  }

  renderActionButtons() {
    const { hideFollowButton, username, authenticated, authUsername } = this.props;
    const isAuthUser = authUsername === username;
    const hideActions = hideFollowButton || isAuthUser;

    if (hideActions) return <View />;

    return (
      <ActionButtonsContainer>
        <UserFollowButton username={username} />
        <SaveUserButtonContainer>
          <SaveUserButton username={username} />
        </SaveUserButtonContainer>
      </ActionButtonsContainer>
    );
  }

  render() {
    const { usersDetails, username, usersFollowCount, rewardFund, steemRate } = this.props;
    const userDetails = usersDetails[username] || {};
    const userJsonMetaData = _.attempt(JSON.parse, userDetails.json_metadata);
    const userProfile = _.isError(userJsonMetaData) ? {} : userJsonMetaData.profile;
    const hasCover = _.has(userProfile, 'cover_image');
    const userReputation = _.has(userDetails, 'reputation')
      ? getReputation(userDetails.reputation)
      : 0;
    const userFollowCount = usersFollowCount[username];
    const followerCount = _.get(userFollowCount, 'follower_count', 0);
    const followingCount = _.get(userFollowCount, 'following_count', 0);
    const postCount = _.get(userDetails, 'post_count', 0);
    const voteWorth = getVoteValue(
      userDetails,
      _.get(rewardFund, 'recent_claims'),
      _.get(rewardFund, 'reward_balance'),
      steemRate,
      10000,
    );
    const votingPower = calculateVotingPower(userDetails);
    const formattedVotingPower = parseFloat(votingPower * 100).toFixed(0);
    const voteWorthText = `${i18n.user.voteValue}: $${
      _.isNaN(voteWorth) ? 0 : parseFloat(voteWorth).toFixed(2)
    }`;
    const votePowerText = `${i18n.user.votingPower}: ${formattedVotingPower}%`;

    return (
      <View>
        <UserCover username={username} hasCover={hasCover} userReputation={userReputation} />
        {this.renderActionButtons()}
        <UserProfile userProfile={userProfile} userDetails={userDetails} />
        <VoteContainer>
          <VoteText>{voteWorthText}</VoteText>
          <VoteText>{votePowerText}</VoteText>
        </VoteContainer>
        <UserStats
          postCount={postCount}
          followerCount={followerCount}
          followingCount={followingCount}
          onPressFollowers={this.handleOnPressFollowers}
          onPressFollowing={this.handleOnPressFollowing}
        />
      </View>
    );
  }
}

export default UserHeader;
