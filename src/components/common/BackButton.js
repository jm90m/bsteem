import React from 'react';
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import { ICON_SIZES, MATERIAL_ICONS } from 'constants/styles';
import Touchable from 'components/common/Touchable';
import commonStyles from 'styles/common';

const BackButton = ({ navigateBack, iconName, customTheme }) => (
  <Touchable onPress={navigateBack}>
    <View style={commonStyles.backButton}>
      <MaterialIcons
        size={ICON_SIZES.menuIcon}
        name={iconName}
        color={customTheme.secondaryColor}
      />
    </View>
  </Touchable>
);

BackButton.propTypes = {
  navigateBack: PropTypes.func.isRequired,
  customTheme: PropTypes.shape().isRequired,
  iconName: PropTypes.string,
};

BackButton.defaultProps = {
  iconName: MATERIAL_ICONS.back,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(BackButton);
