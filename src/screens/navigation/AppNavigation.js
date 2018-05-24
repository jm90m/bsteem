import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { TabNavigator, DrawerNavigator } from 'react-navigation';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getAuthAccessToken, getCustomTheme, getInitialAppLoaded } from 'state/rootReducer';
import * as navigationConstants from 'constants/navigation';
import * as appActions from 'state/actions/appActions';
import { firebaseConfig } from 'constants/config';
import LargeLoading from 'components/common/LargeLoading';
import { fetchSavedOfflinePosts } from 'state/actions/postsActions';
import { COLORS } from 'constants/styles';
import HomeNavigator from './HomeNavigator';
import SearchNavigator from './SearchNavigator';
import LoginNavigator from './LoginNavigator';
import CurrentUserNavigator from './CurrentUserNavigator';
import CurrentUserDrawer from './CurrentUserDrawer';
import PostCreationNavigator from './PostCreationNavigator';
import NotificationsScreen from '../stack-screens/NotificationsScreen';
import MessagesScreen from '../stack-screens/MessagesScreen';
import CustomThemeScreen from '../stack-screens/CustomThemeScreen';
import SettingsScreen from '../stack-screens/SettingsScreen';
import EditProfileScreen from '../stack-screens/EditProfileScreen';
import UserWalletScreen from '../stack-screens/UserWalletScreen';

const tabNavigatorOptions = {
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    activeTintColor: COLORS.PRIMARY_COLOR,
    inactiveTintColor: COLORS.TERTIARY_COLOR,
    style: {
      backgroundColor: COLORS.PRIMARY_BACKGROUND_COLOR,
      borderTopColor: COLORS.PRIMARY_BORDER_COLOR,
    },
    indicatorStyle: {
      backgroundColor: COLORS.PRIMARY_COLOR,
    },
  },
};

const LoggedOutUserNavigator = TabNavigator(
  {
    [navigationConstants.HOME]: {
      screen: HomeNavigator,
    },
    [navigationConstants.SEARCH]: {
      screen: SearchNavigator,
    },
    [navigationConstants.LOGIN]: {
      screen: LoginNavigator,
    },
  },
  tabNavigatorOptions,
);

const AuthUserNavigator = TabNavigator(
  {
    [navigationConstants.CURRENT_USER]: {
      screen: CurrentUserNavigator,
    },
    [navigationConstants.HOME]: {
      screen: HomeNavigator,
    },
    [navigationConstants.POST_CREATION]: {
      screen: PostCreationNavigator,
    },
    [navigationConstants.SEARCH]: {
      screen: SearchNavigator,
    },
    [navigationConstants.LOGIN]: {
      screen: LoginNavigator,
    },
  },
  tabNavigatorOptions,
);

const drawerNavigatorConfig = {
  drawerBackgroundColor: COLORS.PRIMARY_BACKGROUND_COLOR,
  contentOptions: {
    activeTintColor: COLORS.PRIMARY_COLOR,
    activeBackgroundColor: COLORS.PRIMARY_BACKGROUND_COLOR,
  },
  contentComponent: CurrentUserDrawer,
};

const BsteemDrawerNaviator = DrawerNavigator(
  {
    Home: {
      screen: AuthUserNavigator,
    },
    [navigationConstants.NOTIFICATIONS]: {
      screen: NotificationsScreen,
    },
    [navigationConstants.MESSAGES]: {
      screen: MessagesScreen,
    },
    [navigationConstants.SETTINGS]: {
      screen: SettingsScreen,
    },
    [navigationConstants.EDIT_PROFILE]: {
      screen: EditProfileScreen,
    },
    [navigationConstants.USER_WALLET]: {
      screen: UserWalletScreen,
    },
    [navigationConstants.CUSTOM_THEME]: {
      screen: CustomThemeScreen,
    },
  },
  drawerNavigatorConfig,
);

const mapStateToProps = state => ({
  accessToken: getAuthAccessToken(state),
  customTheme: getCustomTheme(state),
  initialAppLoaded: getInitialAppLoaded(state),
});

const mapDispatchToProps = dispatch => ({
  fetchNetworkConnection: () => dispatch(appActions.fetchNetworkConnection.action()),
  appOnboarding: () => dispatch(appActions.appOnboarding.action()),
  fetchSavedOfflinePosts: () => dispatch(fetchSavedOfflinePosts.action()),
});

@connect(mapStateToProps, mapDispatchToProps)
class AppNavigation extends React.Component {
  static propTypes = {
    fetchNetworkConnection: PropTypes.func.isRequired,
    appOnboarding: PropTypes.func.isRequired,
    fetchSavedOfflinePosts: PropTypes.func.isRequired,
    customTheme: PropTypes.shape().isRequired,
    initialAppLoaded: PropTypes.bool.isRequired,
    accessToken: PropTypes.string,
  };

  static defaultProps = {
    accessToken: '',
  };

  componentDidMount() {
    firebase.initializeApp(firebaseConfig);
    this.props.appOnboarding();
    this.props.fetchNetworkConnection();
    this.props.fetchSavedOfflinePosts();
  }

  componentWillReceiveProps(nextProps) {
    const diffCustomTheme = !_.isEqual(
      JSON.stringify(this.props.customTheme),
      JSON.stringify(nextProps.customTheme),
    );

    if (diffCustomTheme) {
      tabNavigatorOptions.tabBarOptions.activeTintColor = nextProps.customTheme.primaryColor;
      tabNavigatorOptions.tabBarOptions.inactiveTintColor = nextProps.customTheme.tertiaryColor;
      tabNavigatorOptions.tabBarOptions.style.backgroundColor =
        nextProps.customTheme.primaryBackgroundColor;
      tabNavigatorOptions.tabBarOptions.style.borderTopColor =
        nextProps.customTheme.primaryBorderColor;
      tabNavigatorOptions.tabBarOptions.indicatorStyle.backgroundColor =
        nextProps.customTheme.primaryColor;
      drawerNavigatorConfig.drawerBackgroundColor = nextProps.customTheme.primaryBackgroundColor;
      this.forceUpdate();
    }
  }

  render() {
    const { accessToken, initialAppLoaded } = this.props;

    if (!initialAppLoaded) return <LargeLoading style={{ marginTop: 50 }} />;

    if (!_.isEmpty(accessToken)) {
      return <BsteemDrawerNaviator />;
    }

    return <LoggedOutUserNavigator />;
  }
}

export default AppNavigation;
