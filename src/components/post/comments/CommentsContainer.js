import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import {
  getAuthUsername,
  getCommentsByPostId,
  getIsAuthenticated,
  getLoadingComments,
} from 'state/rootReducer';
import { currentUserVoteComment } from 'state/actions/currentUserActions';
import { COLORS } from 'constants/styles';
import i18n from 'i18n/i18n';
import { fetchComments } from '/state/actions/postsActions';
import * as editorActions from 'state/actions/editorActions';
import CommentsList from './CommentsList';

const Container = styled.View``;

const EmptyCommentsTextContainer = styled.View`
  padding: 20px;
  background-color: ${COLORS.WHITE.WHITE};
`;
const EmptyCommentsText = styled.Text``;

const mapStateToProps = state => ({
  authUsername: getAuthUsername(state),
  commentsByPostId: getCommentsByPostId(state),
  authenticated: getIsAuthenticated(state),
  loadingComments: getLoadingComments(state),
});

const mapDispatchToProps = dispatch => ({
  currentUserVoteComment: (commentId, postId, weight, voteSuccessCallback, voteFailCallback) =>
    dispatch(
      currentUserVoteComment.action({
        commentId,
        postId,
        weight,
        voteSuccessCallback,
        voteFailCallback,
      }),
    ),
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
  fetchComments: (category, author, permlink, postId) =>
    dispatch(fetchComments(category, author, permlink, postId)),
});

class CommentsContainer extends Component {
  static propTypes = {
    postId: PropTypes.number.isRequired,
    postData: PropTypes.shape().isRequired,
    navigation: PropTypes.shape().isRequired,
    currentUserVoteComment: PropTypes.func.isRequired,
    fetchComments: PropTypes.func.isRequired,
    loadingComments: PropTypes.bool.isRequired,
    authUsername: PropTypes.string,
    authenticated: PropTypes.bool,
    commentsByPostId: PropTypes.shape(),
  };

  static defaultProps = {
    authUsername: '',
    authenticated: false,
    commentsByPostId: {},
  };

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
      postId,
      postData,
      commentsByPostId,
      navigation,
      authenticated,
      loadingComments,
    } = this.props;
    const postComments = _.get(commentsByPostId, postId, null);
    const comments = _.get(postComments, 'comments', {});
    const rootNode = _.get(postComments, `childrenById.${postId}`, null);

    let fetchedCommentsList = [];

    if (_.isNull(postComments)) {
      return (
        <EmptyCommentsTextContainer>
          <EmptyCommentsText>{i18n.comments.noCommentsToShow}</EmptyCommentsText>
        </EmptyCommentsTextContainer>
      );
    }

    if (Array.isArray(rootNode)) {
      fetchedCommentsList = _.map(rootNode, id => comments[id]);
    }

    let commentsChildren = {};

    if (fetchedCommentsList && fetchedCommentsList.length) {
      commentsChildren = this.getNestedComments(postComments, rootNode, {});
    }

    if (_.isEmpty(fetchedCommentsList) && !loadingComments) {
      return (
        <EmptyCommentsTextContainer>
          <EmptyCommentsText>{i18n.comments.noCommentsToShow}</EmptyCommentsText>
        </EmptyCommentsTextContainer>
      );
    }

    return (
      <Container>
        <CommentsList
          authUsername={authUsername}
          comments={fetchedCommentsList}
          commentsChildren={commentsChildren}
          postId={postId}
          postData={postData}
          navigation={navigation}
          currentUserVoteComment={this.props.currentUserVoteComment}
          authenticated={authenticated}
          fetchComments={this.props.fetchComments}
          loadingComments={loadingComments}
        />
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentsContainer);
