import React from 'react';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import { COLORS, ICON_SIZES } from 'constants/styles';
import tinycolor from 'tinycolor2';

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

const MenuIcon = ({ size, customTheme, name, isMaterialIcon }) => {
  const Icon = isMaterialIcon ? MaterialIcons : MaterialCommunityIcons;

  return (
    <Icon
      name={name}
      color={
        tinycolor(customTheme.primaryBackgroundColor).isDark()
          ? COLORS.LIGHT_TEXT_COLOR
          : COLORS.DARK_TEXT_COLOR
      }
      size={size}
    />
  );
};

MenuIcon.propTypes = {
  size: PropTypes.number,
  isMaterialIcon: PropTypes.bool,
  customTheme: PropTypes.shape().isRequired,
  name: PropTypes.string.isRequired,
};

MenuIcon.defaultProps = {
  size: ICON_SIZES.menuModalOptionIcon,
  isMaterialIcon: false,
};

export default connect(mapStateToProps)(MenuIcon);
