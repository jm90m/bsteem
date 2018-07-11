import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Touchable from 'components/common/Touchable';
import { getCustomTheme } from 'state/rootReducer';
import { connect } from 'react-redux';
import Tag from 'components/post/Tag';
import SaveTagButton from 'components/common/SaveTagButton';

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
  },
});
const SearchTagPreview = ({ customTheme, isFirstElement, handleNavigateToFeed, tag }) => {
  const tagContainerStyles = [
    styles.tagContainer,
    {
      borderColor: customTheme.primaryBorderColor,
      backgroundColor: customTheme.primaryBackgroundColor,
      borderTopWidth: isFirstElement ? 1 : 0,
    },
  ];
  return (
    <View style={tagContainerStyles}>
      <Touchable onPress={handleNavigateToFeed(tag)}>
        <View>
          <Tag tag={tag} />
        </View>
      </Touchable>
      <SaveTagButton tag={tag} />
    </View>
  );
};

SearchTagPreview.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  isFirstElement: PropTypes.bool,
  handleNavigateToFeed: PropTypes.func,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

SearchTagPreview.defaultProps = {
  isFirstElement: false,
  handleNavigateToFeed: () => {},
  tag: '',
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(SearchTagPreview);
