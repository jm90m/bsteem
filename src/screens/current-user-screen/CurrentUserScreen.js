import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Header from 'components/common/Header';
import _ from 'lodash';
import { ICON_SIZES, MATERIAL_COMMUNITY_ICONS, MATERIAL_ICONS, COLORS } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import { BASE_NOTIFICATIONS_URL } from 'constants/notifications';
import {
  getAuthUsername,
  getCustomTheme,
  getIntl,
  getNotifications as getNotificationsState,
  getAuthAccessToken,
  getAuthenticatedUserSCMetaData,
} from 'state/rootReducer';
import firebase from 'firebase';
import PrimaryText from 'components/common/text/PrimaryText';
import { PARSED_NOTIFICATIONS } from 'constants/notifications';
import { fetchDisplayedMessages } from 'state/actions/firebaseActions';
import { getCurrentUserSettings } from 'state/actions/settingsActions';
import { getUserAllPrivateMessagesRef } from 'util/firebaseUtils';
import tinycolor from 'tinycolor2';
import { Permissions, Notifications } from 'expo';
import { getNotifications } from 'state/actions/currentUserActions';
import { setCurrentUserNavigation } from 'state/actions/authActions';
import CurrentUserFeed from './CurrentUserFeed';

let CurrentUserBSteemFeed = null;

const Container = styled.View`
  flex: 1;
`;

const Touchable = styled.TouchableOpacity``;

const HeaderText = styled(PrimaryText)`
  color: ${props =>
    props.selected ? props.customTheme.primaryColor : props.customTheme.secondaryColor};
  align-self: center;
`;

const MiddleMenu = styled.View`
  flex-direction: row;
`;

const MiddleMenuContent = styled.View`
  border-bottom-width: 2;
  border-bottom-color: ${props =>
    props.selected ? props.customTheme.primaryColor : 'transparent'};
  padding: 10px 20px;
`;

const NumberCircle = styled.View`
  height: 34px;
  width: 34px;
  align-items: center;
  align-self: center;
  justify-content: center;
  background-color: ${props => props.customTheme.primaryColor};
  border-radius: 17px;
  margin: 5px;
`;

