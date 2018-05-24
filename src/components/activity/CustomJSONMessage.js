import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as accountHistoryConstants from 'constants/accountHistory';
import * as navigationConstants from 'constants/navigation';
import styled from 'styled-components/native';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import { connect } from 'react-redux';
import { getCustomTheme, getIntl } from 'state/rootReducer';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const Touchable = styled.TouchableWithoutFeedback`
  padding-right: 10px;
`;

const LinkText = styled.Text`
  color: ${props => props.customTheme.primaryColor}
  font-weight: bold;
  margin-right: 5px;
`;

const CustomJSONMessage = ({ actionDetails, currentUsername, navigation, customTheme, intl }) => {
  const actionJSON = JSON.parse(actionDetails.json);
  const customActionType = actionJSON[0];
  const customActionDetails = actionJSON[1];

  if (customActionType === accountHistoryConstants.FOLLOW) {
    const followAction = _.isEmpty(customActionDetails.what) ? intl.unfollowed : intl.followed;

    if (currentUsername === customActionDetails.follower) {
      const { following } = customActionDetails;
      return (
        <Container>
          <StyledTextByBackground>{`${followAction} `}</StyledTextByBackground>
          <Touchable
            onPress={() =>
              navigation.navigate(navigationConstants.USER, {
                username: following,
              })
            }
          >
            <LinkText customTheme={customTheme}>{following}</LinkText>
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
            })
          }
        >
          <LinkText customTheme={customTheme}>{customActionDetails.follower}</LinkText>
        </Touchable>
        <StyledTextByBackground>{` ${followAction} `}</StyledTextByBackground>
        <Touchable
          onPress={() =>
            navigation.navigate(navigationConstants.USER, {
              username: customActionDetails.following,
            })
          }
        >
          <LinkText customTheme={customTheme}>{customActionDetails.following}</LinkText>
        </Touchable>
      </Container>
    );
  } else if (customActionType === accountHistoryConstants.REBLOG) {
    return (
      <Container>
        <StyledTextByBackground>{`${intl.reblogged} `}</StyledTextByBackground>
        <Touchable
          onPress={() =>
            navigation.navigate(navigationConstants.FETCH_POST, {
              author: customActionDetails.author,
              permlink: customActionDetails.permlink,
            })
          }
        >
          <LinkText customTheme={customTheme}>{`@${customActionDetails.author}/${
            customActionDetails.permlink
          }`}</LinkText>
        </Touchable>
      </Container>
    );
  }
  return null;
};

CustomJSONMessage.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  actionDetails: PropTypes.shape().isRequired,
  currentUsername: PropTypes.string.isRequired,
  navigation: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(CustomJSONMessage);
