import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import _ from 'lodash';
import { View, TouchableWithoutFeedback } from 'react-native';
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
import { COLORS, MATERIAL_ICONS, FONT_AWESOME_ICONS, ICON_SIZES } from 'constants/styles';
import i18n from 'i18n/i18n';
import SaveUserButton from 'components/common/SaveUserButton';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import UserStats from './UserStats';
import UserCover from './UserCover';
import UserFollowButton from './UserFollowButton';

const Container = styled.View`
  margin-bottom: 5px;
  border-width: 1px;
  border-color: ${COLORS.PRIMARY_BORDER_COLOR};
`;
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

const VoteText = styled.Text`
  color: ${COLORS.GREY.CHARCOAL};
  margin-left: 5px;
`;

const VoteContentContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: 5px;
`;

const VoteContainer = styled.View`
  padding: 0 10px;
  background-color: ${COLORS.WHITE.WHITE};
`;

const SendMessageContainer = styled.View`
  padding: 10px 16px;
  background-color: ${COLORS.PRIMARY_BACKGROUND_COLOR};
  flex-direction: row;
`;

const SendMessageText = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  margin-left: 5px;
`;

const mapStateToProps = state => ({
  usersDetails: getUsersDetails(state),
  usersFollowCount: getUsersFollowCount(state),
  authenticated: getIsAuthenticated(state),
  authUsername: getAuthUsername(state),
  rewardFund: getRewardFund(state),
  steemRate: getSteemRate(state),
});

@connect(mapStateToProps)
class UserHeader extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    authUsername: PropTypes.string,
    usersDetails: PropTypes.shape().isRequired,
    usersFollowCount: PropTypes.shape().isRequired,
    hideFollowButton: PropTypes.bool,
    navigation: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    authUsername: '',
    hideFollowButton: false,
  };

  constructor(props) {
    super(props);
    this.handleOnPressFollowers = this.handleOnPressFollowers.bind(this);
    this.handleOnPressFollowing = this.handleOnPressFollowing.bind(this);
    this.handleNavigateToUserMessage = this.handleNavigateToUserMessage.bind(this);
  }

  handleOnPressFollowers() {
    const { username } = this.props;
    this.props.navigation.navigate(navigationConstants.USER_FOLLOWERS, { username });
  }

  handleOnPressFollowing() {
    const { username } = this.props;
    this.props.navigation.navigate(navigationConstants.USER_FOLLOWING, { username });
  }

  handleNavigateToUserMessage() {
    const { username } = this.props;
    this.props.navigation.navigate(navigationConstants.USER_MESSAGE, { username });
  }

  renderActionButtons() {
    const { hideFollowButton, username, authUsername } = this.props;
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

  renderSendMessage() {
    const { authenticated, authUsername } = this.props;
    const { username } = this.props;
    const isNotCurrentUser = username !== authUsername;
    if (authenticated && isNotCurrentUser) {
      return (
        <TouchableWithoutFeedback onPress={this.handleNavigateToUserMessage}>
          <SendMessageContainer>
            <FontAwesome
              name={FONT_AWESOME_ICONS.sendMessage}
              color={COLORS.PRIMARY_COLOR}
              size={15}
            />
            <SendMessageText>{i18n.messages.sendMessage}</SendMessageText>
          </SendMessageContainer>
        </TouchableWithoutFeedback>
      );
    }
    return null;
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
    const votingPowerPercent = votingPower * 100;
    const formattedVotingPower = _.isNaN(votingPowerPercent)
      ? 0
      : parseFloat(votingPowerPercent).toFixed(0);
    const voteWorthText = `${i18n.user.voteValue}: $${
      _.isNaN(voteWorth) ? 0 : parseFloat(voteWorth).toFixed(2)
    }`;
    const votePowerText = `${i18n.user.votingPower}: ${formattedVotingPower}%`;

    return (
      <Container>
        <UserCover
          username={username}
          hasCover={hasCover}
          userReputation={userReputation}
          userProfile={userProfile}
        />
        {this.renderActionButtons()}
        <UserProfile userProfile={userProfile} userDetails={userDetails} />
        <VoteContainer>
          <VoteContentContainer>
            <MaterialIcons
              name={MATERIAL_ICONS.money}
              size={ICON_SIZES.userHeaderIcon}
              color={COLORS.GREY.CHARCOAL}
            />
            <VoteText>{voteWorthText}</VoteText>
          </VoteContentContainer>
          <VoteContentContainer>
            <MaterialIcons
              name={MATERIAL_ICONS.flashOn}
              size={ICON_SIZES.userHeaderIcon}
              color={COLORS.GREY.CHARCOAL}
            />
            <VoteText>{votePowerText}</VoteText>
          </VoteContentContainer>
        </VoteContainer>
        {this.renderSendMessage()}
        <UserStats
          postCount={postCount}
          followerCount={followerCount}
          followingCount={followingCount}
          onPressFollowers={this.handleOnPressFollowers}
          onPressFollowing={this.handleOnPressFollowing}
        />
      </Container>
    );
  }
}

export default UserHeader;
