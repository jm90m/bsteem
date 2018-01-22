import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getAuthUsername, getCommentsByPostId } from 'state/rootReducer';
import CommentsList from './CommentsList';

const Container = styled.View``;

const mapStateToProps = state => ({
  authUsername: getAuthUsername(state),
  commentsByPostId: getCommentsByPostId(state),
});

const mapDispatchToProps = dispatch => ({});

@connect(mapStateToProps, mapDispatchToProps)
class CommentsContainer extends Component {
  static propTypes = {
    postId: PropTypes.oneOfType(PropTypes.number, PropTypes.string),
  };

  getNestedComments(commentsObj, commentsIdArray, nestedComments) {
    const newNestedComments = nestedComments;
    _.forEach(commentsIdArray, commentId => {
      const nestedCommentArray = _.get(commentsObj, `childrendById.${commentId}`, []);
      if (nestedCommentArray.length) {
        newNestedComments[commentId] = _.map(nestedCommentArray, id => commentsObj.comments[id]);
        this.getNestedComments(commentsObj, nestedCommentArray, newNestedComments);
      }
    });
    return newNestedComments;
  }

  render() {
    const { authUsername, postId, postAuthor, commentsByPostId } = this.props;
    const comments = _.get(commentsByPostId, postId, {});
    const rootNode = comments.childrenById[postId];
    let fetchedCommentsList = [];

    if (Array.isArray(rootNode)) {
      fetchedCommentsList = _.map(rootNode, id => comments.comments[id]);
    }

    let commentsChildren = {};

    if (fetchedCommentsList && fetchedCommentsList.length) {
      commentsChildren = this.getNestedComments(comments, comments.childrenById[postId], {});
    }

    return (
      <Container>
        <CommentsList
          authUsername={authUsername}
          comments={fetchedCommentsList}
          commentsChildren={commentsChildren}
          postId={postId}
        />
      </Container>
    );
  }
}

export default CommentsContainer;
