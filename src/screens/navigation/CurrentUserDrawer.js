import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  AsyncStorage,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import _ from 'lodash';
import {
  AUTH_EXPIRATION,
  AUTH_MAX_EXPIRATION_AGE,
  AUTH_USERNAME,
  STEEM_ACCESS_TOKEN,
} from 'constants/asyncStorageKeys';
import sc2 from 'api/sc2';
import { logoutUser } from 'state/actions/authActions';
import { getCurrentUserSettings } from 'state/actions/settingsActions';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { MATERIAL_COMMUNITY_ICONS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import { getCustomTheme, getIntl, getAuthUsername, getUsersDetails } from 'state/rootReducer';
import * as navigationConstants from 'constants/navigation';
import { getReputation } from 'util/steemitFormatters';
import { getUserDetailsHelper } from 'util/bsteemUtils';
import Avatar from 'components/common/Avatar';
import ReputationScore from 'components/post/ReputationScore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
    flexDirection: 'row',
  },
  drawerText: {
    marginLeft: 5,
    fontSize: 18,
  },
  drawerHeader: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingLeft: 20,
  },
  usernameContainer: {
    marginLeft: 13,
  },
});

class CurrentUserDrawer extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    navigation: PropTypes.shape().isRequired,
    usersDetails: PropTypes.shape().isRequired,
    authUsername: PropTypes.string.isRequired,
    logoutUser: PropTypes.func.isRequired,
    getCurrentUserSettings: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleNavigateToMessages = this.handleNavigateToMessages.bind(this);
    this.handleNavigateToNotifications = this.handleNavigateToNotifications.bind(this);
    this.handleNavigateToWallet = this.handleNavigateToWallet.bind(this);
    this.handleNavigateToSettings = this.handleNavigateToSettings.bind(this);
    this.handleNavigateToSaved = this.handleNavigateToSaved.bind(this);
    this.handleNavigateToCustomTheme = this.handleNavigateToCustomTheme.bind(this);
    this.handleNavigateToActivity = this.handleNavigateToActivity.bind(this);
    this.handleNavigateToTransfers = this.handleNavigateToTransfers.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.resetAuthUserInAsyncStorage = this.resetAuthUserInAsyncStorage.bind(this);
  }

  handleNavigateToWallet() {
    const { authUsername } = this.props;
    this.props.navigation.navigate(navigationConstants.USER_WALLET, { username: authUsername });
  }

  handleNavigateToNotifications() {
    this.props.navigation.navigate(navigationConstants.NOTIFICATIONS);
  }

  handleNavigateToMessages() {
    this.props.navigation.navigate(navigationConstants.MESSAGES);
  }

  handleNavigateToSettings() {
    this.props.navigation.navigate(navigationConstants.SETTINGS);
  }

  handleNavigateToSaved() {
    this.props.navigation.navigate(navigationConstants.SAVED_CONTENT);
  }

  handleNavigateToCustomTheme() {
    this.props.navigation.navigate(navigationConstants.CUSTOM_THEME);
  }

  handleNavigateToActivity() {
    const { authUsername } = this.props;
    this.props.navigation.navigate(navigationConstants.USER_ACTIVITY, { username: authUsername });
  }

  handleNavigateToTransfers() {
    this.props.navigation.navigate(navigationConstants.TRANSFERS);
  }

  async resetAuthUserInAsyncStorage() {
    try {
      AsyncStorage.setItem(STEEM_ACCESS_TOKEN, '');
      AsyncStorage.setItem(AUTH_EXPIRATION, '');
      AsyncStorage.setItem(AUTH_USERNAME, '');
      AsyncStorage.setItem(AUTH_MAX_EXPIRATION_AGE, '');
    } catch (e) {
      console.log('FAILED TO RESET ASYNC STORAGE FOR AUTH USER');
    }
  }

  handleLogout() {
    sc2
      .revokeToken()
      .then(() => {
        this.resetAuthUserInAsyncStorage();
        this.props.logoutUser();
        this.props.getCurrentUserSettings();
      })
      .catch(() => {
        console.log('SC2 fail - but logout anyways');
        this.resetAuthUserInAsyncStorage();
        this.props.logoutUser();
      });
  }

  render() {
    const { customTheme, intl, authUsername, usersDetails } = this.props;
    const userDetails = getUserDetailsHelper(usersDetails, authUsername, {});
    const reputation = getReputation(_.get(userDetails, 'reputation', 0));

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: customTheme.primaryBackgroundColor }]}
      >
        <SafeAreaView
          style={[styles.container, { backgroundColor: customTheme.primaryBackgroundColor }]}
          forceInset={{ top: 'always', horizontal: 'never' }}
        >
          <View style={styles.drawerHeader}>
            <Avatar username={authUsername} size={60} />
            <View style={styles.usernameContainer}>
              <Text
                style={{
                  color: customTheme.primaryColor,
                  fontSize: 20,
                  marginLeft: 5,
                  fontWeight: 'bold',
                }}
              >
                {authUsername}
              </Text>
              <View style={{ width: 40, marginTop: 5 }}>
                <ReputationScore reputation={reputation} />
              </View>
            </View>
          </View>
          <TouchableWithoutFeedback onPress={this.handleNavigateToNotifications}>
            <View style={[styles.menuItem, { marginTop: 15 }]}>
              <MaterialIcons
                name={MATERIAL_ICONS.notifications}
                size={ICON_SIZES.actionIcon}
                color={customTheme.primaryColor}
              />
              <Text style={[styles.drawerText, { color: customTheme.primaryColor }]}>
                {intl.notifications}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.handleNavigateToMessages}>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.messageText}
                size={ICON_SIZES.actionIcon}
                color={customTheme.primaryColor}
              />
              <Text style={[styles.drawerText, { color: customTheme.primaryColor }]}>
                {intl.messages}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.handleNavigateToWallet}>
            <View style={styles.menuItem}>
              <MaterialIcons
                name={MATERIAL_ICONS.wallet}
                size={ICON_SIZES.actionIcon}
                color={customTheme.primaryColor}
              />
              <Text style={[styles.drawerText, { color: customTheme.primaryColor }]}>
                {_.capitalize(intl.wallet)}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.handleNavigateToTransfers}>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.cashUSD}
                size={ICON_SIZES.actionIcon}
                color={customTheme.primaryColor}
              />
              <Text style={[styles.drawerText, { color: customTheme.primaryColor }]}>
                {intl.transfers}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.handleNavigateToSaved}>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.saved}
                size={ICON_SIZES.actionIcon}
                color={customTheme.primaryColor}
              />
              <Text style={[styles.drawerText, { color: customTheme.primaryColor }]}>
                {intl.saved}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.handleNavigateToActivity}>
            <View style={styles.menuItem}>
              <MaterialIcons
                name={MATERIAL_ICONS.directionsRun}
                size={ICON_SIZES.actionIcon}
                color={customTheme.primaryColor}
              />
              <Text style={[styles.drawerText, { color: customTheme.primaryColor }]}>
                {_.capitalize(intl.activity)}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.handleNavigateToCustomTheme}>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.autoFix}
                size={ICON_SIZES.actionIcon}
                color={customTheme.primaryColor}
              />
              <Text style={[styles.drawerText, { color: customTheme.primaryColor }]}>
                {intl.custom_theme}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.handleNavigateToSettings}>
            <View style={styles.menuItem}>
              <MaterialIcons
                name={MATERIAL_ICONS.settings}
                size={ICON_SIZES.actionIcon}
                color={customTheme.primaryColor}
              />
              <Text style={[styles.drawerText, { color: customTheme.primaryColor }]}>
                {intl.settings}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.handleLogout}>
            <View style={[styles.menuItem, { marginTop: 15 }]}>
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.logout}
                size={ICON_SIZES.actionIcon}
                color={customTheme.primaryColor}
              />
              <Text style={[styles.drawerText, { color: customTheme.primaryColor }]}>
                {intl.logout}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
  authUsername: getAuthUsername(state),
  usersDetails: getUsersDetails(state),
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
  getCurrentUserSettings: () => dispatch(getCurrentUserSettings.action()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUserDrawer);
