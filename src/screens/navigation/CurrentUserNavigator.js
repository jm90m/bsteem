import React from 'react';
import { StackNavigator } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons';
import { MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import UserScreen from 'screens/user-screen/UserScreen';
import PostScreen from 'screens/stack-screens/PostScreen';
import FeedScreen from 'screens/stack-screens/FeedScreen';
import CommentsScreen from 'screens/stack-screens/CommentsScreen';
import CurrentUserScreen from 'screens/current-user-screen/CurrentUserScreen';

const screenNavigationOptions = {
  tabBarIcon: ({ tintColor }) => (
    <MaterialIcons name={MATERIAL_ICONS.home} size={ICON_SIZES.tabBarIcon} color={tintColor} />
  ),
};

const CurrentUserNavigator = StackNavigator(
  {
    [navigationConstants.CURRENT_USER]: {
      screen: CurrentUserScreen,
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

export default CurrentUserNavigator;
