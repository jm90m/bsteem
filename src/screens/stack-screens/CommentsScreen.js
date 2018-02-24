import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchComments } from 'state/actions/postsActions';
import i18n from 'i18n/i18n';
import CommentsContainer from 'components/post/comments/CommentsContainer';
import { ICON_SIZES, MATERIAL_ICONS, COLORS } from 'constants/styles';
import { getCommentsByPostId, getLoadingComments, getIsAuthenticated } from 'state/rootReducer';
import Header from 'components/common/Header';
import LargeLoading from 'components/common/LargeLoading';
import * as editorActions from '../../state/actions/editorActions';
import * as navigationConstants from '../../constants/navigation';

const Container = styled.View``;

const TouchableIcon = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const Title = styled.Text`
  margin-left: 3px;
`;

const LoadingContainer = styled.View`
  margin-top: 50px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const mapStateToProps = state => ({
  commentsByPostId: getCommentsByPostId(state),
  loadingComments: getLoadingComments(state),
  authenticated: getIsAuthenticated(state),
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
  static propTypes = {
    navigation: PropTypes.shape(),
    fetchComments: PropTypes.func.isRequired,
    commentsByPostId: PropTypes.shape(),
    loadingComments: PropTypes.bool,
  };

  static defaultProps = {
    navigation: {},
    commentsByPostId: {},
    loadingComments: false,
  };

  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);

    this.navigateBack = this.navigateBack.bind(this);
    this.handleReplyToPost = this.handleReplyToPost.bind(this);
    this.handleFetchCurrentComments = this.handleFetchCurrentComments.bind(this);
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

  handleReplyToPost() {
    const { authenticated } = this.props;
    const { postData } = this.props.navigation.state.params;

    if (!authenticated) {
      return;
    }

    this.props.navigation.navigate(navigationConstants.REPLY, {
      parentPost: postData,
      successCreateReply: this.handleFetchCurrentComments,
    });
  }

  render() {
    const { loadingComments, navigation } = this.props;
    const { postId, postData } = navigation.state.params;
    return (
      <Container>
        <Header>
          <TouchableIcon onPress={this.navigateBack}>
            <MaterialIcons size={ICON_SIZES.menuIcon} name={MATERIAL_ICONS.back} />
          </TouchableIcon>
          <TitleContainer>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_ICONS.comments}
              color={COLORS.PRIMARY_COLOR}
            />
            <Title>{i18n.titles.comments}</Title>
          </TitleContainer>
          <TouchableIcon onPress={this.handleReplyToPost}>
            <MaterialIcons size={ICON_SIZES.menuIcon} name={MATERIAL_ICONS.reply} />
          </TouchableIcon>
        </Header>
        {loadingComments ? (
          <LoadingContainer>
            <LargeLoading />
          </LoadingContainer>
        ) : (
          <CommentsContainer postId={postId} postData={postData} navigation={navigation} />
        )}
      </Container>
    );
  }
}

export default CommentScreen;
