import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';
import * as accountHistoryConstants from 'constants/accountHistory';
import * as navigationConstants from 'constants/navigation';
import { COLORS } from 'constants/styles';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const LinkText = styled.Text`
  color: ${COLORS.PRIMARY_COLOR}
  font-weight: bold;
  margin-right: 5px;
`;

const VoteWeight = styled.Text`
  font-weight: bold;
  margin-right: 5px;
`;

const CurrentUserVote = styled.Text`
  font-weight: bold;
  margin-right: 5px;
`;

const VoteMessageContainer = styled.View`
  flex-direction: row;
`;

const Touchable = styled.TouchableOpacity`
`;

const VoteActionMessage = ({ actionDetails, currentUsername, navigation }) => {
  const postLink = `@${actionDetails.author}/${actionDetails.permlink}`;
  let voteType = 'unvoted';
  const voteWeightValue = Math.abs(actionDetails.weight) / 10000 * 100;
  const voteWeight = (
    <VoteWeight>
      {`(${voteWeightValue}%)`}
    </VoteWeight>
  );

  if (actionDetails.weight > 0) {
    voteType = 'upvoted';
  } else if (actionDetails.weight < 0) {
    voteType = 'downvoted';
  }

  return (
    <Container>
      {currentUsername === actionDetails.voter
        ? <CurrentUserVote>
            {voteType}
          </CurrentUserVote>
        : <VoteMessageContainer>
            <Touchable
              onPress={() =>
                navigation.navigate(navigationConstants.USER, {
                  username: actionDetails.voter,
                })}
            >
              <LinkText>{actionDetails.voter}</LinkText>
            </Touchable>
            <Text>{` ${voteType} `}</Text>
          </VoteMessageContainer>}
      {actionDetails.weight === 0 ? null : voteWeight}
      <Touchable
        onPress={() =>
          navigation.navigate(navigationConstants.USER, { username: actionDetails.author })}
      >
        <LinkText>{actionDetails.author}</LinkText>
      </Touchable>
      <LinkText>{`(${actionDetails.permlink})`}</LinkText>
    </Container>
  );
};

VoteActionMessage.propTypes = {
  actionDetails: PropTypes.shape().isRequired,
  currentUsername: PropTypes.string.isRequired,
  navigation: PropTypes.shape().isRequired,
};

export default VoteActionMessage;
