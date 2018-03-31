import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Share, View } from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { COLORS } from 'constants/styles';
import { jsonParse } from 'util/bsteemUtils';
import {
  getIsAuthenticated,
  getAuthUsername,
  getCurrentUserRebloggedList,
  getDisplayNSFWContent,
  getReportedPosts,
  getEnableVotingSlider,
} from 'state/rootReducer';
import { currentUserVotePost, currentUserReblogPost } from 'state/actions/currentUserActions';
import { isPostVoted } from 'util/voteUtils';
import BSteemModal from 'components/common/BSteemModal';
import * as navigationConstants from 'constants/navigation';
import * as postConstants from 'constants/postConstants';
import PostPhotoBrowser from 'components/post/PostPhotoBrowser';
import ReblogModal from 'components/post/ReblogModal';
import PostMenu from 'components/post-menu/PostMenu';
import EmbedContent from 'components/post-preview/EmbedContent';
import { isPostTaggedNSFW } from 'util/postUtils';
import { getReputation } from 'util/steemitFormatters';
import i18n from 'i18n/i18n';
import Footer from './Footer';
import Header from './Header';
import BodyShort from './BodyShort';
import PostVoteSlider from '../post/PostVoteSlider';
import PostImage from '../post/PostImage';
import { getPostPreviewComponents, getEmbeds } from '../../util/postPreviewUtils';
import withAuthActions from '../common/withAuthActions';

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

const HiddenPreviewText = styled.Text`
  padding: 0 5px;
`;