const NotificationsText = styled(PrimaryText)`
  color: ${props =>
    tinycolor(props.customTheme.primaryColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const mapStateToProps = state => ({
  authUsername: getAuthUsername(state),
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
  notifications: getNotificationsState(state),
  accessToken: getAuthAccessToken(state),
  userSCMetaData: getAuthenticatedUserSCMetaData(state),
});

const mapDispatchToProps = dispatch => ({
  fetchDisplayedMessagesSuccess: messages => dispatch(fetchDisplayedMessages.success(messages)),
  getCurrentUserSettings: () => dispatch(getCurrentUserSettings.action()),
  getNotifications: () => dispatch(getNotifications.action()),
  setCurrentUserNavigation: navigation => dispatch(setCurrentUserNavigation(navigation)),
});

class CurrentUserScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    userSCMetaData: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    authUsername: PropTypes.string.isRequired,
    accessToken: PropTypes.string.isRequired,
    fetchDisplayedMessagesSuccess: PropTypes.func.isRequired,
    getCurrentUserSettings: PropTypes.func.isRequired,
    setCurrentUserNavigation: PropTypes.func.isRequired,
    getNotifications: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  };

  static MENU = {
    home: 'Home',
    bSteem: 'bSteem',
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedMenu: CurrentUserScreen.MENU.home,
    };

    this.handleNavigateToSavedTags = this.handleNavigateToSavedTags.bind(this);
    this.handleNavigateToNotifications = this.handleNavigateToNotifications.bind(this);
    this.handleSuccessFetchDisplayedMessages = this.handleSuccessFetchDisplayedMessages.bind(this);
    this.renderNotificationsIcon = this.renderNotificationsIcon.bind(this);
    this.registerForPushNotificationsAsync = this.registerForPushNotificationsAsync.bind(this);
  }

  componentWillMount() {
    const { authUsername } = this.props;
    firebase
      .database()
      .ref(getUserAllPrivateMessagesRef(authUsername))
      .on('value', this.handleSuccessFetchDisplayedMessages);
    this.registerForPushNotificationsAsync();
  }

  componentDidMount() {
    this.props.setCurrentUserNavigation(this.props.navigation);
    this.props.getCurrentUserSettings();
    this.props.getNotifications();
  }

  async registerForPushNotificationsAsync() {
    const { accessToken, authUsername } = this.props;
    const PUSH_ENDPOINT = `${BASE_NOTIFICATIONS_URL}/notifications/register`;
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync();

    return fetch(PUSH_ENDPOINT, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken,
      },
      body: JSON.stringify({
        token,
        username: authUsername,
        accessToken,
      }),
    });
  }

  setSelectedMenu = selectedMenu => () => {
    if (selectedMenu === CurrentUserScreen.MENU.bSteem && CurrentUserBSteemFeed === null) {
      CurrentUserBSteemFeed = require('./CurrentUserBSteemFeed').default;
    }

    this.setState({
      selectedMenu,
    });
  };

  handleSuccessFetchDisplayedMessages(snapshot) {
    const messages = snapshot.val() || {};
    this.props.fetchDisplayedMessagesSuccess(messages);
  }

  handleNavigateToNotifications() {
    this.props.navigation.openDrawer();
  }

  handleNavigateToSavedTags() {
    this.props.navigation.navigate(navigationConstants.SAVED_CONTENT);
  }

  renderNotificationsIcon() {
    const { userSCMetaData, notifications, customTheme } = this.props;
    const lastSeenTimestamp = _.get(userSCMetaData, 'notifications_last_timestamp');
    const notificationsCount = _.isUndefined(lastSeenTimestamp)
      ? _.size(notifications)
      : _.size(
          _.filter(
            notifications,
            notification =>
              new Date(lastSeenTimestamp).getTime() < new Date(notification.created_at).getTime() &&
              _.includes(PARSED_NOTIFICATIONS, notification.kind),
          ),
        );
    const displayBadge = notificationsCount > 0 && !_.isEmpty(userSCMetaData);
    const notificationsCountDisplay = notificationsCount > 99 ? '99+' : notificationsCount;
    return displayBadge ? (
      <NumberCircle customTheme={customTheme}>
        <NotificationsText customTheme={customTheme}>{notificationsCountDisplay}</NotificationsText>
      </NumberCircle>
    ) : (
      <MaterialIcons
        name={MATERIAL_ICONS.apps}
        size={ICON_SIZES.menuIcon}
        color={customTheme.primaryColor}
        style={{ padding: 5 }}
      />
    );
  }

  render() {
    const { navigation, customTheme, intl } = this.props;
    const { selectedMenu } = this.state;
    const selectedHome = CurrentUserScreen.MENU.home === selectedMenu;

    return (
      <Container>
        <Header>
          <Touchable onPress={this.handleNavigateToNotifications}>
            {this.renderNotificationsIcon()}
          </Touchable>
          <MiddleMenu>
            <Touchable onPress={this.setSelectedMenu(CurrentUserScreen.MENU.home)}>
              <MiddleMenuContent selected={selectedHome} customTheme={customTheme}>
                <HeaderText selected={selectedHome} customTheme={customTheme}>
                  {_.capitalize(intl.home)}
                </HeaderText>
              </MiddleMenuContent>
            </Touchable>
            <Touchable onPress={this.setSelectedMenu(CurrentUserScreen.MENU.bSteem)}>
              <MiddleMenuContent
                style={{ marginLeft: 15 }}
                selected={!selectedHome}
                customTheme={customTheme}
              >
                <HeaderText selected={!selectedHome} customTheme={customTheme}>
                  {CurrentUserScreen.MENU.bSteem}
                </HeaderText>
              </MiddleMenuContent>
            </Touchable>
          </MiddleMenu>
          <Touchable onPress={this.handleNavigateToSavedTags}>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.star}
              size={ICON_SIZES.menuIcon}
              style={{ padding: 5 }}
              color={customTheme.primaryColor}
            />
          </Touchable>
        </Header>
        <CurrentUserFeed navigation={navigation} hideFeed={!selectedHome} />
        {!selectedHome && <CurrentUserBSteemFeed navigation={navigation} hideFeed={selectedHome} />}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUserScreen);
