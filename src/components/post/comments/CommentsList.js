import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Comment from 'Comment';

const Container = styled.View``;

const Header = styled.View``;

const Title = styled.Text``;

class CommentsList extends Component {
  static propTypes = {
    comments: PropTypes.arrayOf(PropTypes.shape()),
  };

  constructor(props) {
    super(props);

    this.state = {
      sort: 'BEST',
    };
  }

  render() {
    const { authUsername, authenticated } = this.props;
    return (
      <Container>
        <Header>
          <Title>{'Comments'}</Title>
        </Header>
        {_.map(comments, comment => (
          <Comment
            key={comment.id}
            authUsername={authUsername}
            depth={0}
            authenticated={authenticated}
          />
        ))}
      </Container>
    );
  }
}

export default CommentsList;
