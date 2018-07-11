import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/common/Avatar';
import { getIntl, getAuthUsername } from 'state/rootReducer';
import { View } from 'react-native';
import Touchable from 'components/common/Touchable';
import { connect } from 'react-redux';
import TitleText from 'components/common/TitleText';
import NotificationContainer from './NotificationContainer';
import NotificationTimeAgo from './NotificationTimeAgo';
import NotificationText from './NotificationText';

const NotificationVote = ({ notification, read, handleNavigateToPost, intl, authUsername }) => {
  let voteMessage = intl.notification_unvoted_post;

  if (notification.weight > 0) {
    voteMessage = intl.notification_upvoted_post;
  } else if (notification.weight < 0) {
    voteMessage = intl.notification_downvoted_post;
  }

  return (
    <Touchable onPress={handleNavigateToPost(authUsername, notification.permlink)}>
      <NotificationContainer read={read}>
        <Avatar username={notification.voter} />
        <View>
          <NotificationText>
            <TitleText>{notification.voter}</TitleText>
            {` ${voteMessage}`}
          </NotificationText>
          <NotificationTimeAgo created={notification.timestamp} />
        </View>
      </NotificationContainer>
    </Touchable>
  );
};

NotificationVote.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    voter: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  handleNavigateToPost: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  authUsername: PropTypes.string.isRequired,
};

NotificationVote.defaultProps = {
  read: false,
};

const mapStateToProps = state => ({
  intl: getIntl(state),
  authUsername: getAuthUsername(state),
});

export default connect(mapStateToProps)(NotificationVote);
