import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { COLORS } from '../../../constants/styles';
const { width } = Dimensions.get('screen');

const MenuModalButton = styled.TouchableOpacity`
  padding: 10px;
  width: ${width};
  margin: 2px 0;
  background-color: white;
  border-bottom-color: ${COLORS.WHITE.GAINSBORO};
  border-bottom-width: 1px;
`;

export default MenuModalButton;
