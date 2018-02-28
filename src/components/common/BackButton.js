import React from 'react';
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { ICON_SIZES, MATERIAL_ICONS } from '../../constants/styles';

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const BackButton = ({ navigateBack, iconName }) => (
  <BackTouchable onPress={navigateBack}>
    <MaterialIcons size={ICON_SIZES.menuIcon} name={iconName} />
  </BackTouchable>
);

BackButton.propTypes = {
  navigateBack: PropTypes.func.isRequired,
  iconName: PropTypes.string,
};

BackButton.defaultProps = {
  iconName: MATERIAL_ICONS.back,
};

export default BackButton;
