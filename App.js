import React from 'react';
import { View } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import sc2 from 'api/sc2';
import { Provider } from 'react-redux';
import Expo from 'expo';
import { COLORS } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import configureStore from 'state/configureStore';
import HomeScreen from 'screens/HomeScreen';
import SearchScreen from 'screens/SearchScreen';
import LoginScreen from 'screens/login-screen/LoginScreen';
import UserScreen from 'screens/user-screen/UserScreen';
import PostScreen from 'screens/stack-screens/PostScreen';
import FeedScreen from 'screens/stack-screens/FeedScreen';
import CommentsScreen from 'screens/stack-screens/CommentsScreen';
import SearchPostScreen from 'components/search/SearchPostScreen';

const HomeNavigator = StackNavigator(
  {
    [navigationConstants.HOME]: {
      screen: HomeScreen,
    },
    [navigationConstants.POST]: {
      screen: PostScreen,
    },
    [navigationConstants.FEED]: {
      screen: FeedScreen,
    },
    [navigationConstants.COMMENTS]: {
      screen: CommentsScreen,
    },
    [navigationConstants.USER]: {
      screen: UserScreen,
    },
  },
  {
    headerMode: 'none',
  },
);

const SearchNavigator = StackNavigator(
  {
    [navigationConstants.SEARCH]: {
      screen: SearchScreen,
    },
    [navigationConstants.FEED]: {
      screen: FeedScreen,
    },
    [navigationConstants.USER]: {
      screen: UserScreen,
    },
    [navigationConstants.SEARCH_POST]: {
      screen: SearchPostScreen,
    },
  },
  {
    headerMode: 'none',
  },
);

const LoginNavigator = StackNavigator(
  {
    [navigationConstants.LOGIN]: {
      screen: LoginScreen,
    },
    [navigationConstants.POST]: {
      screen: PostScreen,
    },
    [navigationConstants.FEED]: {
      screen: FeedScreen,
    },
    [navigationConstants.COMMENTS]: {
      screen: CommentsScreen,
    },
  },
  {
    headerMode: 'none',
  },
);

const AppNavigation = TabNavigator(
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
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      activeTintColor: COLORS.BLUE.MARINER,
      inactiveTintColor: COLORS.BLUE.BOTICELLI,
      style: {
        backgroundColor: COLORS.WHITE.WHITE,
      },
      indicatorStyle: {
        backgroundColor: COLORS.BLUE.MARINER,
      },
    },
  },
);

const store = configureStore();

export default class App extends React.Component {
  componentDidMount() {
    sc2.init({
      app: 'busy-mobile',
      callbackURL: `${Expo.Constants.linkingUri}/redirect`,
      scope: ['vote', 'comment'],
    });
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1, paddingTop: 10, backgroundColor: 'white' }}>
          <AppNavigation />
        </View>
      </Provider>
    );
  }
}
