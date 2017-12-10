import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const Container = styled.View``;

const AuthorText = styled.Text`

`;

const PostTitle = styled.Text`
`;

const PostSummary = styled.Text``;

const Post = styled.View``;

class SearchPostPreview extends Component {
  static propTypes = {
    author: PropTypes.string,
  };

  static defaultProps = {
    author: '',
  };

  render() {
    const { author } = this.props;
    return (
      <Container>
        <PostTitle />
        <PostSummary />
        <AuthorText>{author}</AuthorText>
      </Container>
    );
  }
}

export default SearchPostPreview;
