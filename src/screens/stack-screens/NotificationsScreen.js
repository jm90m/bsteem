import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import BackButton from 'components/common/BackButton';
import Header from 'components/common/Header';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getNotifications as getNotificationsState,
  getCustomTheme,
  getIntl,
  getLoadingNotifications,
  getAuthUsername,
  getAuthenticatedUserSCMetaData,
} from 'state/rootReducer';
import * as navigationConstants from 'constants/navigation';
import * as firebaseActions from 'state/actions/firebaseActions';
import * as notificationConstants from 'constants/notifications';
import TitleText from 'components/common/TitleText';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import {
  saveNotificationsLastTimestamp,
  fetchBSteemNotifications,
} from 'state/actions/authActions';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import StyledFlatList from 'components/common/StyledFlatList';
import NotificationMention from 'components/notifications/NotificationMention';
import NotificationFollowing from 'components/notifications/NotificationFollowing';
import NotificationVote from 'components/notifications/NotificationVote';
import NotificationVoteWitness from 'components/notifications/NotificationVoteWitness';
import NotificationTransfer from 'components/notifications/NotificationTransfer';
import NotificationReblog from 'components/notifications/NotificationReblog';
import NotificationReply from 'components/notifications/NotificationReply';

const MenuIconContainer = styled.View`
  padding: 5px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
  notifications: getNotificationsState(state),
  loadingNotifications: getLoadingNotifications(state),
  authUsername: getAuthUsername(state),
  userSCMetaData: getAuthenticatedUserSCMetaData(state),
});

const mapDispatchToProps = dispatch => ({
  searchUserMessages: search => dispatch(firebaseActions.searchUserMessages.action(search)),
  fetchBlockedUsers: () => dispatch(firebaseActions.fetchBlockedUsers.action()),
  saveNotificationsLastTimestamp: timestamp =>
    dispatch(saveNotificationsLastTimestamp.action({ timestamp })),
  fetchBSteemNotifications: () => dispatch(fetchBSteemNotifications.action()),
});

class NotificationsScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    drawerLabel: 'Notifications',
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    loadingNotifications: PropTypes.bool.isRequired,
    customTheme: PropTypes.shape().isRequired,
    navigation: PropTypes.shape().isRequired,
    userSCMetaData: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    fetchBSteemNotifications: PropTypes.func.isRequired,
    saveNotificationsLastTimestamp: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleNavigateBack = this.handleNavigateBack.bind(this);
    this.renderNotification = this.renderNotification.bind(this);
    this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
    this.refreshNotifications = this.refreshNotifications.bind(this);
  }

  componentDidMount() {
    const { notifications, userSCMetaData } = this.props;
    const lastSeenTimestamp = _.get(userSCMetaData, 'notifications_last_timestamp', -1);
    const latestNotification = _.get(notifications, 0);
    const timestamp = _.get(latestNotification, 'created_at');

    if (new Date(timestamp).getTime() > new Date(lastSeenTimestamp).getTime()) {
      this.props.saveNotificationsLastTimestamp(timestamp);
    }
  }

  refreshNotifications() {
    this.props.fetchBSteemNotifications();
  }

  handleNavigateBack() {
    this.props.navigation.goBack();
  }

  handleNavigateToUser = username => () => {
    this.props.navigation.navigate(navigationConstants.USER, { username });
  };

  handleNavigateToPost = (author, permlink) => () => {
    this.props.navigation.navigate(navigationConstants.FETCH_POST, {
      author,
      permlink,
    });
  };

  renderNotification(rowData) {
    const rowItem = rowData.item;
    const notification = rowItem.data;
    const { created_at: timestamp } = rowItem;

    switch (rowItem.kind) {
      case notificationConstants.TYPE_MENTION:
        return (
          <NotificationMention
            notification={notification}
            handleNavigateToPost={this.handleNavigateToPost}
            timestamp={timestamp}
          />
        );
      case notificationConstants.TYPE_FOLLOW:
        return (
          <NotificationFollowing
            notification={notification}
            handleNavigateToUser={this.handleNavigateToUser}
            timestamp={timestamp}
          />
        );
      case notificationConstants.TYPE_VOTE:
        return (
          <NotificationVote
            notification={notification}
            handleNavigateToPost={this.handleNavigateToPost}
            timestamp={timestamp}
          />
        );
      case notificationConstants.WITNESS_VOTE:
        return (
          <NotificationVoteWitness
            notification={notification}
            handleNavigateToUser={this.handleNavigateToUser}
            timestamp={timestamp}
          />
        );
      case notificationConstants.TYPE_TRANSFER_IN:
        return (
          <NotificationTransfer
            notification={notification}
            handleNavigateToUser={this.handleNavigateToUser}
            timestamp={timestamp}
          />
        );
      case notificationConstants.REBLOG:
        return (
          <NotificationReblog
            notification={notification}
            handleNavigateToPost={this.handleNavigateToPost}
            timestamp={timestamp}
          />
        );
      case notificationConstants.TYPE_REPLY:
        return (
          <NotificationReply
            notification={notification}
            handleNavigateToPost={this.handleNavigateToPost}
            timestamp={timestamp}
          />
        );
      default:
        return null;
    }
  }

  renderEmptyComponent() {
    const { intl } = this.props;
    return (
      <StyledTextByBackground style={{ padding: 10 }}>
        {intl.notifications_empty_message}
      </StyledTextByBackground>
    );
  }

  render() {
    const { customTheme, intl, notifications, loadingNotifications } = this.props;

    return (
      <StyledViewPrimaryBackground style={{ flex: 1 }}>
        <Header>
          <BackButton navigateBack={this.handleNavigateBack} />
          <TitleText>{intl.notifications}</TitleText>
          <TouchableWithoutFeedback>
            <MenuIconContainer>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.messageText}
                color="transparent"
              />
            </MenuIconContainer>
          </TouchableWithoutFeedback>
        </Header>
        <StyledFlatList
          enableEmptySections
          data={notifications}
          ListEmptyComponent={this.renderEmptyComponent()}
          keyExtractor={(item, index) => `${_.get(item, 'timestamp', '')}${index}`}
          renderItem={this.renderNotification}
          initialNumToRender={10}
          refreshControl={
            <RefreshControl
              refreshing={loadingNotifications}
              onRefresh={this.refreshNotifications}
              tintColor={customTheme.primaryColor}
              colors={[customTheme.primaryColor]}
            />
          }
        />
      </StyledViewPrimaryBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen);
