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

// const mapDispatchToProps = dispatch => ({});

@connect(mapStateToProps)
class CommentsContainer extends Component {
  static propTypes = {
    postId: PropTypes.number.isRequired,
    postData: PropTypes.shape().isRequired,
  };

  getNestedComments(commentsObj, commentsIdArray, nestedComments) {
    const newNestedComments = nestedComments;
    _.forEach(commentsIdArray, commentId => {
      const nestedCommentArray = _.get(commentsObj, commentId, []);
      if (nestedCommentArray.length) {
        newNestedComments[commentId] = _.map(nestedCommentArray, id => commentsObj.comments[id]);
        this.getNestedComments(commentsObj, nestedCommentArray, newNestedComments);
      }
    });
    return newNestedComments;
  }

  render() {
    const { authUsername, postId, postData, commentsByPostId } = this.props;
    const postComments = _.get(commentsByPostId, postId, null);
    const comments = _.get(postComments, 'comments', {});
    const rootNode = _.get(postComments, `childrenById.${postId}`, null);

    let fetchedCommentsList = [];

    if (_.isNull(postComments)) {
      return null;
    }

    if (Array.isArray(rootNode)) {
      fetchedCommentsList = _.map(rootNode, id => comments[id]);
    }

    let commentsChildren = {};

    if (fetchedCommentsList && fetchedCommentsList.length) {
      commentsChildren = this.getNestedComments(comments, postComments.childrenById, {});
    }

    return (
      <Container>
        <CommentsList
          authUsername={authUsername}
          comments={fetchedCommentsList}
          commentsChildren={commentsChildren}
          postId={postId}
          postData={postData}
        />
      </Container>
    );
  }
}

export default CommentsContainer;
