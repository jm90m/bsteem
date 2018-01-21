import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import _ from 'lodash';
import Tag from './Tag';

const Container = styled.View`
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px 0;
`;

const TagContainer = styled.View`
  padding: 5px 0;
`;

const FooterTags = ({ tags }) => (
  <Container>
    {_.map(tags, tag => (
      <TagContainer key={tag}>
        <Tag tag={tag} />
      </TagContainer>
    ))}
  </Container>
);

FooterTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
};

FooterTags.defaultProps = {
  tags: [],
};

export default FooterTags;
