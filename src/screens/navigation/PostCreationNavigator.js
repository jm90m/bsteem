import React from 'react';
import { StackNavigator } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons';
import { MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import PostCreationScreen from 'screens/post-creation-screen/PostCreationScreen';
import SignatureEditorScreen from 'screens/stack-screens/SignatureEditorScreen';

const screenNavigationOptions = {
  tabBarIcon: ({ tintColor }) => (
    <MaterialIcons name={MATERIAL_ICONS.create} size={ICON_SIZES.tabBarIcon} color={tintColor} />
  ),
};

const HomeNavigator = StackNavigator(
  {
    [navigationConstants.POST_CREATION]: {
      screen: PostCreationScreen,
      navigationOptions: screenNavigationOptions,
    },
    [navigationConstants.SIGNATURE_EDITOR]: {
      screen: SignatureEditorScreen,
      navigationOptions: screenNavigationOptions,
    },
  },
  {
    headerMode: 'none',
  },
);

export default HomeNavigator;
