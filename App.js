import React from 'react';
import { View } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import sc2 from 'api/sc2';
import { Provider } from 'react-redux';
import Expo from 'expo';
import { COLORS } from 'constants/styles';
import HomeScreen from 'screens/HomeScreen';
import TagsScreen from 'screens/TagsScreen';
import LoginScreen from 'screens/LoginScreen';
import UserScreen from 'screens/user-screen/UserScreen';
import PostScreen from 'screens/stack-screens/PostScreen';
import FeedScreen from 'screens/stack-screens/FeedScreen';
import CommentsScreen from 'screens/stack-screens/CommentsScreen';
import configureStore from 'state/configureStore';
import * as navigation from 'constants/navigation';

const HomeNavigator = StackNavigator(
  {
    [navigation.HOME]: {
      screen: HomeScreen,
    },
    [navigation.POST]: {
      screen: PostScreen,
    },
    [navigation.FEED]: {
      screen: FeedScreen,
    },
    [navigation.COMMENTS]: {
      screen: CommentsScreen,
    },
    [navigation.USER]: {
      screen: UserScreen,
    },
  },
  {
    headerMode: 'none',
  },
);

const TagsNavigator = StackNavigator(
  {
    [navigation.TAGS]: {
      screen: TagsScreen,
    },
    [navigation.FEED]: {
      screen: FeedScreen,
    },
    [navigation.USER]: {
      screen: UserScreen,
    },
  },
  {
    headerMode: 'none',
  },
);

const AppNavigation = TabNavigator(
  {
    [navigation.HOME]: {
      screen: HomeNavigator,
    },
    [navigation.TAGS]: {
      screen: TagsNavigator,
    },
    [navigation.LOGIN]: {
      screen: LoginScreen,
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
