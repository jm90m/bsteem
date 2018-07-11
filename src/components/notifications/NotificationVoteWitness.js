import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/common/Avatar';
import { getIntl } from 'state/rootReducer';
import { View } from 'react-native';
import Touchable from 'components/common/Touchable';
import { connect } from 'react-redux';
import TitleText from 'components/common/TitleText';
import NotificationContainer from './NotificationContainer';
import NotificationTimeAgo from './NotificationTimeAgo';
import NotificationText from './NotificationText';

const NotificationVoteWitness = ({ notification, read, handleNavigateToUser, intl }) => (
  <Touchable onPress={handleNavigateToUser(notification.account)}>
    <NotificationContainer read={read}>
      <Avatar username={notification.account} />
      <View>
        <NotificationText>
          <TitleText>{notification.account}</TitleText>
          {` ${
            notification.approve
              ? intl.notification_approved_witness
              : intl.notification_unapproved_witness
          }`}
        </NotificationText>
        <NotificationTimeAgo created={notification.timestamp} />
      </View>
    </NotificationContainer>
  </Touchable>
);

NotificationVoteWitness.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    account: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  handleNavigateToUser: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

NotificationVoteWitness.defaultProps = {
  read: false,
};

const mapStateToProps = state => ({
  intl: getIntl(state),
});

export default connect(mapStateToProps)(NotificationVoteWitness);
