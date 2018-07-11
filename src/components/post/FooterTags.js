import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import _ from 'lodash';
import Tag from './Tag';

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: 5,
    marginBottom: 5,
  },
});

const FooterTags = ({ tags, handleFeedNavigation }) => (
  <View style={styles.tagsContainer}>
    {_.map(tags, tag => (
      <TouchableOpacity key={tag} onPress={() => handleFeedNavigation(tag)} style={styles.tag}>
        <Tag tag={tag} />
      </TouchableOpacity>
    ))}
  </View>
);

FooterTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  handleFeedNavigation: PropTypes.func,
};

FooterTags.defaultProps = {
  tags: [],
  handleFeedNavigation: () => {},
};

export default FooterTags;
