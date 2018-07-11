import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  getAuthUsername,
  getCommentsByPostId,
  getIsAuthenticated,
  getLoadingComments,
  getEnableVotingSlider,
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import { currentUserVoteComment } from 'state/actions/currentUserActions';
import { fetchComments } from 'state/actions/postsActions';
import * as editorActions from 'state/actions/editorActions';
import PrimaryBackgroundView from 'components/common/StyledViewPrimaryBackground';
import commonStyles from 'styles/common';
import CommentsList from './CommentsList';

const mapStateToProps = state => ({
  authUsername: getAuthUsername(state),
  commentsByPostId: getCommentsByPostId(state),
  authenticated: getIsAuthenticated(state),
  loadingComments: getLoadingComments(state),
  enableVotingSlider: getEnableVotingSlider(state),
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
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
    intl: PropTypes.shape().isRequired,
    currentUserVoteComment: PropTypes.func.isRequired,
    fetchComments: PropTypes.func.isRequired,
    loadingComments: PropTypes.bool.isRequired,
    handleDisplayMenu: PropTypes.func.isRequired,
    sort: PropTypes.shape().isRequired,
    authUsername: PropTypes.string,
    authenticated: PropTypes.bool,
    enableVotingSlider: PropTypes.bool,
    commentsByPostId: PropTypes.shape(),
    customTheme: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    authUsername: '',
    authenticated: false,
    enableVotingSlider: false,
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
      handleDisplayMenu,
      sort,
      enableVotingSlider,
      customTheme,
      intl,
    } = this.props;
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

    return (
      <PrimaryBackgroundView style={commonStyles.container}>
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
          handleDisplayMenu={handleDisplayMenu}
          sort={sort}
          enableVotingSlider={enableVotingSlider}
          customTheme={customTheme}
          intl={intl}
        />
      </PrimaryBackgroundView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentsContainer);
