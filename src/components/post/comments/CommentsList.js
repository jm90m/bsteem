import React, { Component } from 'react';
import { RefreshControl, FlatList } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { sortComments } from 'util/sortUtils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import PrimaryText from 'components/common/text/PrimaryText';
import LargeLoading from 'components/common/LargeLoading';
import tinycolor from 'tinycolor2';
import Comment from './Comment';

const EmptyView = styled.View`
  height: 200px;
  width: 50px;
`;

const LoadingContainer = styled.View`
  padding: 40px 0;
  background: ${props => props.customTheme.primaryBackgroundColor};
  width: 100%;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100%;
`;

const EmptyCommentsTextContainer = styled.View`
  padding: 20px;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;
const EmptyCommentsText = styled(PrimaryText)`
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const TouchableFilter = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 5px;
  background-color: ${props => props.customTheme.primaryBackgroundColor}
  width: 100%;
`;

const FilterMenuIcon = styled.View`
  margin-top: 3px;
`;

const FilterText = styled(PrimaryText)`
  color: ${props => props.customTheme.primaryColor};
  margin-left: 3px;
`;

const BoldText = styled(PrimaryText)``;

class CommentsList extends Component {
  static propTypes = {
    postData: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    postId: PropTypes.number.isRequired,
    currentUserVoteComment: PropTypes.func.isRequired,
    fetchComments: PropTypes.func.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape()),
    commentsChildren: PropTypes.shape(),
    navigation: PropTypes.shape().isRequired,
    loadingComments: PropTypes.bool.isRequired,
    authUsername: PropTypes.string,
    authenticated: PropTypes.bool,
    sort: PropTypes.shape().isRequired,
    handleDisplayMenu: PropTypes.func.isRequired,
    enableVotingSlider: PropTypes.bool.isRequired,
    intl: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    comments: [],
    authenticated: false,
    authUsername: '',
    commentsChildren: {},
  };

  constructor(props) {
    super(props);

    this.renderComment = this.renderComment.bind(this);
    this.refreshCommentsList = this.refreshCommentsList.bind(this);
    this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
    this.renderHeaderComponent = this.renderHeaderComponent.bind(this);
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
      sort,
      enableVotingSlider,
      customTheme,
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
        sort={sort}
        enableVotingSlider={enableVotingSlider}
        customTheme={customTheme}
      />
    );
  }

  renderHeaderComponent() {
    const { handleDisplayMenu, sort, loadingComments, customTheme, intl, comments } = this.props;

    if (loadingComments) return null;

    if (_.isNull(comments) || _.isEmpty(comments)) {
      return (
        <EmptyCommentsTextContainer customTheme={customTheme}>
          <EmptyCommentsText customTheme={customTheme}>
            {intl.no_comments_to_show}
          </EmptyCommentsText>
        </EmptyCommentsTextContainer>
      );
    }

    return (
      <TouchableFilter onPress={handleDisplayMenu} customTheme={customTheme}>
        <MaterialCommunityIcons
          name={sort.icon}
          size={ICON_SIZES.menuIcon}
          color={customTheme.primaryColor}
        />
        <FilterText customTheme={customTheme}>
          {`${intl.sort_by} `}
          <BoldText>{intl[sort.label]}</BoldText>
        </FilterText>
        <FilterMenuIcon>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.chevronDown}
            size={ICON_SIZES.menuIcon}
            color={customTheme.primaryColor}
          />
        </FilterMenuIcon>
      </TouchableFilter>
    );
  }

  renderEmptyComponent() {
    const { comments, loadingComments, customTheme, intl } = this.props;

    if (loadingComments) {
      return (
        <LoadingContainer customTheme={customTheme}>
          <LargeLoading />
        </LoadingContainer>
      );
    } else if (_.isNull(comments) || _.isEmpty(comments)) {
      return (
        <EmptyCommentsTextContainer customTheme={customTheme}>
          <EmptyCommentsText customTheme={customTheme}>
            {intl.no_comments_to_show}
          </EmptyCommentsText>
        </EmptyCommentsTextContainer>
      );
    }
    return null;
  }

  render() {
    const { comments, loadingComments, sort, customTheme } = this.props;
    const sortedComments = sortComments(comments, sort.id);
    const displayComments = _.concat(sortedComments, { bsteemEmptyView: true });
    const flatListStyle = {
      marginBottom: 30,
      backgroundColor: customTheme.primaryBackgroundColor,
    };

    return (
      <FlatList
        style={flatListStyle}
        data={displayComments}
        enableEmptySections
        renderItem={this.renderComment}
        onEndReachedThreshold={100}
        ListEmptyComponent={this.renderEmptyComponent}
        ListHeaderComponent={this.renderHeaderComponent}
        initialNumToRender={4}
        keyExtractor={(item, index) => `${_.get(item, 'item.id', '')}${index}`}
        refreshControl={
          <RefreshControl
            refreshing={loadingComments}
            onRefresh={this.refreshCommentsList}
            tintColor={customTheme.primaryColor}
            colors={[customTheme.primaryColor]}
          />
        }
      />
    );
  }
}

export default CommentsList;
