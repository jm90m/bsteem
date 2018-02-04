import React from 'react';
import { StackNavigator } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons';
import { MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import SearchScreen from 'screens/SearchScreen';
import UserScreen from 'screens/user-screen/UserScreen';
import FeedScreen from 'screens/stack-screens/FeedScreen';
import FetchPostScreen from 'screens/stack-screens/FetchPostScreen';
import UserActivityScreen from 'screens/stack-screens/UserActivityScreen';
import UserWalletScreen from 'screens/stack-screens/UserWalletScreen';
import FollowingScreen from 'screens/stack-screens/FollowingScreen';
import FollowersScreen from 'screens/stack-screens/FollowersScreen';

const screenNavigationOptions = {
  tabBarIcon: ({ tintColor }) => (
    <MaterialIcons name={MATERIAL_ICONS.search} size={ICON_SIZES.tabBarIcon} color={tintColor} />
  ),
};

const SearchNavigator = StackNavigator(
  {
    [navigationConstants.SEARCH]: {
      screen: SearchScreen,
    },
    [navigationConstants.FEED]: {
      screen: FeedScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.USER]: {
      screen: UserScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.FETCH_POST]: {
      screen: FetchPostScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.USER_ACTIVITY]: {
      screen: UserActivityScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.USER_WALLET]: {
      screen: UserWalletScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.USER_FOLLOWERS]: {
      screen: FollowersScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.USER_FOLLOWING]: {
      screen: FollowingScreen,
      navigationOptions: screenNavigationOptions,
    },
  },
  {
    headerMode: 'none',
  },
);

export default SearchNavigator;
