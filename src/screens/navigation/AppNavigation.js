import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { createBottomTabNavigator } from 'react-navigation';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  getAuthAccessToken,
  getCustomTheme,
  getInitialAppLoaded,
  getIsAuthenticated,
} from 'state/rootReducer';
import * as navigationConstants from 'constants/navigation';
import * as appActions from 'state/actions/appActions';
import { firebaseConfig } from 'constants/config-example';
import LargeLoading from 'components/common/LargeLoading';
import SafeAreaView from 'components/common/SafeAreaView';
import { fetchSavedOfflinePosts } from 'state/actions/postsActions';
import { FONT_AWESOME_ICONS, ICON_SIZES, MATERIAL_ICONS } from 'constants/styles';
import { drawerNavigatorConfig, tabNavigatorOptions } from './navigatorOptions';
import HomeNavigator from './sub-navigation/HomeNavigator';
import SearchNavigator from './sub-navigation/SearchNavigator';
import LoginNavigator from './sub-navigation/LoginNavigator';
import BsteemDrawerNavigator from './BsteemDrawerNavigator';

const LoggedOutUserNavigator = createBottomTabNavigator(
  {
    [navigationConstants.HOME]: {
      screen: HomeNavigator,
      navigationOptions: ({ navigation }) => {
        const tabBarVisible = navigation.state.index === 0;
        return {
          tabBarIcon: ({ tintColor }) => (
            <FontAwesome
              name={FONT_AWESOME_ICONS.news}
              size={ICON_SIZES.tabBarIcon}
              color={tintColor}
            />
          ),
          tabBarVisible,
        };
      },
    },
    [navigationConstants.SEARCH]: {
      screen: SearchNavigator,
      navigationOptions: ({ navigation }) => {
        const tabBarVisible = navigation.state.index === 0;
        return {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons
              name={MATERIAL_ICONS.search}
              size={ICON_SIZES.tabBarIcon}
              color={tintColor}
            />
          ),
          tabBarVisible,
        };
      },
    },
    [navigationConstants.LOGIN]: {
      screen: LoginNavigator,
      navigationOptions: ({ navigation }) => {
        const tabBarVisible = navigation.state.index === 0;
        return {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons
              name={MATERIAL_ICONS.login}
              size={ICON_SIZES.tabBarIcon}
              color={tintColor}
            />
          ),
          tabBarVisible,
        };
      },
    },
  },
  tabNavigatorOptions,
);

const mapStateToProps = state => ({
  accessToken: getAuthAccessToken(state),
  customTheme: getCustomTheme(state),
  authenticated: getIsAuthenticated(state),
  initialAppLoaded: getInitialAppLoaded(state),
});

const mapDispatchToProps = dispatch => ({
  appOnboarding: () => dispatch(appActions.appOnboarding.action()),
  fetchSavedOfflinePosts: () => dispatch(fetchSavedOfflinePosts.action()),
});

@connect(mapStateToProps, mapDispatchToProps)
class AppNavigation extends React.Component {
  static propTypes = {
    appOnboarding: PropTypes.func.isRequired,
    fetchSavedOfflinePosts: PropTypes.func.isRequired,
    customTheme: PropTypes.shape().isRequired,
    initialAppLoaded: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    accessToken: PropTypes.string,
  };

  static defaultProps = {
    accessToken: '',
  };

  componentDidMount() {
    firebase.initializeApp(firebaseConfig);
    this.props.appOnboarding();
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

    if (!initialAppLoaded) {
      const loadingStyles = { marginTop: 50 };
      return <LargeLoading style={loadingStyles} />;
    }

    if (!_.isEmpty(accessToken)) {
      return (
        <SafeAreaView>
          <BsteemDrawerNavigator />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView>
        <LoggedOutUserNavigator />
      </SafeAreaView>
    );
  }
}

export default AppNavigation;
