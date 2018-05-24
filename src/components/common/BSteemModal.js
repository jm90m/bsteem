import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';

const BSteemModal = props => (
  <Modal
    {...props}
    isVisible={props.visible}
    onBackdropPress={props.handleOnClose}
    onBackButtonPress={props.handleOnClose}
  >
    {props.children}
  </Modal>
);

BSteemModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  handleOnClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

BSteemModal.defaultProps = {
  children: null,
};

export default BSteemModal;
