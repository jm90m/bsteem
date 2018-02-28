import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { COLORS } from '../../../constants/styles';

const { width: deviceWidth } = Dimensions.get('screen');

const MenuWrapper = styled.View`
  background-color: ${COLORS.WHITE.GAINSBORO};
  z-index: 1;
  border-radius: 4px;
  width: ${deviceWidth - 20}px;
  margin-bottom: 10px;
`;

export default MenuWrapper;
