import { COLORS } from 'constants/styles';
import styled from 'styled-components/native';

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${COLORS.PRIMARY_BACKGROUND_COLOR};
  border-bottom-color: ${COLORS.PRIMARY_BORDER_COLOR};
  border-bottom-width: 1px;
  width: 100%;
  padding-top: 20px;
  min-height: 45px;
`;

export default Header;