const HiddenContentLink = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  padding: 0 5px;
`;

const TextTouchable = styled.TouchableWithoutFeedback``;

const mapStateToProps = state => ({
  authenticated: getIsAuthenticated(state),
  authUsername: getAuthUsername(state),
  rebloggedList: getCurrentUserRebloggedList(state),
  displayNSFWContent: getDisplayNSFWContent(state),
  reportedPosts: getReportedPosts(state),
  enableVotingSlider: getEnableVotingSlider(state),
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

class PostPreview extends Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    authUsername: PropTypes.string,
    currentUserReblogPost: PropTypes.func.isRequired,
    currentUserVotePost: PropTypes.func.isRequired,
    onActionInitiated: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
    postData: PropTypes.shape(),
    rebloggedList: PropTypes.arrayOf(PropTypes.string),
    reportedPosts: PropTypes.arrayOf(PropTypes.shape()),
    currentUsername: PropTypes.string,
    displayNSFWContent: PropTypes.bool.isRequired,
    enableVotingSlider: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    postData: {},
    authenticated: false,
    authUsername: '',
    rebloggedList: [],
    reportedPosts: [],
    currentUsername: '',
  };

  constructor(props) {
    super(props);
    const { postData, reportedPosts } = props;
    const postAuthorReputation = getReputation(postData.author_reputation);
    const isReported = _.findIndex(reportedPosts, post => post.id === postData.id) > -1;
    let displayPostPreview = true;

    if (postAuthorReputation >= 0 && isPostTaggedNSFW(postData)) {
      displayPostPreview = props.displayNSFWContent;
    } else if (postAuthorReputation < 0) {
      displayPostPreview = false;
    } else if (isReported) {
      displayPostPreview = false;
    }

    this.state = {
      likedPost: isPostVoted(postData, props.authUsername),
      loadingVote: false,
      displayReblogModal: false,
      loadingReblog: false,
      displayPhotoBrowser: false,
      displayMenu: false,
      displayPostPreview,
      displayVoteSlider: false,
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
    this.handleNavigateToVotes = this.handleNavigateToVotes.bind(this);
    this.handlePhotoBrowserShare = this.handlePhotoBrowserShare.bind(this);
    this.handleAuthVote = this.handleAuthVote.bind(this);
    this.handleReblogIconPress = this.handleReblogIconPress.bind(this);
    this.displayHiddenContent = this.displayHiddenContent.bind(this);
    this.handleEditPost = this.handleEditPost.bind(this);
    this.sendVote = this.sendVote.bind(this);
    this.handleVoteSliderSendVote = this.handleVoteSliderSendVote.bind(this);
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

    const isDifferentReportedPosts = !_.isEqual(
      JSON.stringify(this.props.reportedPosts),
      JSON.stringify(nextProps.reportedPosts),
    );

    if (isDifferentReportedPosts) {
      const { postData } = this.props;
      const isReported = _.findIndex(nextProps.reportedPosts, post => post.id === postData.id) > -1;
      if (isReported) {
        this.setState({
          displayPostPreview: false,
        });
      }
    }
  }

  loadingVote() {
    this.setState({
      loadingVote: true,
    });
  }

  likedVoteSuccess(votePercent) {
    const { enableVotingSlider, postData, authUsername } = this.props;
    try {
      // directly modify the current vote post data, if it does not have an active vote then
      // create a new vote object
      if (enableVotingSlider) {
        let hasActiveVote = false;
        for (let i = 0; i < _.size(postData.active_votes); i += 1) {
          if (authUsername === postData.active_votes[i].voter) {
            postData.active_votes[i].percent = votePercent;
            hasActiveVote = true;
            break;
          }
        }

        if (!hasActiveVote) {
          const newVoteObject = {
            voter: authUsername,
            percent: votePercent,
          };
          postData.active_votes.push(newVoteObject);
        }
      }
    } catch (error) {
      console.log(error);
    }
    const likedPost = votePercent > 0;

    this.setState({
      likedPost,
      loadingVote: false,
    });
  }

  unlikedVoteSuccess() {
    this.setState({
      likedPost: false,
      loadingVote: false,
    });
  }

  sendVote(voteWeight) {
    this.loadingVote();

    const { postData, enableVotingSlider } = this.props;
    const { author, permlink } = postData;
    const { likedPost } = this.state;

    if (likedPost && !enableVotingSlider) {
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
        voteWeight,
        voteSuccessCallback,
        voteFailCallback,
      );
    }
  }

  handleVoteSliderSendVote(voteWeight) {
    this.setState({
      displayVoteSlider: false,
    });
    this.sendVote(voteWeight);
  }

  handleAuthVote() {
    const { enableVotingSlider } = this.props;

    if (enableVotingSlider) {
      this.setState({
        displayVoteSlider: true,
      });
      return;
    }

    this.sendVote();
  }

  displayHiddenContent() {
    this.setState({
      displayPostPreview: true,
    });
  }

  handleOnPressVote() {
    this.handleHideMenu();
    this.props.onActionInitiated(this.handleAuthVote);
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
    this.setState({
      displayReblogModal: true,
    });
  }

  handleReblogIconPress() {
    this.handleHideMenu();
    this.props.onActionInitiated(this.showReblogModal);
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

  handleVoteSliderDisplay = displayVoteSlider => () => this.setState({ displayVoteSlider });

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

  handlePhotoBrowserShare(photoData) {
    const { photo } = photoData;
    const content = {
      message: photo,
      title: photo,
      url: photo,
    };
    Share.share(content);
  }

  handleNavigateToPost() {
    const { postData } = this.props;
    const { title, category, author, json_metadata, body, permlink, id } = postData;
    const parsedJsonMetadata = jsonParse(json_metadata);
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
    this.handleHideMenu();
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

  handleNavigateToVotes() {
    const { postData } = this.props;
    this.props.navigation.navigate(navigationConstants.VOTES, {
      postData,
    });
  }

  getDisplayPostPreview() {
    const { postData, displayNSFWContent, reportedPosts } = this.props;
    const { displayPostPreview } = this.state;
    const isReported = _.findIndex(reportedPosts, post => post.id === postData.id) > -1;
    const postAuthorReputation = getReputation(postData.author_reputation);

    if (displayPostPreview) return true;

    if (postAuthorReputation >= 0 && isPostTaggedNSFW(postData)) {
      return displayNSFWContent;
    } else if (postAuthorReputation < 0) {
      return false;
    } else if (isReported) {
      return false;
    }

    return true;
  }

  renderHiddenPreviewText() {
    const { postData, reportedPosts } = this.props;
    const isReported = _.findIndex(reportedPosts, post => post.id === postData.id) > -1;
    let hiddenPreviewText = i18n.post.lowAuthorReputationPostPreview;

    if (isPostTaggedNSFW(postData)) {
      hiddenPreviewText = i18n.post.nsfwPostHidden;
    } else if (isReported) {
      hiddenPreviewText = i18n.post.reportedPostHidden;
    }

    return (
      <View>
        <HiddenPreviewText>{`${hiddenPreviewText} `}</HiddenPreviewText>
        <TextTouchable onPress={this.displayHiddenContent}>
          <HiddenContentLink>{i18n.post.displayHiddenContent}</HiddenContentLink>
        </TextTouchable>
      </View>
    );
  }

  handleEditPost() {
    const { postData } = this.props;
    this.handleHideMenu();
    this.props.navigation.navigate(navigationConstants.EDIT_POST, {
      postData,
    });
  }

  renderPreview() {
    const { postData } = this.props;
    const { id } = postData;
    const { json_metadata, body } = postData;
    const jsonMetadata = _.attempt(JSON.parse, json_metadata);
    const postJSONMetaData = _.isError(jsonMetadata) ? {} : jsonMetadata;
    const images = _.get(postJSONMetaData, 'image', []);
    const previewImage = _.head(images);
    const hasPreviewImage = images.length > 0 && !_.isEmpty(previewImage);
    const embedOptions = {};
    const embeds = getEmbeds(postData, embedOptions);
    const firstEmbed = _.head(embeds);
    const hasVideo = !_.isEmpty(firstEmbed);

    const textComponent = (
      <Touchable onPress={this.handleNavigateToPost} key={`text-component-${id}`}>
        <BodyShort content={body} />
      </Touchable>
    );
    const imageComponent = hasPreviewImage ? (
      <Touchable onPress={this.handleDisplayPhotoBrowser} key={`image-component-${id}`}>
        <PostImage images={images} />
      </Touchable>
    ) : null;
    const embedComponent = hasVideo ? (
      <EmbedContent embedContent={firstEmbed} key={`embed-component-${id}`} />
    ) : null;

    return getPostPreviewComponents(body, textComponent, imageComponent, embedComponent);
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
      displayVoteSlider,
    } = this.state;
    const { title, json_metadata } = postData;
    const parsedJsonMetadata = jsonParse(json_metadata);
    const images = parsedJsonMetadata.image || [];
    const formattedImages = _.map(images, image => ({ photo: image }));
    const showPostPreview = this.getDisplayPostPreview();
    const hiddenStoryPreviewMessage = this.renderHiddenPreviewText();

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
          {showPostPreview ? this.renderPreview() : hiddenStoryPreviewMessage}
        </Content>
        {displayVoteSlider ? (
          <PostVoteSlider
            postData={postData}
            hideVoteSlider={this.handleVoteSliderDisplay(false)}
            handleVoteSliderSendVote={this.handleVoteSliderSendVote}
          />
        ) : (
          <Footer
            authUsername={authUsername}
            likedPost={likedPost}
            loadingReblog={loadingReblog}
            loadingVote={loadingVote}
            onPressVote={this.handleOnPressVote}
            handleNavigateToComments={this.handleNavigateToComments}
            postData={postData}
            reblogPost={this.handleReblogIconPress}
            rebloggedList={rebloggedList}
            handleNavigateToVotes={this.handleNavigateToVotes}
          />
        )}
        {displayReblogModal && (
          <BSteemModal visible={displayReblogModal} handleOnClose={this.hideReblogModal}>
            <ReblogModal
              closeModal={this.hideReblogModal}
              confirmReblog={this.handleReblogConfirm}
            />
          </BSteemModal>
        )}
        {displayPhotoBrowser && (
          <PostPhotoBrowser
            displayPhotoBrowser={displayPhotoBrowser}
            mediaList={formattedImages}
            handleClose={this.handleHidePhotoBrowser}
            initialPhotoIndex={0}
            handleAction={this.handlePhotoBrowserShare}
          />
        )}
        {displayMenu && (
          <BSteemModal visible={displayMenu} handleOnClose={this.handleHideMenu}>
            <PostMenu
              hideMenu={this.handleHideMenu}
              postData={postData}
              handleNavigateToComments={this.handleNavigateToComments}
              handleReblog={this.handleReblogIconPress}
              handleLikePost={this.handleOnPressVote}
              rebloggedList={rebloggedList}
              likedPost={likedPost}
              handleEditPost={this.handleEditPost}
            />
          </BSteemModal>
        )}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuthActions(PostPreview));
