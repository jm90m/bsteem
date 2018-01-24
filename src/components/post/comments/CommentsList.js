import React, { Component } from 'react';
import { ListView } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Comment from './Comment';
import { sortComments } from 'util/sortUtils';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const Container = styled.View``;

const Header = styled.View``;

const Title = styled.Text``;

class CommentsList extends Component {
  static propTypes = {
    postData: PropTypes.shape().isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape()),
  };

  constructor(props) {
    super(props);

    this.state = {
      sort: 'BEST',
    };

    this.renderComment = this.renderComment.bind(this);
  }

  renderComment(commentData) {
    const { authUsername, authenticated, postData, commentsChildren } = this.props;
    const postAuthor = postData.author;

    return (
      <Comment
        key={commentData.id}
        authUsername={authUsername}
        depth={0}
        authenticated={authenticated}
        rootPostAuthor={postAuthor}
        comment={commentData}
        parent={postData}
        commentsChildren={commentsChildren}
      />
    );
  }

  render() {
    const { comments } = this.props;
    const { sort } = this.state;
    const sortedComments = sortComments(comments, sort);

    return (
      <Container>
        <Header>
          <Title>{'Comments'}</Title>
        </Header>
        <ListView
          dataSource={ds.cloneWithRows(sortedComments)}
          enableEmptySections
          renderRow={this.renderComment}
        />
      </Container>
    );
  }
}

export default CommentsList;
