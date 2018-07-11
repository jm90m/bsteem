import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import * as navigationConstants from 'constants/navigation';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import PrimaryText from 'components/common/text/PrimaryText';

const Container = styled(StyledTextByBackground)`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const LinkText = styled(PrimaryText)`
  color: ${props => props.customTheme.primaryColor}
  margin-right: 5px;
`;

const VoteWeight = styled(StyledTextByBackground)`
  margin-right: 5px;
`;

const CurrentUserVote = styled(StyledTextByBackground)`
  margin-right: 5px;
`;

const VoteMessageContainer = styled(PrimaryText)`
  flex-direction: row;
`;

const Touchable = styled.TouchableWithoutFeedback``;

const VoteActionMessage = ({ actionDetails, currentUsername, navigation, customTheme }) => {
  const { author, permlink } = actionDetails;
  let voteType = 'unvoted';
  const voteWeightValue = parseFloat(Math.abs(actionDetails.weight) / 10000 * 100).toFixed(0);
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
              navigation.push(navigationConstants.USER, {
                username: actionDetails.voter,
              })
            }
          >
            <LinkText customTheme={customTheme}>{actionDetails.voter}</LinkText>
          </Touchable>
          <StyledTextByBackground>{` ${voteType} `}</StyledTextByBackground>
        </VoteMessageContainer>
      )}
      {actionDetails.weight === 0 ? null : voteWeight}
      <Touchable onPress={() => navigation.push(navigationConstants.USER, { username: author })}>
        <LinkText customTheme={customTheme}>{` ${author} `}</LinkText>
      </Touchable>
      <Touchable
        onPress={() =>
          navigation.push(navigationConstants.POST, {
            author,
            permlink,
          })
        }
      >
        <LinkText customTheme={customTheme}>{`(${permlink})`}</LinkText>
      </Touchable>
    </Container>
  );
};

VoteActionMessage.propTypes = {
  actionDetails: PropTypes.shape().isRequired,
  currentUsername: PropTypes.string.isRequired,
  navigation: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(VoteActionMessage);
