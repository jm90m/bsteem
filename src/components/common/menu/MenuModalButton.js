import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';

const MenuModalButton = styled.TouchableOpacity`
  padding: 10px;
  width: 100%;
  margin: 2px 0;
  background-color: white;
  border-top-width: 1px;
  border-top-color: ${COLORS.PRIMARY_BORDER_COLOR};
  border-bottom-color: ${COLORS.PRIMARY_BORDER_COLOR};
  border-bottom-width: 1px;
`;

export default MenuModalButton;
