import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import Touchable from 'components/common/Touchable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ICON_SIZES, FONTS } from 'constants/styles';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';

const styles = StyleSheet.create({
  menuContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    width: 50,
  },
  count: {
    marginLeft: 5,
    fontSize: 18,
    fontFamily: FONTS.PRIMARY,
  },
});

const SearchMenuButton = ({ handleSetCurrentMenu, isSelected, customTheme, count, iconName }) => {
  const menuContentStyles = [
    styles.menuContent,
    {
      borderBottomColor: isSelected ? customTheme.primaryColor : 'transparent',
    },
  ];
  const selectedColor = isSelected ? customTheme.primaryColor : customTheme.secondaryColor;
  const countStyles = [
    styles.count,
    {
      color: selectedColor,
    },
  ];
  return (
    <Touchable onPress={handleSetCurrentMenu}>
      <View style={styles.menuContainer}>
        <View style={menuContentStyles}>
          <MaterialCommunityIcons
            name={iconName}
            size={ICON_SIZES.menuIcon}
            color={selectedColor}
          />
          <Text style={countStyles}>{count}</Text>
        </View>
      </View>
    </Touchable>
  );
};

SearchMenuButton.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  isSelected: PropTypes.bool,
  handleSetCurrentMenu: PropTypes.func,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconName: PropTypes.string,
};

SearchMenuButton.defaultProps = {
  isSelected: false,
  handleSetCurrentMenu: () => {},
  count: 0,
  iconName: '',
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(SearchMenuButton);
