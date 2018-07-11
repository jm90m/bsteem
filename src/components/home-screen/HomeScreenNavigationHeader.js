import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getCustomTheme, getIntl } from '../../state/rootReducer';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from '../../constants/styles';

import Header from 'components/common/Header';
import TitleText from 'components/common/TitleText';

const styles = StyleSheet.create({
  touchableMenu: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 3,
  },
  filterMenuIcon: {
    marginTop: 3,
  },
  headerIcon: {
    padding: 5,
  },
});

const HomeScreenNavigationHeader = ({
  customTheme,
  intl,
  currentFilter,
  handleDisplayPriceModal,
  handleNavigateToSavedTags,
  handleDisplayMenu,
}) => {
  return (
    <Header>
      <TouchableOpacity onPress={handleDisplayPriceModal}>
        <MaterialCommunityIcons
          name={MATERIAL_COMMUNITY_ICONS.lineChart}
          size={ICON_SIZES.menuIcon}
          color={customTheme.primaryColor}
          style={styles.headerIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDisplayMenu} style={styles.touchableMenu}>
        <MaterialIcons
          name={currentFilter.icon}
          size={ICON_SIZES.menuIcon}
          color={customTheme.primaryColor}
        />
        <TitleText style={styles.titleText}>{intl[currentFilter.label]}</TitleText>
        <View style={styles.filterMenuIcon}>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.chevronDown}
            size={ICON_SIZES.menuIcon}
            color={customTheme.primaryColor}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNavigateToSavedTags}>
        <MaterialCommunityIcons
          name={MATERIAL_COMMUNITY_ICONS.star}
          size={ICON_SIZES.menuIcon}
          style={styles.headerIcon}
          color={customTheme.primaryColor}
        />
      </TouchableOpacity>
    </Header>
  );
};

HomeScreenNavigationHeader.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  handleDisplayMenu: PropTypes.func,
  handleDisplayPriceModal: PropTypes.func,
  handleNavigateToSavedTags: PropTypes.func,
  currentFilter: PropTypes.shape(),
};

HomeScreenNavigationHeader.defaultProps = {
  handleDisplayMenu: () => {},
  handleDisplayPriceModal: () => {},
  handleNavigateToSavedTags: () => {},
  currentFilter: {},
};

export default connect(state => ({ customTheme: getCustomTheme(state), intl: getIntl(state) }))(
  HomeScreenNavigationHeader,
);
