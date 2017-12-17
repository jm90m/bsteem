import React from 'react';
import { StackNavigator } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';
import { FONT_AWESOME_ICONS, ICON_SIZES } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import HomeScreen from 'screens/HomeScreen';
import UserScreen from 'screens/user-screen/UserScreen';
import PostScreen from 'screens/stack-screens/PostScreen';
import FeedScreen from 'screens/stack-screens/FeedScreen';
import CommentsScreen from 'screens/stack-screens/CommentsScreen';

const screenNavigationOptions = {
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome name={FONT_AWESOME_ICONS.news} size={ICON_SIZES.tabBarIcon} color={tintColor} />
  ),
};

const HomeNavigator = StackNavigator(
  {
    [navigationConstants.HOME]: {
      screen: HomeScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.POST]: {
      screen: PostScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.FEED]: {
      screen: FeedScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.COMMENTS]: {
      screen: CommentsScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.USER]: {
      screen: UserScreen,
      navigationOptions: screenNavigationOptions,
    },
  },
  {
    headerMode: 'none',
  },
);

export default HomeNavigator;
