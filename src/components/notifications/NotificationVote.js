import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/common/Avatar';
import { getIntl, getAuthUsername } from 'state/rootReducer';
import { View, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import TitleText from 'components/common/TitleText';
import NotificationContainer from './NotificationContainer';
import NotificationTimeAgo from './NotificationTimeAgo';
import NotificationText from './NotificationText';

const NotificationVote = ({
  notification,
  read,
  handleNavigateToPost,
  intl,
  authUsername,
  timestamp,
}) => {
  let voteMessage = intl.notification_unvoted_post;

  if (notification.weight > 0) {
    voteMessage = intl.notification_upvoted_post;
  } else if (notification.weight < 0) {
    voteMessage = intl.notification_downvoted_post;
  }

  return (
    <TouchableWithoutFeedback onPress={handleNavigateToPost(authUsername, notification.permlink)}>
      <NotificationContainer read={read}>
        <Avatar username={notification.voter} />
        <View>
          <NotificationText>
            <TitleText>{notification.voter}</TitleText>
            {` ${voteMessage}`}
          </NotificationText>
          <NotificationTimeAgo created={timestamp} />
        </View>
      </NotificationContainer>
    </TouchableWithoutFeedback>
  );
};

NotificationVote.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    voter: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  handleNavigateToPost: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  authUsername: PropTypes.string.isRequired,
  timestamp: PropTypes.string,
};

NotificationVote.defaultProps = {
  read: false,
  notification: {},
  timestamp: '',
};

const mapStateToProps = state => ({
  intl: getIntl(state),
  authUsername: getAuthUsername(state),
});

export default connect(mapStateToProps)(NotificationVote);
