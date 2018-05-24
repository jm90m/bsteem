import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import _ from 'lodash';
import Tag from './Tag';

const ScrollView = styled.ScrollView`
  padding: 10px 0;
`;

const TagTouchable = styled.TouchableOpacity`
  margin-bottom: 10px;
  margin-right: 10px;
`;

const FooterTags = ({ tags, handleFeedNavigation }) => (
  <ScrollView horizontal>
    {_.map(tags, tag => (
      <TagTouchable key={tag} onPress={() => handleFeedNavigation(tag)}>
        <Tag tag={tag} />
      </TagTouchable>
    ))}
  </ScrollView>
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
