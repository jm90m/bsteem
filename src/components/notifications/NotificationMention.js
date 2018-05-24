import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/common/Avatar';
import { View, TouchableWithoutFeedback } from 'react-native';
import { getIntl } from 'state/rootReducer';
import { connect } from 'react-redux';
import TitleText from 'components/common/TitleText';
import NotificationContainer from './NotificationContainer';
import NotificationTimeAgo from './NotificationTimeAgo';
import NotificationText from './NotificationText';

const NotificationMention = ({ notification, read, handleNavigateToPost, intl, timestamp }) => (
  <TouchableWithoutFeedback
    onPress={handleNavigateToPost(notification.author, notification.permlink)}
  >
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
        <NotificationTimeAgo created={timestamp} />
      </View>
    </NotificationContainer>
  </TouchableWithoutFeedback>
);

NotificationMention.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    author: PropTypes.string,
  }),
  handleNavigateToPost: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  timestamp: PropTypes.string,
};

NotificationMention.defaultProps = {
  read: false,
  notification: {},
  timestamp: '',
};

const mapStateToProps = state => ({
  intl: getIntl(state),
});

export default connect(mapStateToProps)(NotificationMention);
