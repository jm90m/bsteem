import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import BodyShort from 'components/post-preview/BodyShort';
import _ from 'lodash';
import Tag from 'components/post/Tag';

const Container = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  margin-top: 5px;
  margin-bottom: 5px;
  border-color: ${COLORS.WHITE.WHITE_SMOKE};
  border-width: 2px;
`;

const AuthorText = styled.Text`
  font-weight: 700;
  color: ${COLORS.BLUE.MARINER};
`;

const PostTitle = styled.Text`
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 20px;
  margin: 0 16px 8px;
`;

const TagsContainer = styled.View`
  flex-direction: row;
`;

class SearchPostPreview extends Component {
  static propTypes = {
    author: PropTypes.string,
    title: PropTypes.string,
    summary: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    author: '',
    title: '',
    summary: '',
    tags: [],
  };

  render() {
    const { author, title, summary, tags } = this.props;
    return (
      <Container>
        <PostTitle>{title}</PostTitle>
        <AuthorText>{author}</AuthorText>
        <BodyShort content={summary} />
        <TagsContainer>
          {_.map(tags, tag => <Tag key={tag} tag={tag} />)}
        </TagsContainer>
      </Container>
    );
  }
}

export default SearchPostPreview;
