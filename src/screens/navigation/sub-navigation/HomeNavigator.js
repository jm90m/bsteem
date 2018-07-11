import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';
import { FONT_AWESOME_ICONS, ICON_SIZES } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import HomeScreen from 'screens/HomeScreen';
import UserScreen from 'screens/user-screen/UserScreen';
import PostScreen from 'screens/stack-screens/PostScreen';
import FeedScreen from 'screens/stack-screens/FeedScreen';
import CommentsScreen from 'screens/stack-screens/CommentsScreen';
import FollowersScreen from 'screens/stack-screens/FollowersScreen';
import FollowingScreen from 'screens/stack-screens/FollowingScreen';
import UserActivityScreen from 'screens/stack-screens/UserActivityScreen';
import UserWalletScreen from 'screens/stack-screens/UserWalletScreen';
import SavedContentScreen from 'screens/SavedContentScreen';
import VotesScreen from 'screens/stack-screens/VotesScreen';
import ReplyScreen from 'screens/stack-screens/ReplyScreen';
import EditReplyScreen from 'screens/stack-screens/EditReplyScreen';
import EditPostScreen from 'screens/post-creation-screen/EditPostScreen';
import EditProfileScreen from 'screens/stack-screens/EditProfileScreen';
import UserMessageScreen from 'screens/stack-screens/UserMessageScreen';
import TransferScreen from 'screens/stack-screens/TransferScreen';
import RepliesFeedScreen from 'screens/stack-screens/RepliesFeedScreen';
import BeneficiariesScreen from 'screens/stack-screens/BeneficiariesScreen';

const screenNavigationOptions = {
  tabBarIcon: ({ tintColor }) => (
    <FontAwesome name={FONT_AWESOME_ICONS.news} size={ICON_SIZES.tabBarIcon} color={tintColor} />
  ),
  headerMode: 'none',
};

const HomeNavigator = createStackNavigator(
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
    [navigationConstants.USER_FOLLOWERS]: {
      screen: FollowersScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.USER_FOLLOWING]: {
      screen: FollowingScreen,
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
    [navigationConstants.SAVED_CONTENT]: {
      screen: SavedContentScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.VOTES]: {
      screen: VotesScreen,
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
    [navigationConstants.EDIT_POST]: {
      screen: EditPostScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.EDIT_PROFILE]: {
      screen: EditProfileScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.USER_MESSAGE]: {
      screen: UserMessageScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.TRANSFERS]: {
      screen: TransferScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.USER_REPLIES]: {
      screen: RepliesFeedScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.POST_BENEFICIARIES]: {
      screen: BeneficiariesScreen,
      navigationOptions: screenNavigationOptions,
    },
  },
  {
    headerMode: 'none',
  },
);

export default HomeNavigator;
