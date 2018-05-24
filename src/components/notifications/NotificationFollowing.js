import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/common/Avatar';
import { getIntl } from 'state/rootReducer';
import { View, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import TitleText from 'components/common/TitleText';
import NotificationContainer from './NotificationContainer';
import NotificationTimeAgo from './NotificationTimeAgo';
import NotificationText from './NotificationText';

const NotificationFollowing = ({ notification, read, handleNavigateToUser, intl, timestamp }) => (
  <TouchableWithoutFeedback onPress={handleNavigateToUser(notification.follower)}>
    <NotificationContainer read={read}>
      <Avatar username={notification.follower} />
      <View>
        <NotificationText>
          <TitleText>{notification.follower}</TitleText>
          {` ${intl.notification_following}`}
        </NotificationText>
        <NotificationTimeAgo created={timestamp} />
      </View>
    </NotificationContainer>
  </TouchableWithoutFeedback>
);

NotificationFollowing.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    follower: PropTypes.string,
  }),
  handleNavigateToUser: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  timestamp: PropTypes.string,
};

NotificationFollowing.defaultProps = {
  read: false,
  notification: {},
  timestamp: '',
};

const mapStateToProps = state => ({
  intl: getIntl(state),
});

export default connect(mapStateToProps)(NotificationFollowing);
