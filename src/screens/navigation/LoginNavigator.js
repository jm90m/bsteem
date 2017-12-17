import React from 'react';
import { StackNavigator } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons';
import { MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import LoginScreen from 'screens/login-screen/LoginScreen';
import UserScreen from 'screens/user-screen/UserScreen';
import PostScreen from 'screens/stack-screens/PostScreen';
import FeedScreen from 'screens/stack-screens/FeedScreen';
import CommentsScreen from 'screens/stack-screens/CommentsScreen';

const screenNavigationOptions = {
  tabBarIcon: ({ tintColor }) => (
    <MaterialIcons name={MATERIAL_ICONS.login} size={ICON_SIZES.tabBarIcon} color={tintColor} />
  ),
};

const LoginNavigator = StackNavigator(
  {
    [navigationConstants.LOGIN]: {
      screen: LoginScreen,
    },
    [navigationConstants.POST]: {
      screen: PostScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.FEED]: {
      screen: FeedScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.USER]: {
      screen: UserScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.COMMENTS]: {
      screen: CommentsScreen,
      navigationOptions: screenNavigationOptions,
    },
  },
  {
    headerMode: 'none',
  },
);

export default LoginNavigator;
