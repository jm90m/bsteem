import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { currentUserVoteComment } from 'state/actions/currentUserActions';
import * as editorActions from 'state/actions/editorActions';
import { fetchComments } from 'state/actions/postsActions';
import { sortComments } from 'util/sortUtils';
import { SORT_COMMENTS } from 'constants/comments';
import { MaterialIcons } from '@expo/vector-icons';
import {
  getCommentsByPostId,
  getIsAuthenticated,
  getEnableVotingSlider,
  getAuthUsername,
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import { COLORS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import Comment from 'components/post/comments/Comment';
import tinycolor from 'tinycolor2';
import * as navigationConstants from '../../constants/navigation';

const Container = styled.View``;

const CommentsTitle = styled.Text`
  font-weight: bold;
  font-size: 20px;
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const CommentsTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ReplyIconContainer = styled.View`
  margin-left: auto;
  align-items: center;
  flex-direction: row;
`;

const ReplyText = styled.Text`
  color: ${props => props.customTheme.primaryColor};
  margin-left: 3px;
`;

const mapStateToProps = state => ({
  authUsername: getAuthUsername(state),
  commentsByPostId: getCommentsByPostId(state),
  authenticated: getIsAuthenticated(state),
  enableVotingSlider: getEnableVotingSlider(state),
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
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
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    postData: PropTypes.shape(),
  };

  static defaultProps = {
    navigation: {},
    commentsByPostId: {},
    postData: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      newReplyComment: null,
    };

    this.handleNavigateToReply = this.handleNavigateToReply.bind(this);
    this.handleFetchCurrentComments = this.handleFetchCurrentComments.bind(this);
    this.handleSuccessReply = this.handleSuccessReply.bind(this);
    this.renderReplyComment = this.renderReplyComment.bind(this);
  }

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

  handleSuccessReply(newReplyComment) {
    this.handleFetchCurrentComments();
    this.setState({
      newReplyComment,
    });
  }

  handleFetchCurrentComments() {
    const { postData } = this.props;
    const { author, permlink, id, category } = postData;
    this.props.fetchComments(category, author, permlink, id);
  }

  handleNavigateToReply() {
    const { postData } = this.props;
    this.props.navigation.navigate(navigationConstants.REPLY, {
      parentPost: postData,
      successCreateReply: this.handleSuccessReply,
    });
  }

  renderReplyComment(commentsChildren, firstComment) {
    const { newReplyComment } = this.state;
    const {
      authUsername,
      authenticated,
      navigation,
      postData,
      enableVotingSlider,
      customTheme,
    } = this.props;
    const { id, author } = postData;
    const firstCommentID = _.get(firstComment, 'id');
    const newCommentID = _.get(newReplyComment, 'id');

    if (_.isEqual(firstCommentID, newCommentID)) return null;

    if (!_.isEmpty(newReplyComment)) {
      return (
        <Comment
          authUsername={authUsername}
          depth={0}
          comment={newReplyComment}
          parent={postData}
          rootPostAuthor={author}
          commentsChildren={commentsChildren}
          navigation={navigation}
          authenticated={authenticated}
          currentUserVoteComment={this.props.currentUserVoteComment}
          rootPostId={id}
          sort={SORT_COMMENTS.BEST}
          enableVotingSlider={enableVotingSlider}
          customTheme={customTheme}
        />
      );
    }

    return null;
  }

  render() {
    const {
      authUsername,
      postData,
      commentsByPostId,
      navigation,
      authenticated,
      enableVotingSlider,
      customTheme,
      intl,
    } = this.props;
    const sort = SORT_COMMENTS.BEST;
    const postId = _.get(postData, 'id', 0);
    const postAuthor = _.get(postData, 'author', '');
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

    if (_.isEmpty(firstComment)) {
      return (
        <CommentsTitleContainer>
          <TouchableWithoutFeedback onPress={this.handleNavigateToReply}>
            <ReplyIconContainer>
              <MaterialIcons
                name={MATERIAL_ICONS.reply}
                color={customTheme.primaryColor}
                size={ICON_SIZES.actionIcon}
              />
              <ReplyText customTheme={customTheme}>{intl.reply_to_post}</ReplyText>
            </ReplyIconContainer>
          </TouchableWithoutFeedback>
        </CommentsTitleContainer>
      );
    }

    return (
      <Container>
        <CommentsTitleContainer>
          <CommentsTitle customTheme={customTheme}>{intl.comments}</CommentsTitle>
          {authenticated && (
            <TouchableWithoutFeedback onPress={this.handleNavigateToReply}>
              <ReplyIconContainer>
                <MaterialIcons
                  name={MATERIAL_ICONS.reply}
                  color={customTheme.primaryColor}
                  size={ICON_SIZES.actionIcon}
                />
                <ReplyText customTheme={customTheme}>{intl.reply_to_post}</ReplyText>
              </ReplyIconContainer>
            </TouchableWithoutFeedback>
          )}
        </CommentsTitleContainer>
        {this.renderReplyComment(commentsChildren, firstComment)}
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
          customTheme={customTheme}
        />
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostComments);
