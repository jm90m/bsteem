import styled from 'styled-components/native';
import { FONTS } from 'constants/styles';
import StyledTextByBackground from '../StyledTextByBackground';

const MenuText = styled(StyledTextByBackground)`
  margin-left: 5px;
  font-family: ${FONTS.SECONDARY};
`;

export default MenuText;
