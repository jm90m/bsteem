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
import VotesScreen from '../stack-screens/VotesScreen';
import CommentsScreen from '../stack-screens/CommentsScreen';
import PostScreen from '../stack-screens/PostScreen';
import SavedContentScreen from '../SavedContentScreen';
import ReplyScreen from '../stack-screens/ReplyScreen';
import EditReplyScreen from '../stack-screens/EditReplyScreen';

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
    [navigationConstants.POST]: {
      screen: PostScreen,
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
    [navigationConstants.VOTES]: {
      screen: VotesScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.SAVED_CONTENT]: {
      screen: SavedContentScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.REPLY]: {
      screen: ReplyScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.EDIT_REPLY]: {
      screen: EditReplyScreen,
      navigationOptions: screenNavigationOptions,
    },
  },
  {
    headerMode: 'none',
  },
);

export default SearchNavigator;
