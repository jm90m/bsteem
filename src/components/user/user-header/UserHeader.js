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
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import UserProfile from 'components/user/user-profile/UserProfile';
import * as navigationConstants from 'constants/navigation';
import { COLORS, MATERIAL_ICONS, FONT_AWESOME_ICONS, ICON_SIZES } from 'constants/styles';
import SaveUserButton from 'components/common/SaveUserButton';
import { getUserDetailsHelper } from 'util/bsteemUtils';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import PrimaryText from 'components/common/text/PrimaryText';
import tinycolor from 'tinycolor2';
import UserStats from './UserStats';
import UserCover from './UserCover';
import UserFollowButton from './UserFollowButton';

const Container = styled.View`
  border-top-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
`;
const SaveUserButtonContainer = styled.View`
  padding-right: 10px;
`;

const ActionButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  align-items: center;
`;

const VoteText = styled(PrimaryText)`
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
  margin-left: 5px;
`;

const VoteContentContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: 5px;
`;

const VoteContainer = styled.View`
  padding: 0 10px;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

const SendMessageContainer = styled.View`
  padding: 10px 16px;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  flex-direction: row;
`;

const SendMessageText = styled(PrimaryText)`
  color: ${props => props.customTheme.primaryColor};
  margin-left: 5px;
`;

const mapStateToProps = state => ({
  usersDetails: getUsersDetails(state),
  usersFollowCount: getUsersFollowCount(state),
  authenticated: getIsAuthenticated(state),
  authUsername: getAuthUsername(state),
  rewardFund: getRewardFund(state),
  steemRate: getSteemRate(state),
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

@connect(mapStateToProps)
class UserHeader extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
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
    this.props.navigation.push(navigationConstants.USER_FOLLOWERS, { username });
  }

  handleOnPressFollowing() {
    const { username } = this.props;
    this.props.navigation.push(navigationConstants.USER_FOLLOWING, { username });
  }

  handleNavigateToUserMessage() {
    const { username } = this.props;
    this.props.navigation.push(navigationConstants.USER_MESSAGE, { username });
  }

  renderActionButtons() {
    const { hideFollowButton, username, authUsername, customTheme } = this.props;
    const isAuthUser = authUsername === username;
    const hideActions = hideFollowButton || isAuthUser;

    if (hideActions) return <View />;

    return (
      <ActionButtonsContainer customTheme={customTheme}>
        <UserFollowButton username={username} />
        <SaveUserButtonContainer>
          <SaveUserButton username={username} />
        </SaveUserButtonContainer>
      </ActionButtonsContainer>
    );
  }

  renderSendMessage() {
    const { authenticated, authUsername, customTheme, intl } = this.props;
    const { username } = this.props;
    const isNotCurrentUser = username !== authUsername;
    if (authenticated && isNotCurrentUser) {
      return (
        <TouchableWithoutFeedback onPress={this.handleNavigateToUserMessage}>
          <SendMessageContainer customTheme={customTheme}>
            <FontAwesome
              name={FONT_AWESOME_ICONS.sendMessage}
              color={customTheme.primaryColor}
              size={15}
            />
            <SendMessageText customTheme={customTheme}>{intl.send_message}</SendMessageText>
          </SendMessageContainer>
        </TouchableWithoutFeedback>
      );
    }
    return null;
  }

  render() {
    const {
      usersDetails,
      username,
      usersFollowCount,
      rewardFund,
      steemRate,
      customTheme,
      intl,
    } = this.props;
    const userDetails = getUserDetailsHelper(usersDetails, username, {});
    const userJsonMetaData = _.attempt(JSON.parse, userDetails.json_metadata);
    const userProfile = _.isError(userJsonMetaData) ? {} : userJsonMetaData.profile;
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
    const voteWorthText = `${intl.vote_value}: $${
      _.isNaN(voteWorth) ? 0 : parseFloat(voteWorth).toFixed(2)
    }`;
    const votePowerText = `${intl.voting_power}: ${formattedVotingPower}%`;
    const iconColor = tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;

    return (
      <Container customTheme={customTheme}>
        <UserCover username={username} userReputation={userReputation} userProfile={userProfile} />
        {this.renderActionButtons()}
        <UserProfile userProfile={userProfile} userDetails={userDetails} />
        <VoteContainer customTheme={customTheme}>
          <VoteContentContainer>
            <MaterialIcons
              name={MATERIAL_ICONS.money}
              size={ICON_SIZES.userHeaderIcon}
              color={iconColor}
            />
            <VoteText customTheme={customTheme}>{voteWorthText}</VoteText>
          </VoteContentContainer>
          <VoteContentContainer>
            <MaterialIcons
              name={MATERIAL_ICONS.flashOn}
              size={ICON_SIZES.userHeaderIcon}
              color={iconColor}
            />
            <VoteText customTheme={customTheme}>{votePowerText}</VoteText>
          </VoteContentContainer>
        </VoteContainer>
        {this.renderSendMessage()}
        <UserStats
          postCount={postCount}
          followerCount={followerCount}
          followingCount={followingCount}
          onPressFollowers={this.handleOnPressFollowers}
          onPressFollowing={this.handleOnPressFollowing}
          customTheme={customTheme}
          intl={intl}
        />
      </Container>
    );
  }
}

export default UserHeader;
