import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons';
import { MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import LoginScreen from 'screens/login-screen/LoginScreen';
import UserScreen from 'screens/user-screen/UserScreen';
import PostScreen from 'screens/stack-screens/PostScreen';
import FeedScreen from 'screens/stack-screens/FeedScreen';
import CommentsScreen from 'screens/stack-screens/CommentsScreen';
import LogoutScreen from 'screens/login-screen/LogoutScreen';
import FollowersScreen from 'screens/stack-screens/FollowersScreen';
import FollowingScreen from 'screens/stack-screens/FollowingScreen';
import UserActivityScreen from 'screens/stack-screens/UserActivityScreen';
import UserWalletScreen from 'screens/stack-screens/UserWalletScreen';
import VotesScreen from 'screens/stack-screens/VotesScreen';
import ReplyScreen from 'screens/stack-screens/ReplyScreen';
import EditReplyScreen from 'screens/stack-screens/EditReplyScreen';
import SettingsScreen from 'screens/stack-screens/SettingsScreen';
import EditPostScreen from 'screens/post-creation-screen/EditPostScreen';
import EditProfileScreen from 'screens/stack-screens/EditProfileScreen';
import UserMessageScreen from 'screens/stack-screens/UserMessageScreen';
import TransferScreen from 'screens/stack-screens/TransferScreen';
import CustomThemeScreen from 'screens/stack-screens/CustomThemeScreen';
import RepliesFeedScreen from 'screens/stack-screens/RepliesFeedScreen';
import BeneficiariesScreen from 'screens/stack-screens/BeneficiariesScreen';

const screenNavigationOptions = {
  tabBarIcon: ({ tintColor }) => (
    <MaterialIcons name={MATERIAL_ICONS.login} size={ICON_SIZES.tabBarIcon} color={tintColor} />
  ),
};

const LoginNavigator = createStackNavigator(
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
    [navigationConstants.LOGOUT]: {
      screen: LogoutScreen,
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
    [navigationConstants.SETTINGS]: {
      screen: SettingsScreen,
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
    [navigationConstants.CUSTOM_THEME]: {
      screen: CustomThemeScreen,
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

export default LoginNavigator;
