import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { SORT_COMMENTS } from 'constants/comments';
import { getReputation } from 'util/steemitFormatters';
import { sortComments } from 'util/sortUtils';
import { COLORS } from 'constants/styles';
import _ from 'lodash';
import Avatar from 'components/common/Avatar';
import CommentFooter from './CommentFooter';
import CommentContent from './CommentContent';

const Container = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  margin-top: 2px;
  margin-bottom: 2px;
`;

const CommentContentContainer = styled.View`
  margin-top: 10px;
  flex-direction: row;
`;

const AvatarContainer = styled.View`
  padding: 5px 10px;
`;

const CommentChildrenContainer = styled.View`
  margin-left: 30px;
`;

class Comment extends Component {
  static propTypes = {
    authUsername: PropTypes.string.isRequired,
    comment: PropTypes.shape().isRequired,
    parent: PropTypes.shape().isRequired,
    sort: PropTypes.oneOf([SORT_COMMENTS.BEST, SORT_COMMENTS.NEWEST, SORT_COMMENTS.OLDEST]),
    //rewardFund: PropTypes.shape().isRequired,
    rootPostAuthor: PropTypes.string,
    commentsChildren: PropTypes.shape(),
    pendingVotes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        percent: PropTypes.number,
      }),
    ),
    depth: PropTypes.number,
    onLikeClick: PropTypes.func,
    onDislikeClick: PropTypes.func,
    onSendComment: PropTypes.func,
  };

  static defaultProps = {
    sort: SORT_COMMENTS.BEST,
    rootPostAuthor: undefined,
    commentsChildren: undefined,
    pendingVotes: [],
    depth: 0,
    onLikeClick: () => {},
    onDislikeClick: () => {},
    onSendComment: () => {},
  };

  renderCommentsChildren() {
    const {
      commentsChildren,
      comment,
      authUsername,
      sort,
      depth,
      rootPostAuthor,
      onLikeClick,
      onDislikeClick,
      onSendComment,
    } = this.props;
    console.log('COMMENTS CHILDREN', commentsChildren, comment.id);
    if (!_.isEmpty(commentsChildren[comment.id])) {
      return sortComments(commentsChildren[comment.id], sort).map(child => (
        <Comment
          key={child.id}
          authUsername={authUsername}
          depth={depth + 1}
          comment={child}
          parent={comment}
          rootPostAuthor={rootPostAuthor}
          commentsChildren={commentsChildren}
          onLikeClick={onLikeClick}
          onDislikeClick={onDislikeClick}
          onSendComment={onSendComment}
        />
      ));
    }
    return null;
  }

  render() {
    const { comment, authUsername } = this.props;
    const anchorId = `@${comment.author}/${comment.permlink}`;
    const anchorLink = `${comment.url.slice(0, comment.url.indexOf('#'))}#${anchorId}`;
    const editable =
      comment.author === authUsername.name && comment.cashout_time !== '1969-12-31T23:59:59';
    const commentAuthorReputation = getReputation(comment.author_reputation);
    const avatarSize = comment.depth === 1 ? 40 : 32;

    return (
      <Container>
        <CommentContentContainer>
          <AvatarContainer>
            <Avatar size={avatarSize} username={comment.author} />
          </AvatarContainer>
          <CommentContent
            username={comment.author}
            reputation={commentAuthorReputation}
            created={comment.created}
            body={comment.body}
            commentDepth={comment.depth}
          />
        </CommentContentContainer>
        <CommentFooter />
        <CommentChildrenContainer>{this.renderCommentsChildren()}</CommentChildrenContainer>
      </Container>
    );
  }
}

export default Comment;
