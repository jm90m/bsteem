import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import commonStyles from 'styles/common';
import LargeLoading from 'components/common/LargeLoading';
import PostNavigationHeader from './PostNavigationHeader';

const PostNavigationLoadingHeaderContainer = ({ author, handleDisplayMenu, navigateBack }) => (
  <View style={commonStyles.container}>
    <PostNavigationHeader
      author={author}
      displayMenu={handleDisplayMenu}
      navigateBack={navigateBack}
    />
    <View style={commonStyles.screenLoader}>
      <LargeLoading />
    </View>
  </View>
);

PostNavigationLoadingHeaderContainer.propTypes = {
  author: PropTypes.string,
  handleDisplayMenu: PropTypes.func,
  navigateBack: PropTypes.func,
};

PostNavigationLoadingHeaderContainer.defaultProps = {
  author: '',
  handleDisplayMenu: () => {},
  navigateBack: () => {},
};

export default PostNavigationLoadingHeaderContainer;
