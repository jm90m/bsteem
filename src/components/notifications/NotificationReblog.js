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

const NotificationReblog = ({
  notification,
  read,
  handleNavigateToPost,
  intl,
  authUsername,
  timestamp,
}) => (
  <TouchableWithoutFeedback onPress={handleNavigateToPost(authUsername, notification.permlink)}>
    <NotificationContainer read={read}>
      <Avatar username={notification.account} />
      <View>
        <NotificationText>
          <TitleText>{notification.account}</TitleText>
          {` ${intl.notification_reblogged_post}`}
        </NotificationText>
        <NotificationTimeAgo created={timestamp} />
      </View>
    </NotificationContainer>
  </TouchableWithoutFeedback>
);

NotificationReblog.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    account: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  handleNavigateToPost: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  authUsername: PropTypes.string.isRequired,
  timestamp: PropTypes.string,
};

NotificationReblog.defaultProps = {
  read: false,
  notification: {},
  timestamp: '',
};

const mapStateToProps = state => ({
  intl: getIntl(state),
  authUsername: getAuthUsername(state),
});

export default connect(mapStateToProps)(NotificationReblog);
