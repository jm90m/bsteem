import React from 'react';
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import { ICON_SIZES, MATERIAL_ICONS } from 'constants/styles';

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const BackButton = ({ navigateBack, iconName, customTheme }) => (
  <BackTouchable onPress={navigateBack}>
    <MaterialIcons size={ICON_SIZES.menuIcon} name={iconName} color={customTheme.secondaryColor} />
  </BackTouchable>
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
