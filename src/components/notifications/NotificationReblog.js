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

const NotificationReblog = ({ notification, read, handleNavigateToPost, intl, authUsername }) => (
  <Touchable onPress={handleNavigateToPost(authUsername, notification.permlink)}>
    <NotificationContainer read={read}>
      <Avatar username={notification.account} />
      <View>
        <NotificationText>
          <TitleText>{notification.account}</TitleText>
          {` ${intl.notification_reblogged_post}`}
        </NotificationText>
        <NotificationTimeAgo created={notification.timestamp} />
      </View>
    </NotificationContainer>
  </Touchable>
);

NotificationReblog.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    account: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  handleNavigateToPost: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  authUsername: PropTypes.string.isRequired,
};

NotificationReblog.defaultProps = {
  read: false,
};

const mapStateToProps = state => ({
  intl: getIntl(state),
  authUsername: getAuthUsername(state),
});

export default connect(mapStateToProps)(NotificationReblog);
