import React, { Component } from 'react';
import { ListView } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { sortComments } from 'util/sortUtils';
import Comment from './Comment';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const EmptyView = styled.View`
  height: 150px;
  width: 50px;
`;

class CommentsList extends Component {
  static propTypes = {
    postData: PropTypes.shape().isRequired,
    postId: PropTypes.number.isRequired,
    currentUserVoteComment: PropTypes.func.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape()),
    navigation: PropTypes.shape().isRequired,
    authUsername: PropTypes.string,
    authenticated: PropTypes.bool,
  };

  static defaultProps = {
    comments: [],
    authenticated: false,
    authUsername: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      sort: 'BEST',
    };

    this.renderComment = this.renderComment.bind(this);
  }

  renderComment(commentData) {
    if (_.get(commentData, 'bsteemEmptyView', false)) {
      return <EmptyView />;
    }

    const {
      authUsername,
      authenticated,
      postData,
      commentsChildren,
      navigation,
      currentUserVoteComment,
      postId,
    } = this.props;
    const postAuthor = postData.author;

    return (
      <Comment
        key={commentData.id}
        authUsername={authUsername}
        depth={0}
        authenticated={authenticated}
        rootPostAuthor={postAuthor}
        rootPostId={postId}
        comment={commentData}
        parent={postData}
        commentsChildren={commentsChildren}
        navigation={navigation}
        currentUserVoteComment={currentUserVoteComment}
      />
    );
  }

  render() {
    const { comments } = this.props;
    const { sort } = this.state;
    const sortedComments = sortComments(comments, sort);
    const displayComments = _.concat(sortedComments, { bsteemEmptyView: true });

    return (
      <ListView
        style={{ marginBottom: 30 }}
        dataSource={ds.cloneWithRows(displayComments)}
        enableEmptySections
        renderRow={this.renderComment}
      />
    );
  }
}

export default CommentsList;
