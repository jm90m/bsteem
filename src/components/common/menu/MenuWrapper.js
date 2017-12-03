import React from 'react';
import styled from 'styled-components/native';
import { COLORS } from '../../../constants/styles';

const MenuWrapper = styled.View`
  border-color: ${COLORS.WHITE.GAINSBORO};
  border-left-width: 1px;
  border-right-width: 1px;
  border-top-width: 1px;
  border-radius: 4px;
  background-color: ${COLORS.WHITE.WHITE};
  z-index: 1;
`;

export default MenuWrapper;
