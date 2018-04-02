import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { currentUserVoteComment } from 'state/actions/currentUserActions';
import * as editorActions from 'state/actions/editorActions';
import { fetchComments } from 'state/actions/postsActions';
import { sortComments } from 'util/sortUtils';
import { SORT_COMMENTS } from 'constants/comments';
import {
  getCommentsByPostId,
  getIsAuthenticated,
  getEnableVotingSlider,
  getAuthUsername,
} from 'state/rootReducer';
import Comment from 'components/post/comments/Comment';

const Container = styled.View``;

const CommentsTitle = styled.Text`
  font-weight: bold;
  font-size: 20px;
`;

const mapStateToProps = state => ({
  authUsername: getAuthUsername(state),
  commentsByPostId: getCommentsByPostId(state),
  authenticated: getIsAuthenticated(state),
  enableVotingSlider: getEnableVotingSlider(state),
});

const mapDispatchToProps = dispatch => ({
  fetchComments: (category, author, permlink, postId) =>
    dispatch(fetchComments(category, author, permlink, postId)),
  createComment: (parentPost, isUpdating, originalComment, commentBody, successCallback) =>
    dispatch(
      editorActions.action({
        parentPost,
        isUpdating,
        originalComment,
        commentBody,
        successCallback,
      }),
    ),
  currentUserVoteComment: (
    commentId,
    postId,
    weight,
    voteSuccessCallback,
    voteFailCallback,
    commentData,
  ) =>
    dispatch(
      currentUserVoteComment.action({
        commentId,
        postId,
        weight,
        voteSuccessCallback,
        voteFailCallback,
        commentData,
      }),
    ),
});

class PostComments extends Component {
  static propTypes = {
    navigation: PropTypes.shape(),
    fetchComments: PropTypes.func.isRequired,
    commentsByPostId: PropTypes.shape(),
    authenticated: PropTypes.bool.isRequired,
    enableVotingSlider: PropTypes.bool.isRequired,
    authUsername: PropTypes.string.isRequired,
    currentUserVoteComment: PropTypes.func.isRequired,
    postData: PropTypes.shape(),
  };

  static defaultProps = {
    navigation: {},
    commentsByPostId: {},
    postData: {},
  };

  componentDidMount() {
    const { commentsByPostId, postData } = this.props;
    const { author, permlink, id, category } = postData;
    const postComments = _.get(commentsByPostId, id, null);
    if (_.isEmpty(postComments) || _.isNull(postComments)) {
      this.props.fetchComments(category, author, permlink, id);
    }
  }

  getNestedComments(postComments, commentsIdArray, nestedComments) {
    const newNestedComments = nestedComments;
    _.forEach(commentsIdArray, commentId => {
      const nestedCommentArray = _.get(postComments, `childrenById.${commentId}`, []);
      if (nestedCommentArray.length) {
        newNestedComments[commentId] = _.map(nestedCommentArray, id => postComments.comments[id]);
        this.getNestedComments(postComments, nestedCommentArray, newNestedComments);
      }
    });
    return newNestedComments;
  }

  render() {
    const {
      authUsername,
      postData,
      commentsByPostId,
      navigation,
      authenticated,
      enableVotingSlider,
    } = this.props;
    const postId = _.get(postData, 'id', 0);
    const postAuthor = _.get(postData, 'author', '');
    const sort = SORT_COMMENTS.BEST;
    const postComments = _.get(commentsByPostId, postId, null);
    const comments = _.get(postComments, 'comments', {});
    const rootNode = _.get(postComments, `childrenById.${postId}`, null);

    let fetchedCommentsList = [];

    if (Array.isArray(rootNode)) {
      fetchedCommentsList = _.map(rootNode, id => comments[id]);
    }

    let commentsChildren = {};

    if (fetchedCommentsList && fetchedCommentsList.length) {
      commentsChildren = this.getNestedComments(postComments, rootNode, {});
    }
    const sortedComments = sortComments(fetchedCommentsList, sort.id);
    const firstComment = _.head(sortedComments);

    if (_.isEmpty(firstComment)) return null;

    return (
      <Container>
        <CommentsTitle>Comments</CommentsTitle>
        <Comment
          authUsername={authUsername}
          depth={0}
          authenticated={authenticated}
          rootPostAuthor={postAuthor}
          rootPostId={postId}
          comment={firstComment}
          parent={postData}
          commentsChildren={commentsChildren}
          navigation={navigation}
          currentUserVoteComment={this.props.currentUserVoteComment}
          sort={sort}
          enableVotingSlider={enableVotingSlider}
        />
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostComments);
