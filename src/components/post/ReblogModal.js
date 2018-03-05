import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import ModalHeader from 'components/common/modal/ModalHeader';
import ModalFooter from 'components/common/modal/ModalFooter';
import { COLORS } from 'constants/styles';

const TouchableContainer = styled.TouchableOpacity`
  flex: 1;
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

class ReblogModal extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    confirmReblog: PropTypes.func,
  };

  static defaultProps = {
    closeModal: () => {},
    confirmReblog: () => {},
  };

  render() {
    const { closeModal, confirmReblog } = this.props;
    const reblogConfirmText =
      'This post will appear on your personal feed. This action cannot be reversed.';
    return (
      <TouchableContainer onPress={closeModal}>
        <Container>
          <ModalHeader title="Reblog this post?" closeModal={closeModal} />
          <ModalContent>
            <ModalContentText>{reblogConfirmText}</ModalContentText>
          </ModalContent>
          <ModalFooter
            cancelText="Cancel"
            cancelPress={closeModal}
            successText="Reblog"
            successPress={confirmReblog}
          />
        </Container>
      </TouchableContainer>
    );
  }
}
export default ReblogModal;
