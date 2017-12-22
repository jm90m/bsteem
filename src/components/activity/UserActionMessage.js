import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';
import * as accountHistoryConstants from 'constants/accountHistory';
import * as navigationConstants from 'constants/navigation';
import { COLORS } from 'constants/styles';
import CustomJSONMessage from './CustomJSONMessage';
import VoteActionMessage from './VoteActionMessage';

const Container = styled.View`
  padding-left: 10px;
`;

const Touchable = styled.TouchableOpacity``;

const Username = styled.Text`
  color: ${COLORS.BLUE.MARINER}
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

  handleNavigateToUser(username) {
    this.props.navigation.navigate(navigationConstants.USER, { username });
  }

  renderFormattedMessage() {
    const { actionType, actionDetails, currentUsername, navigation } = this.props;

    switch (actionType) {
      case accountHistoryConstants.ACCOUNT_CREATE_WITH_DELEGATION: {
        const { creator } = actionDetails;
        const account = actionDetails.new_account_name;
        return (
          <View>
            <Touchable onPress={() => this.handleNavigateToUser(creator)}>
              <Username>{creator}</Username>
            </Touchable>
            <Text>
              {' created account with delegation '}
            </Text>
            <Touchable onPress={() => this.handleNavigateToUser(account)}>
              {account}
            </Touchable>
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
      default:
        return (
          <View>
            <Text>{actionType}</Text>
          </View>
        );
    }
  }

  render() {
    return (
      <Container>
        {this.renderFormattedMessage()}
      </Container>
    );
  }
}
export default UserActionMessage;
