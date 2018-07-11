import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/common/Avatar';
import { View } from 'react-native';
import { getIntl } from 'state/rootReducer';
import { connect } from 'react-redux';
import Touchable from 'components/common/Touchable';
import TitleText from 'components/common/TitleText';
import NotificationContainer from './NotificationContainer';
import NotificationTimeAgo from './NotificationTimeAgo';
import NotificationText from './NotificationText';

const NotificationMention = ({ notification, read, handleNavigateToPost, intl }) => (
  <Touchable onPress={handleNavigateToPost(notification.author, notification.permlink)}>
    <NotificationContainer read={read}>
      <Avatar username={notification.author} />
      <View>
        {notification.is_root_post ? (
          <NotificationText>
            <TitleText>{notification.author}</TitleText>
            {` ${intl.notification_reply_post}`}
          </NotificationText>
        ) : (
          <NotificationText>
            <TitleText>{notification.author}</TitleText>
            {` ${intl.notification_reply_comment}`}
          </NotificationText>
        )}
        <NotificationTimeAgo created={notification.timestamp} />
      </View>
    </NotificationContainer>
  </Touchable>
);

NotificationMention.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    author: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  handleNavigateToPost: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

NotificationMention.defaultProps = {
  read: false,
};

const mapStateToProps = state => ({
  intl: getIntl(state),
});

export default connect(mapStateToProps)(NotificationMention);
