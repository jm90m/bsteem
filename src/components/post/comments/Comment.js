import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { SORT_COMMENTS } from 'constants/comments';
import { getReputation } from 'util/steemitFormatters';
import Avatar from 'common/Avatar';
import CommentFooter from './CommentFooter';

const Container = styled.View``;

const CommentContentContainer = styled.View``;

const AvatarContainer = styled.View``;

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
          <CommentContents>
            <Header> </Header>
          </CommentContents>
        </CommentContentContainer>
        <CommentFooter />
      </Container>
    );
  }
}

export default Comment;
