import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { TabNavigator } from 'react-navigation';
import _ from 'lodash';
import { connect } from 'react-redux';
import { COLORS } from 'constants/styles';
import { getAuthAccessToken } from 'state/rootReducer';
import * as navigationConstants from 'constants/navigation';
import * as appActions from 'state/actions/appActions';
import HomeNavigator from './HomeNavigator';
import SearchNavigator from './SearchNavigator';
import LoginNavigator from './LoginNavigator';
import CurrentUserNavigator from './CurrentUserNavigator';
import PostCreationScreen from '../post-creation-screen/PostCreationScreen';

const tabNavigatorOptions = {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    activeTintColor: COLORS.PRIMARY_COLOR,
    inactiveTintColor: COLORS.BLUE.BOTICELLI,
    style: {
      backgroundColor: COLORS.WHITE.WHITE,
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
      screen: PostCreationScreen,
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

const mapStateToProps = state => ({
  accessToken: getAuthAccessToken(state),
});

const mapDispatchToProps = dispatch => ({
  fetchSteemRate: () => dispatch(appActions.fetchSteemRate.action()),
  fetchSteemGlobalProperties: () => dispatch(appActions.fetchSteemGlobalProperties.action()),
  fetchNetworkConnection: () => dispatch(appActions.fetchNetworkConnection.action()),
  setTranslations: locale => dispatch(appActions.setTranslations.action(locale)),
});

@connect(mapStateToProps, mapDispatchToProps)
class AppNavigation extends React.Component {
  static propTypes = {
    fetchSteemRate: PropTypes.func.isRequired,
    fetchSteemGlobalProperties: PropTypes.func.isRequired,
    fetchNetworkConnection: PropTypes.func.isRequired,
    setTranslations: PropTypes.func.isRequired,
    accessToken: PropTypes.string,
  };

  static defaultProps = {
    accessToken: '',
  };

  componentDidMount() {
    this.props.fetchSteemRate();
    this.props.fetchSteemGlobalProperties();
    this.props.fetchNetworkConnection();
    this.props.setTranslations('en_US');
    const config = {
      apiKey: 'AIzaSyBEzVCm5Q6ygDXxZcFGV6mHDyT1RvuMzYc',
      authDomain: 'bsteem-85a85.firebaseapp.com',
      databaseURL: 'https://bsteem-85a85.firebaseio.com',
      projectId: 'bsteem-85a85',
      storageBucket: '',
      messagingSenderId: '591405749824',
    };
    firebase.initializeApp(config);
  }

  render() {
    const { accessToken } = this.props;

    if (!_.isEmpty(accessToken)) {
      return <AuthUserNavigator />;
    }

    return <LoggedOutUserNavigator />;
  }
}

export default AppNavigation;
