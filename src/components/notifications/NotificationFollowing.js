import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/common/Avatar';
import { getIntl } from 'state/rootReducer';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Touchable from 'components/common/Touchable';
import TitleText from 'components/common/TitleText';
import NotificationContainer from './NotificationContainer';
import NotificationTimeAgo from './NotificationTimeAgo';
import NotificationText from './NotificationText';

const NotificationFollowing = ({ notification, read, handleNavigateToUser, intl }) => (
  <Touchable onPress={handleNavigateToUser(notification.follower)}>
    <NotificationContainer read={read}>
      <Avatar username={notification.follower} />
      <View>
        <NotificationText>
          <TitleText>{notification.follower}</TitleText>
          {` ${intl.notification_following}`}
        </NotificationText>
        <NotificationTimeAgo created={notification.timestamp} />
      </View>
    </NotificationContainer>
  </Touchable>
);

NotificationFollowing.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    follower: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  handleNavigateToUser: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

NotificationFollowing.defaultProps = {
  read: false,
};

const mapStateToProps = state => ({
  intl: getIntl(state),
});

export default connect(mapStateToProps)(NotificationFollowing);
