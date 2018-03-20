import React, { Component } from 'react';
import { RefreshControl, FlatList } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { sortComments } from 'util/sortUtils';
import { COLORS } from 'constants/styles';
import LargeLoading from 'components/common/LargeLoading';
import { SORT_COMMENTS } from 'constants/comments';
import Comment from './Comment';
import i18n from '../../../i18n/i18n';

const EmptyView = styled.View`
  height: 200px;
  width: 50px;
`;

const LoadingContainer = styled.View`
  padding: 40px 0;
  background: ${COLORS.WHITE.WHITE}
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const EmptyCommentsTextContainer = styled.View`
  padding: 20px;
  background-color: ${COLORS.WHITE.WHITE};
`;
const EmptyCommentsText = styled.Text``;

class CommentsList extends Component {
  static propTypes = {
    postData: PropTypes.shape().isRequired,
    postId: PropTypes.number.isRequired,
    currentUserVoteComment: PropTypes.func.isRequired,
    fetchComments: PropTypes.func.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape()),
    commentsChildren: PropTypes.shape(),
    navigation: PropTypes.shape().isRequired,
    loadingComments: PropTypes.bool.isRequired,
    authUsername: PropTypes.string,
    authenticated: PropTypes.bool,
  };

  static defaultProps = {
    comments: [],
    authenticated: false,
    authUsername: '',
    commentsChildren: {},
  };

  constructor(props) {
    super(props);
    const sort = SORT_COMMENTS.BEST;
    const sortedComments = sortComments(props.comments, sort);
    this.state = {
      sort,
      sortedComments,
    };

    this.renderComment = this.renderComment.bind(this);
    this.refreshCommentsList = this.refreshCommentsList.bind(this);
    this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
  }

  refreshCommentsList() {
    const { postData } = this.props;
    const { author, permlink, id, category } = postData;
    this.props.fetchComments(category, author, permlink, id);
  }

  renderComment(rowData) {
    const commentData = _.get(rowData, 'item', {});

    if (_.get(commentData, 'bsteemEmptyView', false)) {
      return <EmptyView />;
    }

    const {
      authUsername,
      authenticated,
      postData,
      commentsChildren,
      navigation,
      currentUserVoteComment,
      postId,
    } = this.props;
    const postAuthor = postData.author;

    return (
      <Comment
        key={commentData.id}
        authUsername={authUsername}
        depth={0}
        authenticated={authenticated}
        rootPostAuthor={postAuthor}
        rootPostId={postId}
        comment={commentData}
        parent={postData}
        commentsChildren={commentsChildren}
        navigation={navigation}
        currentUserVoteComment={currentUserVoteComment}
      />
    );
  }

  renderEmptyComponent() {
    const { comments, loadingComments } = this.props;

    if (loadingComments) {
      return (
        <LoadingContainer>
          <LargeLoading />
        </LoadingContainer>
      );
    } else if (_.isNull(comments) || _.isEmpty(comments)) {
      return (
        <EmptyCommentsTextContainer>
          <EmptyCommentsText>{i18n.comments.noCommentsToShow}</EmptyCommentsText>
        </EmptyCommentsTextContainer>
      );
    }
    return null;
  }

  render() {
    const { comments, loadingComments } = this.props;
    const { sort } = this.state;
    const sortedComments = sortComments(comments, sort);
    const displayComments = _.concat(sortedComments, { bsteemEmptyView: true });

    return (
      <FlatList
        style={{ marginBottom: 30 }}
        data={displayComments}
        enableEmptySections
        renderItem={this.renderComment}
        onEndReachedThreshold={100}
        ListEmptyComponent={this.renderEmptyComponent}
        initialNumToRender={4}
        keyExtractor={(item, index) => `${_.get(item, 'item.id', '')}${index}`}
        refreshControl={
          <RefreshControl
            refreshing={loadingComments}
            onRefresh={this.refreshCommentsList}
            tintColor={COLORS.PRIMARY_COLOR}
            colors={[COLORS.PRIMARY_COLOR]}
          />
        }
      />
    );
  }
}

export default CommentsList;
