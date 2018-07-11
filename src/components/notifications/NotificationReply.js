import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/common/Avatar';
import { View } from 'react-native';
import Touchable from 'components/common/Touchable';
import { getIntl } from 'state/rootReducer';
import { connect } from 'react-redux';
import TitleText from 'components/common/TitleText';
import NotificationContainer from './NotificationContainer';
import NotificationTimeAgo from './NotificationTimeAgo';
import NotificationText from './NotificationText';

const NotificationReply = ({ notification, read, handleNavigateToPost, intl }) => (
  <Touchable onPress={handleNavigateToPost(notification.author, notification.permlink)}>
    <NotificationContainer read={read}>
      <Avatar username={notification.author} />
      <View>
        <NotificationText>
          <TitleText>{notification.author}</TitleText>
          {` ${intl.notification_commented}`}
        </NotificationText>
        <NotificationTimeAgo created={notification.timestamp} />
      </View>
    </NotificationContainer>
  </Touchable>
);

NotificationReply.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    author: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  handleNavigateToPost: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

NotificationReply.defaultProps = {
  read: false,
  notification: {},
};

const mapStateToProps = state => ({
  intl: getIntl(state),
});

export default connect(mapStateToProps)(NotificationReply);
