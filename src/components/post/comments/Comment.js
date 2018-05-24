import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { SORT_COMMENTS } from 'constants/comments';
import { getReputation } from 'util/steemitFormatters';
import { sortComments } from 'util/sortUtils';
import _ from 'lodash';
import * as navigationConstants from 'constants/navigation';
import Avatar from 'components/common/Avatar';
import withAuthActions from 'components/common/withAuthActions';
import PostVoteSlider from 'components/post/PostVoteSlider';
import CommentFooter from './CommentFooter';
import CommentContent from './CommentContent';
import { calculatePayout } from '../../../util/steemitUtils';

const { width: deviceWidth } = Dimensions.get('screen');

const COMMENT_PADDING = 10;

const Container = styled.View`
  background-color: ${props => props.customTheme.primaryBackgroundColor};
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

@withAuthActions
class Comment extends Component {
  static propTypes = {
    authUsername: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
    comment: PropTypes.shape().isRequired,
    parent: PropTypes.shape().isRequired,
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    enableVotingSlider: PropTypes.bool.isRequired,
    currentUserVoteComment: PropTypes.func.isRequired,
    onActionInitiated: PropTypes.func,
    sort: PropTypes.oneOf([
      SORT_COMMENTS.BEST,
      SORT_COMMENTS.NEWEST,
      SORT_COMMENTS.OLDEST,
      SORT_COMMENTS.REPUTATION,
    ]).isRequired,
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
    rootPostAuthor: undefined,
    commentsChildren: undefined,
    pendingVotes: [],
    depth: 0,
    currentWidth: deviceWidth,
    onLikeClick: () => {},
    onDislikeClick: () => {},
    onSendComment: () => {},
    onActionInitiated: undefined,
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
      newReplyComment: {},
      currentCommentBody: comment.body,
      displayVoteSlider: false,
    };

    this.setLiked = this.setLiked.bind(this);
    this.setDisliked = this.setDisliked.bind(this);
    this.setLoadingLike = this.setLoadingLike.bind(this);
    this.setLoadingDislike = this.setLoadingDislike.bind(this);
    this.setNewReplyComment = this.setNewReplyComment.bind(this);
    this.setCurrentCommentBody = this.setCurrentCommentBody.bind(this);

    this.handleLike = this.handleLike.bind(this);
    this.handleDislike = this.handleDislike.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handlePayout = this.handlePayout.bind(this);

    this.likeComment = this.likeComment.bind(this);
    this.dislikeComment = this.dislikeComment.bind(this);
    this.replyComment = this.replyComment.bind(this);

    this.handleVoteSliderSendVote = this.handleVoteSliderSendVote.bind(this);
    this.handleLikeCommentWithSlider = this.handleLikeCommentWithSlider.bind(this);
    this.handleDislikeCommentWithSlider = this.handleDislikeCommentWithSlider.bind(this);
    this.modifyCommentDataForVote = this.modifyCommentDataForVote.bind(this);
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

  setNewReplyComment(newReplyComment) {
    this.setState({
      newReplyComment,
    });
  }

  setCurrentCommentBody(editedComment) {
    const body = _.get(editedComment, 'body', '');
    this.setState({
      currentCommentBody: body,
    });
  }

  modifyCommentDataForVote(voteWeightPercent) {
    const { enableVotingSlider, authUsername, comment } = this.props;
    try {
      // directly modify the current vote post data, if it does not have an active vote then
      // create a new vote object
      if (enableVotingSlider) {
        let hasActiveVote = false;
        for (let i = 0; i < _.size(comment.active_votes); i += 1) {
          if (authUsername === comment.active_votes[i].voter) {
            comment.active_votes[i].percent = voteWeightPercent;
            hasActiveVote = true;
            break;
          }
        }

        if (!hasActiveVote) {
          const newVoteObject = {
            voter: authUsername,
            percent: voteWeightPercent,
          };
          comment.active_votes.push(newVoteObject);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  likeComment(voteWeight) {
    const { liked } = this.state;
    const { comment, rootPostId } = this.props;

    this.setLoadingLike(true);

    const voteSuccessCallback = () => {
      this.setLiked(!liked);
      this.modifyCommentDataForVote(voteWeight);
    };
    const voteFailCallback = () => this.setLoadingLike(false);

    this.props.currentUserVoteComment(
      comment.id,
      rootPostId,
      voteWeight,
      voteSuccessCallback,
      voteFailCallback,
      comment,
    );
  }

  handleVoteSliderSendVote(voteWeight) {
    this.setState({
      displayVoteSlider: false,
    });
    const isUpvote = voteWeight > 0;

    if (isUpvote) {
      this.likeComment(voteWeight);
    } else {
      this.dislikeComment(voteWeight);
    }
  }

  handleSetVoteSliderDisplay = displayVoteSlider => () => {
    this.setState({
      displayVoteSlider,
    });
  };

  handleLikeCommentWithSlider() {
    const { enableVotingSlider } = this.props;
    if (enableVotingSlider) {
      this.setState({
        displayVoteSlider: true,
      });
    } else {
      const { liked } = this.state;
      const weight = liked ? 0 : 10000;
      this.likeComment(weight);
    }
  }

  handleDislikeCommentWithSlider() {
    const { enableVotingSlider } = this.props;
    if (enableVotingSlider) {
      this.setState({
        displayVoteSlider: true,
      });
    } else {
      const { disliked } = this.state;
      const weight = disliked ? 0 : -10000;
      this.dislikeComment(weight);
    }
  }

  handleLike() {
    const { authenticated, onActionInitiated } = this.props;
    if (!_.isUndefined(onActionInitiated)) {
      onActionInitiated(this.handleLikeCommentWithSlider);
    } else if (authenticated) {
      this.handleLikeCommentWithSlider();
    }
  }

  dislikeComment(voteWeight) {
    const { disliked } = this.state;
    const { comment, rootPostId } = this.props;
    this.setLoadingDislike(true);

    const voteSuccessCallback = () => {
      this.setDisliked(!disliked);
      this.modifyCommentDataForVote(voteWeight);
    };
    const voteFailCallback = () => this.setLoadingDislike(false);

    this.props.currentUserVoteComment(
      comment.id,
      rootPostId,
      voteWeight,
      voteSuccessCallback,
      voteFailCallback,
      comment,
    );
  }

  handleDislike() {
    const { authenticated, onActionInitiated } = this.props;

    if (!_.isUndefined(onActionInitiated)) {
      this.props.onActionInitiated(this.handleDislikeCommentWithSlider);
    } else if (authenticated) {
      this.handleDislikeCommentWithSlider();
    }
  }

  replyComment() {
    const { comment } = this.props;
    this.props.navigation.navigate(navigationConstants.REPLY, {
      comment,
      parentPost: comment,
      successCreateReply: this.setNewReplyComment,
    });
  }

  handleReply() {
    const { authenticated, onActionInitiated } = this.props;

    if (!_.isUndefined(onActionInitiated)) {
      this.props.onActionInitiated(this.replyComment);
    } else if (authenticated) {
      this.replyComment();
    }
  }

  handleEdit() {
    const { authenticated, parent, comment } = this.props;
    const originalComment = { ...comment, body: this.state.currentCommentBody };

    if (!authenticated) {
      return;
    }

    this.props.navigation.navigate(navigationConstants.EDIT_REPLY, {
      parentPost: parent,
      originalComment,
      successEditReply: this.setCurrentCommentBody,
    });
  }

  handlePayout() {
    const { comment } = this.props;
    this.props.navigation.navigate(navigationConstants.VOTES, {
      postData: comment,
    });
  }

  renderReplyComment() {
    const { newReplyComment } = this.state;
    const {
      commentsChildren,
      comment,
      authUsername,
      authenticated,
      depth,
      rootPostAuthor,
      onLikeClick,
      onDislikeClick,
      onSendComment,
      currentWidth,
      navigation,
      currentUserVoteComment,
      rootPostId,
      sort,
      enableVotingSlider,
      customTheme,
    } = this.props;

    if (!_.isEmpty(newReplyComment)) {
      return (
        <Comment
          key={`reply-comment-${newReplyComment.id}`}
          authUsername={authUsername}
          depth={depth + 1}
          comment={newReplyComment}
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
          rootPostId={rootPostId}
          sort={sort}
          enableVotingSlider={enableVotingSlider}
          customTheme={customTheme}
        />
      );
    }

    return null;
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
      rootPostId,
      enableVotingSlider,
      customTheme,
    } = this.props;

    if (!_.isEmpty(commentsChildren[comment.id])) {
      return sortComments(commentsChildren[comment.id], sort.id).map(child => (
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
          rootPostId={rootPostId}
          sort={sort}
          enableVotingSlider={enableVotingSlider}
          customTheme={customTheme}
        />
      ));
    }
    return null;
  }

  render() {
    const { comment, authUsername, currentWidth, navigation, customTheme } = this.props;
    const {
      liked,
      disliked,
      loadingLike,
      loadingDislike,
      currentCommentBody,
      displayVoteSlider,
    } = this.state;
    const anchorId = `@${comment.author}/${comment.permlink}`;
    // const anchorLink = `${comment.url.slice(0, comment.url.indexOf('#'))}#${anchorId}`;
    const editable =
      comment.author === authUsername && comment.cashout_time !== '1969-12-31T23:59:59';
    const commentAuthorReputation = getReputation(comment.author_reputation);
    const avatarSize = comment.depth === 1 ? 40 : 32;
    const displayedBody = editable ? currentCommentBody : comment.body;
    const payout = calculatePayout(comment);

    return (
      <Container customTheme={customTheme}>
        <CommentContentContainer>
          <AvatarContainer>
            <Avatar size={avatarSize} username={comment.author} />
          </AvatarContainer>
          <CommentContent
            username={comment.author}
            reputation={commentAuthorReputation}
            created={comment.created}
            body={displayedBody}
            commentDepth={comment.depth}
            currentWidth={currentWidth}
            navigation={navigation}
            customTheme={customTheme}
          />
        </CommentContentContainer>
        {displayVoteSlider ? (
          <PostVoteSlider
            postData={comment}
            handleVoteSliderSendVote={this.handleVoteSliderSendVote}
            hideVoteSlider={this.handleSetVoteSliderDisplay(false)}
          />
        ) : (
          <CommentFooter
            liked={liked}
            disliked={disliked}
            loadingLike={loadingLike}
            loadingDislike={loadingDislike}
            handleLike={this.handleLike}
            handleDislike={this.handleDislike}
            handleReply={this.handleReply}
            handleEdit={this.handleEdit}
            handlePayout={this.handlePayout}
            payout={payout}
            editable={editable}
            customTheme={customTheme}
          />
        )}

        <CommentChildrenContainer>
          {this.renderReplyComment()}
          {this.renderCommentsChildren()}
        </CommentChildrenContainer>
      </Container>
    );
  }
}

export default Comment;
