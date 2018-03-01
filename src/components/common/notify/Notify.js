import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Modal } from 'react-native';
import ModalHeader from 'components/common/modal/ModalHeader';
import ModalFooter from 'components/common/modal/ModalFooter';
import { COLORS } from 'constants/styles';
import i18n from 'i18n/i18n';

const TouchableContainer = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Container = styled.View`
  padding-top: 10px;
  background-color: ${COLORS.WHITE.WHITE};
`;

const ModalContent = styled.View`
  padding: 16px;
  border-bottom-color: ${COLORS.WHITE.WHITE_SMOKE};
  border-bottom-width: 1px;
`;

const ModalContentText = styled.Text``;

class Notify extends Component {
  static propTypes = {
    displayNotifyModal: PropTypes.bool.isRequired,
    hideNotifyModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };

  render() {
    const { hideNotifyModal, displayNotifyModal, title, description } = this.props;
    return (
      <Modal
        animationType="slide"
        visible={displayNotifyModal}
        transparent
        onRequestClose={hideNotifyModal}
      >
        <TouchableContainer onPress={hideNotifyModal}>
          <Container>
            <ModalHeader title={title} closeModal={hideNotifyModal} />
            <ModalContent>
              <ModalContentText>{description}</ModalContentText>
            </ModalContent>
            <ModalFooter
              cancelText={i18n.general.cancel}
              cancelPress={hideNotifyModal}
              displaySuccess={false}
            />
          </Container>
        </TouchableContainer>
      </Modal>
    );
  }
}
export default Notify;
