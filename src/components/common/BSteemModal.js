import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';

class BSteemModal extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    handleOnClose: PropTypes.func.isRequired,
  };

  render() {
    const { visible, handleOnClose } = this.props;
    return (
      <Modal
        {...this.props}
        isVisible={visible}
        onBackdropPress={handleOnClose}
        onBackButtonPress={handleOnClose}
      >
        {this.props.children}
      </Modal>
    );
  }
}

export default BSteemModal;
