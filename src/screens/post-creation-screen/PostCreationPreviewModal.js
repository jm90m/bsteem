import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import PostCreationPreview from './PostCreationPreview';

class PostCreationPreviewModal extends Component {
  static propTypes = {
    handleHidePreview: PropTypes.func.isRequired,
    previewVisible: PropTypes.bool.isRequired,
    createPostDisplayInPreview: PropTypes.bool,
    postData: PropTypes.shape().isRequired,
    handlePostPreviewSubmit: PropTypes.func,
  };

  static defaultProps = {
    handlePostPreviewSubmit: () => {},
    createPostDisplayInPreview: false,
  };

  render() {
    const {
      handleHidePreview,
      previewVisible,
      postData,
      createPostDisplayInPreview,
      handlePostPreviewSubmit,
    } = this.props;

    if (!previewVisible) {
      return null;
    }

    return (
      <Modal animationType="slide" visible={previewVisible} onRequestClose={handleHidePreview}>
        <PostCreationPreview
          handleHidePreview={handleHidePreview}
          postData={postData}
          createPostDisplayInPreview={createPostDisplayInPreview}
          handlePostPreviewSubmit={handlePostPreviewSubmit}
        />
      </Modal>
    );
  }
}

export default PostCreationPreviewModal;
