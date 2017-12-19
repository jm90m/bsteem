import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 16px 13px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${COLORS.WHITE.WHITE_SMOKE};
`;

const TitleText = styled.Text`
  color: ${COLORS.GREY.NERO};
  font-weight: bold;
  font-size: 16px;
`;

const Touchable = styled.TouchableOpacity`
`;

const ModalHeader = ({ title, closeModal }) => (
  <Container>
    <TitleText>{title}</TitleText>
    <Touchable onPress={closeModal}>
      <MaterialIcons name={MATERIAL_ICONS.close} size={20} />
    </Touchable>
  </Container>
);

ModalHeader.propTypes = {
  title: PropTypes.string,
  closeModal: PropTypes.func,
};

ModalHeader.defaultProps = {
  title: '',
  closeModal: () => {},
};

export default ModalHeader;
