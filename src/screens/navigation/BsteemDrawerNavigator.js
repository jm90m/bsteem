import React from 'react';
import { createBottomTabNavigator, createDrawerNavigator } from 'react-navigation';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import MessagesScreen from '../stack-screens/MessagesScreen';
import EditProfileScreen from '../stack-screens/EditProfileScreen';
import UserWalletScreen from '../stack-screens/UserWalletScreen';
import NotificationsScreen from '../stack-screens/NotificationsScreen';
import CustomThemeScreen from '../stack-screens/CustomThemeScreen';
import * as navigationConstants from '../../constants/navigation';
import SettingsScreen from '../stack-screens/SettingsScreen';
import { FONT_AWESOME_ICONS, ICON_SIZES, MATERIAL_ICONS } from '../../constants/styles';
import HomeNavigator from './sub-navigation/HomeNavigator';
import CurrentUserNavigator from './sub-navigation/CurrentUserNavigator';
import SearchNavigator from './sub-navigation/SearchNavigator';
import LoginNavigator from './sub-navigation/LoginNavigator';
import PostCreationNavigator from './sub-navigation/PostCreationNavigator';
import { drawerNavigatorConfig, tabNavigatorOptions } from './navigatorOptions';

const AuthUserNavigator = createBottomTabNavigator(
  {
    [navigationConstants.CURRENT_USER]: {
      screen: CurrentUserNavigator,
      navigationOptions: ({ navigation }) => {
        const tabBarVisible = navigation.state.index === 0;
        return {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons
              name={MATERIAL_ICONS.home}
              size={ICON_SIZES.tabBarIcon}
              color={tintColor}
            />
          ),
          tabBarVisible,
        };
      },
    },
    [navigationConstants.HOME]: {
      screen: HomeNavigator,
      navigationOptions: ({ navigation }) => {
        const tabBarVisible = navigation.state.index === 0;
        return {
          tabBarIcon: ({ tintColor }) => (
            <FontAwesome
              name={FONT_AWESOME_ICONS.news}
              size={ICON_SIZES.tabBarIcon}
              color={tintColor}
            />
          ),
          tabBarVisible,
        };
      },
    },
    [navigationConstants.POST_CREATION]: {
      screen: PostCreationNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons
            name={MATERIAL_ICONS.create}
            size={ICON_SIZES.tabBarIcon}
            color={tintColor}
          />
        ),
      },
    },
    [navigationConstants.SEARCH]: {
      screen: SearchNavigator,
      navigationOptions: ({ navigation }) => {
        const tabBarVisible = navigation.state.index === 0;
        return {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons
              name={MATERIAL_ICONS.search}
              size={ICON_SIZES.tabBarIcon}
              color={tintColor}
            />
          ),
          tabBarVisible,
        };
      },
    },
    [navigationConstants.LOGIN]: {
      screen: LoginNavigator,
      navigationOptions: ({ navigation }) => {
        const tabBarVisible = navigation.state.index === 0;
        return {
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons
              name={MATERIAL_ICONS.login}
              size={ICON_SIZES.tabBarIcon}
              color={tintColor}
            />
          ),
          tabBarVisible,
        };
      },
    },
  },
  tabNavigatorOptions,
);

const BsteemDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AuthUserNavigator,
    },
    [navigationConstants.NOTIFICATIONS]: {
      screen: NotificationsScreen,
    },
    [navigationConstants.MESSAGES]: {
      screen: MessagesScreen,
    },
    [navigationConstants.SETTINGS]: {
      screen: SettingsScreen,
    },
    [navigationConstants.EDIT_PROFILE]: {
      screen: EditProfileScreen,
    },
    [navigationConstants.USER_WALLET]: {
      screen: UserWalletScreen,
    },
    [navigationConstants.CUSTOM_THEME]: {
      screen: CustomThemeScreen,
    },
  },
  drawerNavigatorConfig,
);

export default BsteemDrawerNavigator;
