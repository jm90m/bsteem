import React, { Component } from 'react';
import { ListView, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { sortComments } from 'util/sortUtils';
import Comment from './Comment';
import { SORT_COMMENTS } from '../../../constants/comments';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const EmptyView = styled.View`
  height: 150px;
  width: 50px;
`;

const DISPLAY_LIMIT = 10;

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
    const sort = SORT_COMMENTS.BEST;
    const sortedComments = sortComments(props.comments, sort);
    this.state = {
      sort,
      sortedComments,
      displayedComments: _.slice(sortedComments, 0, DISPLAY_LIMIT),
    };

    this.renderComment = this.renderComment.bind(this);
    this.displayMoreComments = this.displayMoreComments.bind(this);
  }

  displayMoreComments() {
    const { displayedComments, sortedComments } = this.state;

    if (_.size(sortedComments) === _.size(displayedComments)) return;

    const lastDisplayedCommentIndex = _.size(displayedComments);
    const moreCommentsLastIndex = lastDisplayedCommentIndex + DISPLAY_LIMIT;
    const moreComments = _.slice(sortedComments, lastDisplayedCommentIndex, moreCommentsLastIndex);

    this.setState({
      displayedComments: _.concat(displayedComments, moreComments),
    });
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
    const { displayedComments } = this.state;

    console.log('COMMENTS', comments, comments.length);
    console.log('~~~~~~ END ---- COMMENTS DATA ~~~~~~');

    const displayComments = _.concat(displayedComments, { bsteemEmptyView: true });

    return (
      <ListView
        style={{ marginBottom: 30 }}
        initialListSize={_.size(comments)}
        dataSource={ds.cloneWithRows(displayComments)}
        enableEmptySections
        renderRow={this.renderComment}
        onEndReached={this.displayMoreComments}
        onEndReachedThreshold={100}
      />
    );
  }
}

export default CommentsList;
