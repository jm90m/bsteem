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

const NotificationTransfer = ({ notification, read, handleNavigateToUser, intl, timestamp }) => (
  <TouchableWithoutFeedback onPress={handleNavigateToUser(notification.from)}>
    <NotificationContainer read={read}>
      <Avatar username={notification.from} />
      <View>
        <NotificationText>
          <TitleText>{notification.from}</TitleText>
          {` ${intl.notification_transfer} - `}
          {notification.amount}
        </NotificationText>
        <NotificationTimeAgo created={timestamp} />
      </View>
    </NotificationContainer>
  </TouchableWithoutFeedback>
);

NotificationTransfer.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    from: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  handleNavigateToUser: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  timestamp: PropTypes.string,
};

NotificationTransfer.defaultProps = {
  read: false,
  notification: {},
  timestamp: '',
};

const mapStateToProps = state => ({
  intl: getIntl(state),
});

export default connect(mapStateToProps)(NotificationTransfer);
