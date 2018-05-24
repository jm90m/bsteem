import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchComments } from 'state/actions/postsActions';
import CommentsContainer from 'components/post/comments/CommentsContainer';
import { ICON_SIZES, MATERIAL_ICONS } from 'constants/styles';
import {
  getCommentsByPostId,
  getIsAuthenticated,
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import Header from 'components/common/Header';
import * as editorActions from 'state/actions/editorActions';
import * as navigationConstants from 'constants/navigation';
import { SORT_COMMENTS } from 'constants/comments';
import BSteemModal from 'components/common/BSteemModal';
import CommentsMenu from 'components/post/comments/CommentsMenu';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import TitleText from 'components/common/TitleText';
import BackButton from 'components/common/BackButton';

const Container = styled.View``;

const TouchableIcon = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const mapStateToProps = state => ({
  commentsByPostId: getCommentsByPostId(state),
  authenticated: getIsAuthenticated(state),
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
});

@connect(mapStateToProps, mapDispatchToProps)
class CommentScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    navigation: PropTypes.shape(),
    customTheme: PropTypes.shape().isRequired,
    fetchComments: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    commentsByPostId: PropTypes.shape(),
    authenticated: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    navigation: {},
    commentsByPostId: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      displayMenu: false,
      sort: SORT_COMMENTS.BEST,
    };

    this.navigateBack = this.navigateBack.bind(this);
    this.navigateToReplyScreen = this.navigateToReplyScreen.bind(this);
    this.handleReplyToPost = this.handleReplyToPost.bind(this);
    this.handleFetchCurrentComments = this.handleFetchCurrentComments.bind(this);
    this.successCreateReply = this.successCreateReply.bind(this);
  }

  componentDidMount() {
    const { commentsByPostId } = this.props;
    const { author, permlink, postId, category } = this.props.navigation.state.params;
    const postComments = _.get(commentsByPostId, postId, null);
    if (_.isEmpty(postComments) || _.isNull(postComments)) {
      this.props.fetchComments(category, author, permlink, postId);
    }
  }

  handleFetchCurrentComments() {
    const { author, permlink, postId, category } = this.props.navigation.state.params;
    this.props.fetchComments(category, author, permlink, postId);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  successCreateReply() {
    this.handleFetchCurrentComments();
    this.setState({
      sort: SORT_COMMENTS.NEWEST,
    });
  }

  navigateToReplyScreen() {
    const { postData } = this.props.navigation.state.params;
    this.props.navigation.navigate(navigationConstants.REPLY, {
      parentPost: postData,
      successCreateReply: this.successCreateReply,
    });
  }

  handleSetDisplayMenu = displayMenu => () => this.setState({ displayMenu });

  handleSortComments = sort => () =>
    this.setState({
      sort,
      displayMenu: false,
    });

  handleReplyToPost() {
    this.navigateToReplyScreen();
  }

  render() {
    const { navigation, authenticated, customTheme, intl } = this.props;
    const { displayMenu, sort } = this.state;
    const { postId, postData } = navigation.state.params;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <TitleContainer>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_ICONS.comments}
              color={customTheme.primaryColor}
            />
            <TitleText style={{ marginLeft: 3 }}>{intl.comments}</TitleText>
          </TitleContainer>
          {authenticated ? (
            <TouchableIcon onPress={this.handleReplyToPost}>
              <MaterialIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_ICONS.reply}
                color={customTheme.primaryColor}
              />
            </TouchableIcon>
          ) : (
            <HeaderEmptyView />
          )}
        </Header>
        <CommentsContainer
          postId={postId}
          postData={postData}
          navigation={navigation}
          sort={sort}
          handleDisplayMenu={this.handleSetDisplayMenu(true)}
        />
        {displayMenu && (
          <BSteemModal visible={displayMenu} handleOnClose={this.handleSetDisplayMenu(false)}>
            <CommentsMenu
              handleSortComments={this.handleSortComments}
              hideMenu={this.handleSetDisplayMenu(false)}
              customTheme={customTheme}
              intl={intl}
            />
          </BSteemModal>
        )}
      </Container>
    );
  }
}

export default CommentScreen;
