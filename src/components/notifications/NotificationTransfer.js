import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/common/Avatar';
import { getIntl } from 'state/rootReducer';
import { View } from 'react-native';
import { connect } from 'react-redux';
import TitleText from 'components/common/TitleText';
import Touchable from 'components/common/Touchable';
import NotificationContainer from './NotificationContainer';
import NotificationTimeAgo from './NotificationTimeAgo';
import NotificationText from './NotificationText';

const NotificationTransfer = ({ notification, read, handleNavigateToUser, intl }) => (
  <Touchable onPress={handleNavigateToUser(notification.from)}>
    <NotificationContainer read={read}>
      <Avatar username={notification.from} />
      <View>
        <NotificationText>
          <TitleText>{notification.from}</TitleText>
          {` ${intl.notification_transfer} - `}
          {notification.amount}
        </NotificationText>
        <NotificationTimeAgo created={notification.timestamp} />
      </View>
    </NotificationContainer>
  </Touchable>
);

NotificationTransfer.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    from: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  handleNavigateToUser: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

NotificationTransfer.defaultProps = {
  read: false,
};

const mapStateToProps = state => ({
  intl: getIntl(state),
});

export default connect(mapStateToProps)(NotificationTransfer);
