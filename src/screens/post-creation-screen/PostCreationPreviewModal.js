import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import SafeAreaView from 'components/common/SafeAreaView';
import PostCreationPreview from './PostCreationPreview';

class PostCreationPreviewModal extends React.PureComponent {
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
        <SafeAreaView>
          <PostCreationPreview
            handleHidePreview={handleHidePreview}
            postData={postData}
            createPostDisplayInPreview={createPostDisplayInPreview}
            handlePostPreviewSubmit={handlePostPreviewSubmit}
          />
        </SafeAreaView>
      </Modal>
    );
  }
}

export default PostCreationPreviewModal;
