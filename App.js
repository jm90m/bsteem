import React from 'react';
import { View } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import sc2 from './src/api/sc2';
import Expo from 'expo';
import HomeScreen from 'screens/HomeScreen';
import TagsScreen from 'screens/TagsScreen';
import LoginScreen from 'screens/LoginScreen';
import UserScreen from 'screens/stack-screens/UserScreen';
import PostScreen from 'screens/stack-screens/PostScreen';
import FeedScreen from 'screens/stack-screens/FeedScreen';
import CommentsScreen from 'screens/stack-screens/CommentsScreen';
import configureStore from 'state/configureStore';
import { Provider } from 'react-redux';

const HomeNavigator = StackNavigator(
  {
    HOME: {
      screen: HomeScreen,
    },
    POST: {
      screen: PostScreen,
    },
    FEED: {
      screen: FeedScreen,
    },
    COMMENTS: {
      screen: CommentsScreen,
    },
    USER: {
      screen: UserScreen,
    },
  },
  {
    headerMode: 'none',
  },
);

const TagsNavigator = StackNavigator(
  {
    TAGS: {
      screen: TagsScreen,
    },
    FEED: {
      screen: FeedScreen,
    },
  },
  {
    headerMode: 'none',
  },
);

const AppNavigation = TabNavigator(
  {
    HOME: {
      screen: HomeNavigator,
    },
    TAGS: {
      screen: TagsNavigator,
    },
    LOGIN: {
      screen: LoginScreen,
    },
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
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
