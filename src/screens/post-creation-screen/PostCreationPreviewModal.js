import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import PostCreationPreview from './PostCreationPreview';

class PostCreationPreviewModal extends Component {
  static propTypes = {
    handleHidePreview: PropTypes.func.isRequired,
    previewVisible: PropTypes.bool.isRequired,
    postData: PropTypes.shape().isRequired,
  };

  render() {
    const { handleHidePreview, previewVisible, postData } = this.props;

    if (!previewVisible) {
      return null;
    }

    return (
      <Modal animationType="slide" visible={previewVisible} onRequestClose={handleHidePreview}>
        <PostCreationPreview handleHidePreview={handleHidePreview} postData={postData} />
      </Modal>
    );
  }
}

export default PostCreationPreviewModal;
