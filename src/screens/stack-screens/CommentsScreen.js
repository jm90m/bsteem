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
import { getCommentsByPostId } from 'state/rootReducer';
import withAuthActions from 'components/common/withAuthActions';
import Header from 'components/common/Header';
import * as editorActions from 'state/actions/editorActions';
import * as navigationConstants from 'constants/navigation';
import { SORT_COMMENTS } from 'constants/comments';
import BSteemModal from 'components/common/BSteemModal';
import CommentsMenu from 'components/post/comments/CommentsMenu';

const Container = styled.View``;

const TouchableIcon = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const Title = styled.Text`
  margin-left: 3px;
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const mapStateToProps = state => ({
  commentsByPostId: getCommentsByPostId(state),
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
    onActionInitiated: PropTypes.func.isRequired,
    commentsByPostId: PropTypes.shape(),
  };

  static defaultProps = {
    navigation: {},
    commentsByPostId: {},
  };

  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
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

  navigateToReplyScreen() {
    const { postData } = this.props.navigation.state.params;
    this.props.navigation.navigate(navigationConstants.REPLY, {
      parentPost: postData,
      successCreateReply: this.handleFetchCurrentComments,
    });
  }

  handleSetDisplayMenu = displayMenu => () => this.setState({ displayMenu });

  handleSortComments = sort => () =>
    this.setState({
      sort,
      displayMenu: false,
    });

  handleReplyToPost() {
    this.props.onActionInitiated(this.navigateToReplyScreen);
  }

  render() {
    const { navigation } = this.props;
    const { displayMenu, sort } = this.state;
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
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_ICONS.reply}
              color={COLORS.PRIMARY_COLOR}
            />
          </TouchableIcon>
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
            />
          </BSteemModal>
        )}
      </Container>
    );
  }
}

export default withAuthActions(CommentScreen);
