import { COLORS } from '../../constants/styles';
import CurrentUserDrawer from './CurrentUserDrawer';

export const tabNavigatorOptions = {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    activeTintColor: COLORS.PRIMARY_COLOR,
    inactiveTintColor: COLORS.TERTIARY_COLOR,
    style: {
      backgroundColor: COLORS.PRIMARY_BACKGROUND_COLOR,
      borderTopColor: COLORS.PRIMARY_BORDER_COLOR,
    },
    indicatorStyle: {
      backgroundColor: COLORS.PRIMARY_COLOR,
    },
  },
};

export const drawerNavigatorConfig = {
  drawerBackgroundColor: COLORS.PRIMARY_BACKGROUND_COLOR,
  contentOptions: {
    activeTintColor: COLORS.PRIMARY_COLOR,
    activeBackgroundColor: COLORS.PRIMARY_BACKGROUND_COLOR,
  },
  contentComponent: CurrentUserDrawer,
};
