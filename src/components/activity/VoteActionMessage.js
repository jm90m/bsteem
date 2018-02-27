import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';
import * as accountHistoryConstants from 'constants/accountHistory';
import * as navigationConstants from 'constants/navigation';
import { COLORS } from 'constants/styles';

const Container = styled.Text`
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

const VoteMessageContainer = styled.Text`
  flex-direction: row;
`;

const Touchable = styled.TouchableWithoutFeedback``;

const VoteActionMessage = ({ actionDetails, currentUsername, navigation }) => {
  const { author, permlink } = actionDetails;
  let voteType = 'unvoted';
  const voteWeightValue = Math.abs(actionDetails.weight) / 10000 * 100;
  const voteWeight = <VoteWeight>{` (${voteWeightValue}%) `}</VoteWeight>;

  if (actionDetails.weight > 0) {
    voteType = 'upvoted';
  } else if (actionDetails.weight < 0) {
    voteType = 'downvoted';
  }

  return (
    <Container>
      {currentUsername === actionDetails.voter ? (
        <CurrentUserVote>{voteType}</CurrentUserVote>
      ) : (
        <VoteMessageContainer>
          <Touchable
            onPress={() =>
              navigation.navigate(navigationConstants.USER, {
                username: actionDetails.voter,
              })
            }
          >
            <LinkText>{actionDetails.voter}</LinkText>
          </Touchable>
          <Text>{` ${voteType} `}</Text>
        </VoteMessageContainer>
      )}
      {actionDetails.weight === 0 ? null : voteWeight}
      <Touchable
        onPress={() => navigation.navigate(navigationConstants.USER, { username: author })}
      >
        <LinkText>{` ${author} `}</LinkText>
      </Touchable>
      <Touchable
        onPress={() =>
          navigation.navigate(navigationConstants.FETCH_POST, {
            author,
            permlink,
          })
        }
      >
        <LinkText>{`(${permlink})`}</LinkText>
      </Touchable>
    </Container>
  );
};

VoteActionMessage.propTypes = {
  actionDetails: PropTypes.shape().isRequired,
  currentUsername: PropTypes.string.isRequired,
  navigation: PropTypes.shape().isRequired,
};

export default VoteActionMessage;
