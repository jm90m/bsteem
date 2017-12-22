import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import _ from 'lodash';
import * as accountHistoryConstants from 'constants/accountHistory';
import * as navigationConstants from 'constants/navigation';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const Touchable = styled.TouchableOpacity`
  padding-right: 10px;
`;

const LinkText = styled.Text`
  color: ${COLORS.BLUE.MARINER}
  font-weight: bold;
  margin-right: 5px;
`;

const CustomJSONMessage = ({ actionDetails, currentUsername, navigation }) => {
  const actionJSON = JSON.parse(actionDetails.json);
  const customActionType = actionJSON[0];
  const customActionDetails = actionJSON[1];

  if (customActionType === accountHistoryConstants.FOLLOW) {
    const followAction = _.isEmpty(customActionDetails.what) ? 'unfollowed' : 'followed';

    if (currentUsername === customActionDetails.follower) {
      const { following } = customActionDetails;
      return (
        <Container>
          <Text>{`${followAction} `}</Text>
          <Touchable
            onPress={() =>
              navigation.navigate(navigationConstants.USER, {
                username: following,
              })}
          >
            <LinkText>{following}</LinkText>
          </Touchable>
        </Container>
      );
    }

    return (
      <Container>
        <Touchable
          onPress={() =>
            navigation.navigate(navigationConstants.USER, {
              username: customActionDetails.follower,
            })}
        >
          <LinkText>{customActionDetails.follower}</LinkText>
        </Touchable>
        <Text>{` ${followAction} `}</Text>
        <Touchable
          onPress={() =>
            navigation.navigate(navigationConstants.USER, {
              username: customActionDetails.following,
            })}
        >
          <LinkText>{customActionDetails.following}</LinkText>
        </Touchable>
      </Container>
    );
  } else if (customActionType === accountHistoryConstants.REBLOG) {
    return (
      <Container>
        <Text>{'reblogged '}</Text>
        <Touchable onPress={() => {}}>
          <LinkText>
            {`@${customActionDetails.author}/${customActionDetails.permlink}`}
          </LinkText>
        </Touchable>
      </Container>
    );
  }
  return null;
};

CustomJSONMessage.propTypes = {
  actionDetails: PropTypes.shape().isRequired,
  currentUsername: PropTypes.string.isRequired,
  navigation: PropTypes.shape().isRequired,
};

export default CustomJSONMessage;
