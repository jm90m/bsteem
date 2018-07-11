import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons';
import * as navigationConstants from 'constants/navigation';
import UserScreen from 'screens/user-screen/UserScreen';
import PostScreen from 'screens/stack-screens/PostScreen';
import FeedScreen from 'screens/stack-screens/FeedScreen';
import CommentsScreen from 'screens/stack-screens/CommentsScreen';
import CurrentUserScreen from 'screens/current-user-screen/CurrentUserScreen';
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
import MessagesScreen from 'screens/stack-screens/MessagesScreen';
import UserMessageScreen from 'screens/stack-screens/UserMessageScreen';
import TransferScreen from 'screens/stack-screens/TransferScreen';
import RepliesFeedScreen from 'screens/stack-screens/RepliesFeedScreen';
import NotificationsScreen from 'screens/stack-screens/NotificationsScreen';
import BeneficiariesScreen from 'screens/stack-screens/BeneficiariesScreen';
import SettingsScreen from 'screens/stack-screens/SettingsScreen';
import CustomThemeScreen from 'screens/stack-screens/CustomThemeScreen';
import AppsScreen from 'screens/stack-screens/AppsScreen';

const CurrentUserNavigator = createStackNavigator(
  {
    [navigationConstants.CURRENT_USER]: {
      screen: CurrentUserScreen,
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
    [navigationConstants.USER_FOLLOWERS]: {
      screen: FollowersScreen,
    },
    [navigationConstants.USER_FOLLOWING]: {
      screen: FollowingScreen,
    },
    [navigationConstants.USER_ACTIVITY]: {
      screen: UserActivityScreen,
    },
    [navigationConstants.USER_WALLET]: {
      screen: UserWalletScreen,
    },
    [navigationConstants.SAVED_CONTENT]: {
      screen: SavedContentScreen,
    },
    [navigationConstants.VOTES]: {
      screen: VotesScreen,
    },
    [navigationConstants.REPLY]: {
      screen: ReplyScreen,
    },
    [navigationConstants.EDIT_REPLY]: {
      screen: EditReplyScreen,
    },
    [navigationConstants.EDIT_POST]: {
      screen: EditPostScreen,
    },
    [navigationConstants.EDIT_PROFILE]: {
      screen: EditProfileScreen,
    },
    [navigationConstants.MESSAGES]: {
      screen: MessagesScreen,
    },
    [navigationConstants.USER_MESSAGE]: {
      screen: UserMessageScreen,
    },
    [navigationConstants.TRANSFERS]: {
      screen: TransferScreen,
    },
    [navigationConstants.USER_REPLIES]: {
      screen: RepliesFeedScreen,
    },
    [navigationConstants.NOTIFICATIONS]: {
      screen: NotificationsScreen,
    },
    [navigationConstants.POST_BENEFICIARIES]: {
      screen: BeneficiariesScreen,
    },
    [navigationConstants.SETTINGS]: {
      screen: SettingsScreen,
    },
    [navigationConstants.CUSTOM_THEME]: {
      screen: CustomThemeScreen,
    },
    [navigationConstants.PLATFORM_APPS]: {
      screen: AppsScreen,
    },
  },
  {
    headerMode: 'none',
  },
);

export default CurrentUserNavigator;
