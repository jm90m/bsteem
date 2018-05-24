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

const NotificationVoteWitness = ({ notification, read, handleNavigateToUser, intl, timestamp }) => (
  <TouchableWithoutFeedback onPress={handleNavigateToUser(notification.account)}>
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
        <NotificationTimeAgo created={timestamp} />
      </View>
    </NotificationContainer>
  </TouchableWithoutFeedback>
);

NotificationVoteWitness.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    account: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  handleNavigateToUser: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  timestamp: PropTypes.string,
};

NotificationVoteWitness.defaultProps = {
  read: false,
  notification: {},
  timestamp: '',
};

const mapStateToProps = state => ({
  intl: getIntl(state),
});

export default connect(mapStateToProps)(NotificationVoteWitness);
