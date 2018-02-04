import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import PhotoBrowser from 'react-native-photo-browser';

const PostPhotoBrowser = ({ displayPhotoBrowser, mediaList, initialPhotoIndex, handleClose }) => (
  <Modal animationType="slide" visible={displayPhotoBrowser} onRequestClose={handleClose}>
    <PhotoBrowser
      onBack={handleClose}
      mediaList={mediaList}
      initialIndex={initialPhotoIndex}
      displayNavArrows
      displayActionButton
      enableGrid={false}
      displaySelectionButtons={false}
      useCircleProgress
      onSelectionChanged={() => {}}
      onActionButton={() => {}}
      alwaysDisplayStatusBar
    />
  </Modal>
);

PostPhotoBrowser.propTypes = {
  displayPhotoBrowser: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  mediaList: PropTypes.arrayOf(PropTypes.shape()),
  initialPhotoIndex: PropTypes.number,
};

PostPhotoBrowser.defaultProps = {
  mediaList: [],
  initialPhotoIndex: 0,
};

export default PostPhotoBrowser;
