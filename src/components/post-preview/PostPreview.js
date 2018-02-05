import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { COLORS } from 'constants/styles';
import {
  getIsAuthenticated,
  getAuthUsername,
  getCurrentUserRebloggedList,
} from 'state/rootReducer';
import { currentUserVotePost, currentUserReblogPost } from 'state/actions/currentUserActions';
import { isPostVoted } from 'util/voteUtils';
import * as navigationConstants from 'constants/navigation';
import * as postConstants from 'constants/postConstants';
import PostPhotoBrowser from 'components/post/PostPhotoBrowser';
import ReblogModal from 'components/post/ReblogModal';
import Footer from './Footer';
import Header from './Header';
import BodyShort from './BodyShort';
import PreviewImage from './PreviewImage';
import PostMenu from 'components/post-menu/PostMenu';

const Container = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  margin-top: 5px;
  margin-bottom: 5px;
  border-color: ${COLORS.WHITE.WHITE_SMOKE};
  border-width: 2px;
`;

const Content = styled.View`
  padding-bottom: 10px;
`;

const Title = styled.Text`
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 20px;
  margin: 5px;
`;

const Touchable = styled.TouchableOpacity``;

const mapStateToProps = state => ({
  authenticated: getIsAuthenticated(state),
  authUsername: getAuthUsername(state),
  rebloggedList: getCurrentUserRebloggedList(state),
});

const mapDispatchToProps = dispatch => ({
  currentUserVotePost: (
    postAuthor,
    postPermlink,
    voteWeight,
    voteSuccessCallback,
    voteFailCallback,
  ) =>
    dispatch(
      currentUserVotePost.action({
        postAuthor,
        postPermlink,
        voteWeight,
        voteSuccessCallback,
        voteFailCallback,
      }),
    ),
  currentUserReblogPost: (
    postId,
    postAuthor,
    postPermlink,
    reblogSuccessCallback,
    reblogFailCallback,
  ) =>
    dispatch(
      currentUserReblogPost.action({
        postId,
        postAuthor,
        postPermlink,
        reblogSuccessCallback,
        reblogFailCallback,
      }),
    ),
});
@connect(mapStateToProps, mapDispatchToProps)
class PostPreview extends Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    authUsername: PropTypes.string,
    currentUserReblogPost: PropTypes.func.isRequired,
    currentUserVotePost: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
    postData: PropTypes.shape(),
    rebloggedList: PropTypes.arrayOf(PropTypes.string),
    currentUsername: PropTypes.string,
  };

  static defaultProps = {
    postData: {},
    authenticated: false,
    authUsername: '',
    rebloggedList: [],
    currentUsername: '',
  };

  constructor(props) {
    super(props);
    const { postData } = props;

    this.state = {
      likedPost: isPostVoted(postData, props.authUsername),
      loadingVote: false,
      displayReblogModal: false,
      loadingReblog: false,
      displayPhotoBrowser: false,
      displayMenu: false,
    };

    this.handleOnPressVote = this.handleOnPressVote.bind(this);
    this.loadingVote = this.loadingVote.bind(this);
    this.likedVoteSuccess = this.likedVoteSuccess.bind(this);
    this.unlikedVoteSuccess = this.unlikedVoteSuccess.bind(this);
    this.showReblogModal = this.showReblogModal.bind(this);
    this.hideReblogModal = this.hideReblogModal.bind(this);
    this.handleDisplayMenu = this.handleDisplayMenu.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.handleDisplayPhotoBrowser = this.handleDisplayPhotoBrowser.bind(this);
    this.handleReblogConfirm = this.handleReblogConfirm.bind(this);
    this.loadingReblogStart = this.loadingReblogStart.bind(this);
    this.loadingReblogEnd = this.loadingReblogEnd.bind(this);
    this.handleNavigateToPost = this.handleNavigateToPost.bind(this);
    this.handleNavigateToComments = this.handleNavigateToComments.bind(this);
    this.handleHidePhotoBrowser = this.handleHidePhotoBrowser.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const isDifferentAuthenticated = this.props.authenticated !== nextProps.authenticated;
    const isDifferentAuthUsername = this.props.authUsername !== nextProps.authUsername;

    if (isDifferentAuthenticated || isDifferentAuthUsername) {
      const { postData, authUsername } = nextProps;
      this.setState({
        likedPost: isPostVoted(postData, authUsername),
        loadingVote: false,
      });
    }
  }

  loadingVote() {
    this.setState({
      loadingVote: true,
    });
  }

  likedVoteSuccess() {
    this.setState({
      likedPost: true,
      loadingVote: false,
    });
  }

  unlikedVoteSuccess() {
    this.setState({
      likedPost: false,
      loadingVote: false,
    });
  }

  handleOnPressVote() {
    const { navigation, authenticated, postData } = this.props;
    if (authenticated) {
      const { author, permlink } = postData;
      const { likedPost } = this.state;

      this.loadingVote();

      if (likedPost) {
        const voteSuccessCallback = this.unlikedVoteSuccess;
        const voteFailCalback = this.likedVoteSuccess;
        this.props.currentUserVotePost(
          author,
          permlink,
          postConstants.DEFAULT_UNVOTE_WEIGHT,
          voteSuccessCallback,
          voteFailCalback,
        );
      } else {
        const voteSuccessCallback = this.likedVoteSuccess;
        const voteFailCallback = this.unlikedVoteSuccess;
        this.props.currentUserVotePost(
          author,
          permlink,
          postConstants.DEFAULT_VOTE_WEIGHT,
          voteSuccessCallback,
          voteFailCallback,
        );
      }
    } else {
      navigation.navigate(navigationConstants.LOGIN);
    }
  }

  loadingReblogStart() {
    this.setState({
      loadingReblog: true,
      displayReblogModal: false,
    });
  }

  loadingReblogEnd() {
    this.setState({
      loadingReblog: false,
      displayReblogModal: false,
    });
  }

  showReblogModal() {
    const { authenticated, navigation } = this.props;
    if (authenticated) {
      this.setState({
        displayReblogModal: true,
      });
    } else {
      navigation.navigate(navigationConstants.LOGIN);
    }
  }

  hideReblogModal() {
    this.setState({
      displayReblogModal: false,
    });
  }

  handleReblogConfirm() {
    const { postData } = this.props;
    const { id, author, permlink } = postData;
    this.loadingReblogStart();
    this.props.currentUserReblogPost(
      id,
      author,
      permlink,
      this.loadingReblogEnd,
      this.loadingReblogEnd,
    );
  }

  handleDisplayMenu() {
    this.setState({
      displayMenu: true,
    });
  }

  handleHideMenu() {
    this.setState({
      displayMenu: false,
    });
  }

  handleDisplayPhotoBrowser() {
    this.setState({
      displayPhotoBrowser: true,
    });
  }

  handleHidePhotoBrowser() {
    this.setState({ displayPhotoBrowser: false });
  }

  handleNavigateToPost() {
    const { postData } = this.props;
    const { title, category, author, json_metadata, body, permlink, id } = postData;
    const parsedJsonMetadata = JSON.parse(json_metadata);
    this.props.navigation.navigate(navigationConstants.POST, {
      title,
      body,
      permlink,
      author,
      parsedJsonMetadata,
      category,
      postId: id,
      postData,
    });
  }

  handleNavigateToComments() {
    const { postData } = this.props;
    const { category, author, permlink, id } = postData;
    this.props.navigation.navigate(navigationConstants.COMMENTS, {
      author,
      category,
      permlink,
      postId: id,
      postData,
    });
  }

  render() {
    const { postData, navigation, authUsername, rebloggedList, currentUsername } = this.props;
    const {
      likedPost,
      loadingVote,
      displayReblogModal,
      loadingReblog,
      displayPhotoBrowser,
      displayMenu,
    } = this.state;
    const { title, json_metadata, body } = postData;
    const parsedJsonMetadata = JSON.parse(json_metadata);
    const images = parsedJsonMetadata.image || [];
    const previewImage = _.head(images);
    const hasPreviewImage = images.length > 0 && !_.isEmpty(previewImage);
    const formattedImages = _.map(images, image => ({ photo: image }));
    return (
      <Container>
        <Header
          postData={postData}
          navigation={navigation}
          currentUsername={currentUsername}
          displayMenu={this.handleDisplayMenu}
        />
        <Content>
          <Touchable onPress={this.handleNavigateToPost}>
            <Title>{title}</Title>
          </Touchable>
          <Touchable onPress={this.handleDisplayPhotoBrowser}>
            {hasPreviewImage && <PreviewImage images={images} />}
          </Touchable>
          <Touchable onPress={this.handleNavigateToPost}>
            <BodyShort content={body} />
          </Touchable>
        </Content>
        <Footer
          authUsername={authUsername}
          likedPost={likedPost}
          loadingReblog={loadingReblog}
          loadingVote={loadingVote}
          onPressVote={this.handleOnPressVote}
          handleNavigateToComments={this.handleNavigateToComments}
          postData={postData}
          reblogPost={this.showReblogModal}
          rebloggedList={rebloggedList}
        />
        <Modal
          animationType="slide"
          transparent
          visible={displayReblogModal}
          onRequestClose={this.hideReblogModal}
        >
          <ReblogModal closeModal={this.hideReblogModal} confirmReblog={this.handleReblogConfirm} />
        </Modal>
        <PostPhotoBrowser
          displayPhotoBrowser={displayPhotoBrowser}
          mediaList={formattedImages}
          handleClose={this.handleHidePhotoBrowser}
          initialPhotoIndex={0}
        />
        <Modal
          animationType="slide"
          transparent
          visible={displayMenu}
          onRequestClose={this.handleHideMenu}
        >
          <PostMenu hideMenu={this.handleHideMenu} />
        </Modal>
      </Container>
    );
  }
}

export default PostPreview;
