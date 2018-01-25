import React, { Component } from 'react';
import { ListView } from 'react-native';
import PropTypes from 'prop-types';
import { sortComments } from 'util/sortUtils';
import Comment from './Comment';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

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
      <ListView
        dataSource={ds.cloneWithRows(sortedComments)}
        enableEmptySections
        renderRow={this.renderComment}
      />
    );
  }
}

export default CommentsList;
