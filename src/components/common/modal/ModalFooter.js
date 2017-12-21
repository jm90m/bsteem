import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';

const Container = styled.View`
  flex-direction: row-reverse;
  border-bottom-color: ${COLORS.WHITE.WHITE_SMOKE};
  border-bottom-width: 1px;
  padding: 10px 16px 10px 10px;;
`;

const Button = styled.TouchableOpacity`
  padding: 16px;
  background-color: ${props => props.backgroundColor};
  border: 2px solid ${props => props.borderColor};
  border-radius: 4px;
  margin: 0 5px;
`;

const ButtonText = styled.Text`
  color: ${props => props.color};
`;

const ModalFooter = ({ cancelText, cancelPress, successText, successPress }) => (
  <Container>
    <Button
      backgroundColor={COLORS.BLUE.MARINER}
      borderColor={COLORS.BLUE.MARINER}
      onPress={successPress}
    >
      <ButtonText color={COLORS.WHITE.WHITE}>{successText}</ButtonText>
    </Button>
    <Button
      backgroundColor={COLORS.WHITE.WHITE}
      borderColor={COLORS.WHITE.WHITE_SMOKE}
      onPress={cancelPress}
    >
      <ButtonText color={COLORS.BLUE.MARINER}>{cancelText}</ButtonText>
    </Button>
  </Container>
);

ModalFooter.propTypes = {
  cancelText: PropTypes.string,
  cancelPress: PropTypes.func,
  successText: PropTypes.string,
  successPress: PropTypes.func,
};

ModalFooter.defaultProps = {
  cancelText: '',
  cancelPress: () => {},
  successText: '',
  successPress: () => {},
};

export default ModalFooter;
