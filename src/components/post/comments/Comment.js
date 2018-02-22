import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { SORT_COMMENTS } from 'constants/comments';
import { getReputation } from 'util/steemitFormatters';
import { sortComments } from 'util/sortUtils';
import { COLORS } from 'constants/styles';
import _ from 'lodash';
import Avatar from 'components/common/Avatar';
import CommentFooter from './CommentFooter';
import CommentContent from './CommentContent';

const { width: deviceWidth } = Dimensions.get('screen');

const COMMENT_PADDING = 30;

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
  margin-left: ${COMMENT_PADDING}px;
`;

class Comment extends Component {
  static propTypes = {
    authUsername: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
    comment: PropTypes.shape().isRequired,
    parent: PropTypes.shape().isRequired,
    navigation: PropTypes.shape().isRequired,
    currentUserVoteComment: PropTypes.func.isRequired,
    sort: PropTypes.oneOf([SORT_COMMENTS.BEST, SORT_COMMENTS.NEWEST, SORT_COMMENTS.OLDEST]),
    //rewardFund: PropTypes.shape().isRequired,
    rootPostAuthor: PropTypes.string,
    rootPostId: PropTypes.number,
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
    currentWidth: PropTypes.number,
  };

  static defaultProps = {
    sort: SORT_COMMENTS.BEST,
    rootPostAuthor: undefined,
    commentsChildren: undefined,
    pendingVotes: [],
    depth: 0,
    currentWidth: deviceWidth,
    onLikeClick: () => {},
    onDislikeClick: () => {},
    onSendComment: () => {},
  };

  constructor(props) {
    super(props);

    const { comment, authUsername } = props;
    const userVote = _.find(comment.active_votes, { voter: authUsername });
    const liked = userVote && userVote.percent > 0;
    const disliked = userVote && userVote.percent < 0;

    this.state = {
      liked,
      disliked,
      loadingLike: false,
      loadingDislike: false,
    };

    this.setLiked = this.setLiked.bind(this);
    this.setDisliked = this.setDisliked.bind(this);
    this.setLoadingLike = this.setLoadingLike.bind(this);
    this.setLoadingDislike = this.setLoadingDislike.bind(this);

    this.handleLike = this.handleLike.bind(this);
    this.handleDislike = this.handleDislike.bind(this);
  }

  setLiked(liked) {
    const newState = {
      liked,
      loadingLike: false,
    };

    if (liked) {
      newState.disliked = false;
    }

    this.setState(newState);
  }

  setDisliked(disliked) {
    const newState = {
      disliked,
      loadingDislike: false,
    };

    if (disliked) {
      newState.liked = false;
    }

    this.setState(newState);
  }

  setLoadingLike(loadingLike) {
    this.setState({ loadingLike });
  }

  setLoadingDislike(loadingDislike) {
    this.setState({
      loadingDislike,
    });
  }

  handleLike() {
    const { liked } = this.state;
    const { comment, rootPostId, authenticated } = this.props;

    if (!authenticated) {
      // display login screen
      return;
    }

    this.setLoadingLike(true);

    const weight = liked ? 0 : 10000;
    const voteSuccessCallback = () => this.setLiked(!liked);
    const voteFailCallback = () => this.setLoadingLike(false);

    this.props.currentUserVoteComment(
      comment.id,
      rootPostId,
      weight,
      voteSuccessCallback,
      voteFailCallback,
    );
  }

  handleDislike() {
    const { disliked } = this.state;
    const { comment, rootPostId, authenticated } = this.props;

    if (!authenticated) {
      // display login screen
      return;
    }

    this.setLoadingDislike(true);

    const weight = disliked ? 0 : -10000;
    const voteSuccessCallback = () => this.setDisliked(!disliked);
    const voteFailCallback = () => this.setLoadingDislike(false);

    this.props.currentUserVoteComment(
      comment.id,
      rootPostId,
      weight,
      voteSuccessCallback,
      voteFailCallback,
    );
  }

  renderCommentsChildren() {
    const {
      commentsChildren,
      comment,
      authUsername,
      authenticated,
      sort,
      depth,
      rootPostAuthor,
      onLikeClick,
      onDislikeClick,
      onSendComment,
      currentWidth,
      navigation,
      currentUserVoteComment,
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
          currentWidth={currentWidth - COMMENT_PADDING}
          navigation={navigation}
          authenticated={authenticated}
          currentUserVoteComment={currentUserVoteComment}
        />
      ));
    }
    return null;
  }

  render() {
    const { comment, authUsername, currentWidth, navigation } = this.props;
    const { liked, disliked, loadingLike, loadingDislike } = this.state;
    const anchorId = `@${comment.author}/${comment.permlink}`;
    const anchorLink = `${comment.url.slice(0, comment.url.indexOf('#'))}#${anchorId}`;
    const editable =
      comment.author === authUsername.name && comment.cashout_time !== '1969-12-31T23:59:59';
    const commentAuthorReputation = getReputation(comment.author_reputation);
    const avatarSize = comment.depth === 1 ? 40 : 32;
    //    const userUpVoted = userVote && userVote.percent > 0;
    // const userDownVoted = userVote && userVote.percent < 0;

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
            currentWidth={currentWidth}
            navigation={navigation}
          />
        </CommentContentContainer>
        <CommentFooter
          liked={liked}
          disliked={disliked}
          loadingLike={loadingLike}
          loadingDislike={loadingDislike}
          handleLike={this.handleLike}
          handleDislike={this.handleDislike}
          handleReply={this.handleReply}
        />
        <CommentChildrenContainer>{this.renderCommentsChildren()}</CommentChildrenContainer>
      </Container>
    );
  }
}

export default Comment;
