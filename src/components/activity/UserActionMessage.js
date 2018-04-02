import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';
import * as accountHistoryConstants from 'constants/accountHistory';
import * as navigationConstants from 'constants/navigation';
import _ from 'lodash';
import { COLORS } from 'constants/styles';
import i18n from 'i18n/i18n';
import CustomJSONMessage from './CustomJSONMessage';
import VoteActionMessage from './VoteActionMessage';

const Container = styled.View`
  padding-left: 10px;
`;

const Touchable = styled.TouchableWithoutFeedback``;

const LinkText = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
`;

const BoldText = styled.Text`
  font-weight: bold;
`;

class UserActionMessage extends Component {
  static propTypes = {
    actionType: PropTypes.string.isRequired,
    actionDetails: PropTypes.shape().isRequired,
    // totalVestingShares: PropTypes.string.isRequired,
    // totalVestingFundSteem: PropTypes.string.isRequired,
    currentUsername: PropTypes.string.isRequired,
    navigation: PropTypes.shape().isRequired,
  };

  handleNavigateToUser = username => () => {
    this.props.navigation.navigate(navigationConstants.USER, { username });
  };

  handleNavigateToPost = (author, permlink) => () => {
    this.props.navigation.navigate(navigationConstants.FETCH_POST, { author, permlink });
  };

  renderFormattedMessage() {
    const { actionType, actionDetails, currentUsername, navigation } = this.props;

    switch (actionType) {
      case accountHistoryConstants.ACCOUNT_CREATE_WITH_DELEGATION: {
        const { creator } = actionDetails;
        const account = actionDetails.new_account_name;
        return (
          <View>
            <Touchable onPress={this.handleNavigateToUser(creator)}>
              <LinkText>{creator}</LinkText>
            </Touchable>
            <Text>{` ${i18n.activity.createAccountWithDelegation} `}</Text>
            <Touchable onPress={this.handleNavigateToUser(account)}>{account}</Touchable>
          </View>
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
            <LinkText>{actionDetails.author}</LinkText>
          </Touchable>
        ) : (
          <Touchable onPress={this.handleNavigateToUser(actionDetails.parent_author)}>
            <LinkText>{actionDetails.parent_author}</LinkText>
          </Touchable>
        );
        const postLink = _.isEmpty(actionDetails.parent_author) ? (
          <Touchable
            onPress={this.handleNavigateToPost(actionDetails.author, actionDetails.permlink)}
          >
            <LinkText>{actionDetails.permlink}</LinkText>
          </Touchable>
        ) : (
          <Touchable
            onPress={this.handleNavigateToPost(
              actionDetails.parent_author,
              actionDetails.parent_permlink,
            )}
          >
            <LinkText>{actionDetails.parent_permlink}</LinkText>
          </Touchable>
        );
        if (currentUsername === actionDetails.author) {
          return (
            <View>
              <BoldText>
                {i18n.activity.repliedTo} {author} ({postLink})
              </BoldText>
            </View>
          );
        }
        const otherUser = (
          <Touchable onPress={this.handleNavigateToUser(actionDetails.author)}>
            <LinkText>{actionDetails.author}</LinkText>
          </Touchable>
        );
        return (
          <View>
            <BoldText>
              {otherUser} {i18n.activity.repliedTo} {author} ({postLink})
            </BoldText>
          </View>
        );
      }
      default:
        return (
          <View>
            <Text>{actionType}</Text>
          </View>
        );
    }
  }

  render() {
    return <Container>{this.renderFormattedMessage()}</Container>;
  }
}
export default UserActionMessage;
