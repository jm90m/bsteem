import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Modal } from 'react-native';
import ModalHeader from 'components/common/modal/ModalHeader';
import ModalFooter from 'components/common/modal/ModalFooter';
import StyledTextByBackground from 'components/common/StyledTextByBackground';

const TouchableContainer = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Container = styled.View`
  padding-top: 10px;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

const ModalContent = styled.View`
  padding: 16px;
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: 1px;
`;

class Notify extends Component {
  static propTypes = {
    displayNotifyModal: PropTypes.bool.isRequired,
    hideNotifyModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  render() {
    const {
      hideNotifyModal,
      displayNotifyModal,
      title,
      description,
      customTheme,
      intl,
    } = this.props;
    return (
      <Modal
        animationType="slide"
        visible={displayNotifyModal}
        transparent
        onRequestClose={hideNotifyModal}
      >
        <TouchableContainer onPress={hideNotifyModal}>
          <Container customTheme={customTheme}>
            <ModalHeader title={title} closeModal={hideNotifyModal} />
            <ModalContent customTheme={customTheme}>
              <StyledTextByBackground>{description}</StyledTextByBackground>
            </ModalContent>
            <ModalFooter
              cancelText={intl.cancel}
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
