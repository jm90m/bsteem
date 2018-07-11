import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View } from 'react-native';
import * as accountHistoryConstants from 'constants/accountHistory';
import * as navigationConstants from 'constants/navigation';
import _ from 'lodash';
import PrimaryColorText from 'components/common/PrimaryColorText';
import { connect } from 'react-redux';
import { getIntl } from 'state/rootReducer';
import { vestToSteem } from 'util/steemitFormatters';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import CustomJSONMessage from './CustomJSONMessage';
import VoteActionMessage from './VoteActionMessage';
import AuthorRewardMessage from './AuthorRewardMessage';

const Container = styled.View`
  padding-left: 10px;
`;

const Touchable = styled.TouchableWithoutFeedback``;

const BoldText = styled(StyledTextByBackground)``;

const mapStateToProps = state => ({
  intl: getIntl(state),
});

class UserActionMessage extends Component {
  static propTypes = {
    actionType: PropTypes.string.isRequired,
    actionDetails: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    currentUsername: PropTypes.string.isRequired,
    navigation: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  handleNavigateToUser = username => () => {
    this.props.navigation.push(navigationConstants.USER, { username });
  };

  handleNavigateToPost = (author, permlink) => () => {
    this.props.navigation.push(navigationConstants.POST, { author, permlink });
  };

  renderFormattedMessage() {
    const {
      actionType,
      actionDetails,
      currentUsername,
      navigation,
      intl,
      totalVestingShares,
      totalVestingFundSteem,
    } = this.props;

    switch (actionType) {
      case accountHistoryConstants.ACCOUNT_CREATE_WITH_DELEGATION: {
        const { creator } = actionDetails;
        const account = actionDetails.new_account_name;
        return (
          <BoldText>
            <Touchable onPress={this.handleNavigateToUser(creator)}>
              <PrimaryColorText>{creator}</PrimaryColorText>
            </Touchable>
            <StyledTextByBackground>{` ${
              intl.create_account_with_delegation
            } `}</StyledTextByBackground>
            <Touchable onPress={this.handleNavigateToUser(account)}>
              <PrimaryColorText>{account}</PrimaryColorText>
            </Touchable>
          </BoldText>
        );
      }
      case accountHistoryConstants.CUSTOM_JSON:
        return (
          <CustomJSONMessage
            actionDetails={actionDetails}
            currentUsername={currentUsername}
            navigation={navigation}
          />
        );
      case accountHistoryConstants.VOTE:
        return (
          <VoteActionMessage
            actionDetails={actionDetails}
            currentUsername={currentUsername}
            navigation={navigation}
          />
        );
      case accountHistoryConstants.COMMENT: {
        const author = _.isEmpty(actionDetails.parent_author) ? (
          <Touchable onPress={this.handleNavigateToUser(actionDetails.author)}>
            <PrimaryColorText>{actionDetails.author}</PrimaryColorText>
          </Touchable>
        ) : (
          <Touchable onPress={this.handleNavigateToUser(actionDetails.parent_author)}>
            <PrimaryColorText>{actionDetails.parent_author}</PrimaryColorText>
          </Touchable>
        );
        const postLink = _.isEmpty(actionDetails.parent_author) ? (
          <Touchable
            onPress={this.handleNavigateToPost(actionDetails.author, actionDetails.permlink)}
          >
            <PrimaryColorText>{actionDetails.permlink}</PrimaryColorText>
          </Touchable>
        ) : (
          <Touchable
            onPress={this.handleNavigateToPost(
              actionDetails.parent_author,
              actionDetails.parent_permlink,
            )}
          >
            <PrimaryColorText>{actionDetails.parent_permlink}</PrimaryColorText>
          </Touchable>
        );
        if (currentUsername === actionDetails.author) {
          return (
            <View>
              <BoldText>
                {intl.replied_to} {author} ({postLink})
              </BoldText>
            </View>
          );
        }
        const otherUser = (
          <Touchable onPress={this.handleNavigateToUser(actionDetails.author)}>
            <PrimaryColorText>{actionDetails.author}</PrimaryColorText>
          </Touchable>
        );
        return (
          <View>
            <BoldText>
              {otherUser} {intl.replied_to} {author} ({postLink})
            </BoldText>
          </View>
        );
      }
      case accountHistoryConstants.CURATION_REWARD: {
        const steemPower = parseFloat(
          vestToSteem(actionDetails.reward, totalVestingShares, totalVestingFundSteem),
        ).toFixed(3);
        return (
          <BoldText>
            {`${intl.curation_reward_for} `}
            {`${steemPower} SP`}
            <Touchable onPress={this.handleNavigateToUser(actionDetails.comment_author)}>
              <PrimaryColorText>{` ${actionDetails.comment_author} `}</PrimaryColorText>
            </Touchable>
            <Touchable
              onPress={this.handleNavigateToPost(
                actionDetails.comment_author,
                actionDetails.comment_permlink,
              )}
            >
              <PrimaryColorText>({actionDetails.comment_permlink})</PrimaryColorText>
            </Touchable>
          </BoldText>
        );
      }
      case accountHistoryConstants.AUTHOR_REWARD:
        return (
          <AuthorRewardMessage
            actionDetails={actionDetails}
            totalVestingShares={totalVestingShares}
            totalVestingFundSteem={totalVestingFundSteem}
            handleNavigateToPost={this.handleNavigateToPost}
          />
        );
      default:
        return (
          <View>
            <StyledTextByBackground>{actionType}</StyledTextByBackground>
          </View>
        );
    }
  }

  render() {
    return <Container>{this.renderFormattedMessage()}</Container>;
  }
}

export default connect(mapStateToProps)(UserActionMessage);
