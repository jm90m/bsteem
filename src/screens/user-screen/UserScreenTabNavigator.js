import React from 'react';
import { TabNavigator } from 'react-navigation';
import * as navigation from 'constants/navigation';
import { COLORS } from 'constants/styles';
import UserBlogScreen from './UserBlog';
import UserCommentsScreen from './UserCommentsScreen';
import UserFollowingScreen from './UserFollowingScreen';
import UserFollowerScreen from './UserFollowerScreen';
import UserWalletScreen from './UserWalletScreen';
import UserActivityScreen from './UserActivityScreen';

const UserScreenTabNavigator = TabNavigator(
  {
    [navigation.USER_BLOG]: {
      screen: UserBlogScreen,
    },
    [navigation.USER_COMMENTS]: {
      screen: UserCommentsScreen,
    },
    [navigation.USER_FOLLOWERS]: {
      screen: UserFollowerScreen,
    },
    [navigation.USER_FOLLOWING]: {
      screen: UserFollowingScreen,
    },
    [navigation.USER_WALLET]: {
      screen: UserWalletScreen,
    },
    [navigation.USER_ACTIVITY]: {
      screen: UserActivityScreen,
    },
  },
  {
    tabBarPosition: 'top',
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

const UserScreen = () => <UserScreenTabNavigator />;

export default UserScreenTabNavigator;
