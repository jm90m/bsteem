import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Dimensions, Share } from 'react-native';
import { connect } from 'react-redux';
import Expo from 'expo';
import styled from 'styled-components/native';
import _ from 'lodash';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getHtml } from 'util/postUtils';
import { COLORS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import { POST_HTML_BODY_TAG, POST_HTML_BODY_USER } from 'constants/postConstants';
import * as navigationConstants from 'constants/navigation';
import {
  getIsAuthenticated,
  getPostLoading,
  getPostsDetails,
  getAuthUsername,
  getEnableVotingSlider,
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import PostPhotoBrowser from 'components/post/PostPhotoBrowser';
import PostMenu from 'components/post-menu/PostMenu';
import HTML from 'react-native-render-html';
import FooterTags from 'components/post/FooterTags';
import Footer from 'components/post/Footer';
import PostHeader from 'components/post-preview/Header';
import Header from 'components/common/Header';
import BSteemModal from 'components/common/BSteemModal';
import EmbedContent from 'components/post-preview/EmbedContent';
import PostVoteSlider from 'components/post/PostVoteSlider';
import PostComments from 'components/post/PostComments';
import BackButton from 'components/common/BackButton';
import PrimaryButton from 'components/common/PrimaryButton';
import TitleText from 'components/common/TitleText';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import tinycolor from 'tinycolor2';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import { currentUserVotePost } from '../../state/actions/currentUserActions';
import * as postConstants from '../../constants/postConstants';
import { isPostVoted } from '../../util/voteUtils';
import { fetchPostDetails } from '../../state/actions/postsActions';
import { getProxyImageURL } from '../../util/imageUtils';

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled(StyledViewPrimaryBackground)`
  flex: 1;
`;

const Touchable = styled.TouchableOpacity``;

const Menu = styled.View`
  justify-content: center;
  padding: 10px;
`;

const PostTitle = styled(StyledTextByBackground)`
  font-weight: 700;
  font-size: 20px;
`;

const EmptyView = styled.View`
  width: 100%;
  height: 100px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  authenticated: getIsAuthenticated(state),
  authUsername: getAuthUsername(state),
  postsDetails: getPostsDetails(state),
  postLoading: getPostLoading(state),
  enableVotingSlider: getEnableVotingSlider(state),
  intl: getIntl(state),
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
  fetchPostDetails: (author, permlink) => dispatch(fetchPostDetails.action({ author, permlink })),
});

@connect(mapStateToProps, mapDispatchToProps)
class PostScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    navigation: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    enableVotingSlider: PropTypes.bool,
    currentUserVotePost: PropTypes.func.isRequired,
    fetchPostDetails: PropTypes.func.isRequired,
    authUsername: PropTypes.string,
    postsDetails: PropTypes.shape(),
  };

  static defaultProps = {
    authUsername: '',
    postsDetails: {},
    enableVotingSlider: false,
  };

  constructor(props) {
    super(props);
    const postData = _.get(props.navigation.state.params, 'postData', {});

    this.state = {
      menuVisible: false,
      displayPhotoBrowser: false,
      loadingVote: false,
      likedPost: isPostVoted(postData, props.authUsername),
      postDetails: postData,
      displayVoteSlider: false,
    };

    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.handleHidePhotoBrowser = this.handleHidePhotoBrowser.bind(this);
    this.handleDisplayPhotoBrowser = this.handleDisplayPhotoBrowser.bind(this);
    this.handlePhotoBrowserShare = this.handlePhotoBrowserShare.bind(this);

    this.navigateBack = this.navigateBack.bind(this);
    this.navigateToComments = this.navigateToComments.bind(this);
    this.navigateToLoginTab = this.navigateToLoginTab.bind(this);
    this.navigateToUser = this.navigateToUser.bind(this);
    this.navigateToVotes = this.navigateToVotes.bind(this);
    this.navigateToFeed = this.navigateToFeed.bind(this);

    this.handleLikePost = this.handleLikePost.bind(this);
    this.handlePostLinkPress = this.handlePostLinkPress.bind(this);
    this.handleEditPost = this.handleEditPost.bind(this);

    this.loadingVote = this.loadingVote.bind(this);
    this.likedVoteSuccess = this.likedVoteSuccess.bind(this);
    this.unlikedVoteSuccess = this.unlikedVoteSuccess.bind(this);
    this.fetchCurrentPostDetails = this.fetchCurrentPostDetails.bind(this);

    this.handleVoteSliderSendVote = this.handleVoteSliderSendVote.bind(this);
    this.sendVote = this.sendVote.bind(this);
  }

  componentDidMount() {
    this.fetchCurrentPostDetails();
  }

  componentWillReceiveProps(nextProps) {
    const { postData } = this.props.navigation.state.params;
    const { author, permlink } = postData;
    const postKey = `${author}/${permlink}`;
    const currentPostDetails = _.get(this.props.postsDetails, postKey, {});
    const nextPostDetails = _.get(nextProps.postsDetails, postKey, {});

    if (!_.isEqual(currentPostDetails, nextPostDetails)) {
      this.setState({
        postDetails: nextPostDetails,
      });
    }
  }

  setModalVisible(visible) {
    this.setState({ menuVisible: visible });
  }

  handleHideMenu() {
    this.setModalVisible(false);
  }

  loadingVote() {
    this.setState({
      loadingVote: true,
    });
  }

  likedVoteSuccess() {
    this.setState(
      {
        likedPost: true,
        loadingVote: false,
      },
      () => this.fetchCurrentPostDetails(),
    );
  }

  unlikedVoteSuccess() {
    this.setState(
      {
        likedPost: false,
        loadingVote: false,
      },
      () => this.fetchCurrentPostDetails(),
    );
  }

  fetchCurrentPostDetails() {
    const { postData } = this.props.navigation.state.params;
    const { author, permlink } = postData;
    this.props.fetchPostDetails(author, permlink);
  }

  handleVoteSliderDisplay = displayVoteSlider => () => this.setState({ displayVoteSlider });

  handleVoteSliderSendVote(voteWeight) {
    this.setState({
      displayVoteSlider: false,
    });
    this.sendVote(voteWeight);
  }

  sendVote(voteWeight) {
    this.loadingVote();
    const { enableVotingSlider } = this.props;
    const { postData } = this.props.navigation.state.params;
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

  handleLikePost() {
    const { authenticated, enableVotingSlider } = this.props;
    if (authenticated) {
      if (enableVotingSlider) {
        this.setState({
          displayVoteSlider: true,
        });
      } else {
        this.sendVote(postConstants.DEFAULT_VOTE_WEIGHT);
      }
    } else {
      this.navigateToLoginTab();
      this.handleHideMenu();
    }
  }

  navigateToUser(username) {
    this.props.navigation.navigate(navigationConstants.USER, { username });
  }

  navigateToFeed(tag) {
    this.props.navigation.navigate(navigationConstants.FEED, { tag });
  }

  navigateToVotes() {
    const { postData } = this.props.navigation.state.params;
    this.props.navigation.navigate(navigationConstants.VOTES, {
      postData,
    });
  }

  navigateToLoginTab() {
    this.props.navigation.navigate(navigationConstants.LOGIN);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  navigateToComments() {
    const { author, category, permlink, postId, postData } = this.props.navigation.state.params;
    this.props.navigation.navigate(navigationConstants.COMMENTS, {
      author,
      category,
      permlink,
      postId,
      postData,
    });
    this.handleHideMenu();
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

  handleEditPost() {
    const { postData } = this.props.navigation.state.params;
    this.handleHideMenu();
    this.props.navigation.navigate(navigationConstants.EDIT_POST, {
      postData,
    });
  }

  handlePostLinkPress(e, url) {
    console.log('clicked link: ', url);
    const isTag = _.includes(url, POST_HTML_BODY_TAG);
    const isUser = _.includes(url, POST_HTML_BODY_USER);

    if (isUser) {
      const user = _.get(_.split(url, POST_HTML_BODY_USER), 1, 'bsteem');
      this.navigateToUser(user);
    } else if (isTag) {
      const tag = _.get(_.split(url, POST_HTML_BODY_TAG), 1, 'bsteem');
      this.navigateToFeed(tag);
    } else {
      Expo.WebBrowser.openBrowserAsync(url).catch(error => {
        console.log('invalid url', error, url);
      });
    }
  }

  handleHidePhotoBrowser() {
    this.setState({
      displayPhotoBrowser: false,
    });
  }

  handleDisplayPhotoBrowser() {
    this.setState({
      displayPhotoBrowser: true,
      menuVisible: false,
    });
  }

  renderEmbed() {
    const { parsedJsonMetadata } = this.props.navigation.state.params;
    const video = _.get(parsedJsonMetadata, 'video', {});

    if (_.has(video, 'content.videohash') && _.has(video, 'info.snaphash')) {
      const author = _.get(video, 'info.author', '');
      const permlink = _.get(video, 'info.permlink', '');
      const dTubeEmbedUrl = `https://emb.d.tube/#!/${author}/${permlink}`;
      const snaphash = _.get(video, 'info.snaphash', '');
      const dTubeIFrame = `<iframe width="100%" height="340" src="${dTubeEmbedUrl}" allowFullScreen></iframe>`;
      const dtubeEmbedContent = {
        type: 'video',
        provider_name: 'DTube',
        embed: dTubeIFrame,
        thumbnail: getProxyImageURL(`https://ipfs.io/ipfs/${snaphash}`, 'preview'),
      };
      const widthOffset = 20;
      const width = deviceWidth - widthOffset;
      return <EmbedContent embedContent={dtubeEmbedContent} width={width} />;
    }

    return null;
  }

  render() {
    const { authUsername, customTheme, intl } = this.props;
    const { body, parsedJsonMetadata, author } = this.props.navigation.state.params;
    const {
      displayPhotoBrowser,
      menuVisible,
      likedPost,
      loadingVote,
      postDetails,
      displayVoteSlider,
    } = this.state;
    const title = _.get(postDetails, 'title', '');
    const parsedHtmlBody = getHtml(body, parsedJsonMetadata);
    const images = _.get(parsedJsonMetadata, 'image', []);
    const formattedImages = _.map(images, image => ({
      photo: image,
      caption: image.caption || '',
    }));
    const tags = _.uniq(_.compact(_.get(parsedJsonMetadata, 'tags', [])));
    const widthOffset = 20;
    const displayPhotoBrowserMenu = !_.isEmpty(formattedImages);

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <StyledTextByBackground>{author}</StyledTextByBackground>
          <Menu>
            <Touchable onPress={() => this.setModalVisible(!this.state.menuVisible)}>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.menuVertical}
                color={customTheme.secondaryColor}
              />
            </Touchable>
          </Menu>
        </Header>
        <ScrollView style={{ padding: 10, backgroundColor: customTheme.primaryBackgroundColor }}>
          <PostHeader
            navigation={this.props.navigation}
            postData={postDetails}
            currentUsername={authUsername}
            hideMenuButton
          />
          <PostTitle>{title}</PostTitle>
          {this.renderEmbed()}
          <HTML
            html={parsedHtmlBody}
            imagesMaxWidth={deviceWidth - widthOffset}
            onLinkPress={this.handlePostLinkPress}
            staticContentMaxWidth={deviceWidth - widthOffset}
            baseFontStyle={{
              color: tinycolor(customTheme.primaryBackgroundColor).isDark()
                ? COLORS.LIGHT_TEXT_COLOR
                : COLORS.DARK_TEXT_COLOR,
            }}
            textSelectable
          />
          <FooterTags tags={tags} handleFeedNavigation={this.navigateToFeed} />
          {displayVoteSlider ? (
            <PostVoteSlider
              postData={postDetails}
              hideVoteSlider={this.handleVoteSliderDisplay(false)}
              handleVoteSliderSendVote={this.handleVoteSliderSendVote}
            />
          ) : (
            <Footer
              postData={postDetails}
              navigation={this.props.navigation}
              loadingVote={loadingVote}
              likedPost={likedPost}
              handleLikePost={this.handleLikePost}
              handleNavigateToVotes={this.navigateToVotes}
            />
          )}
          <PostComments postData={postDetails} navigation={this.props.navigation} />
          <PrimaryButton
            onPress={this.navigateToComments}
            title={intl.see_all_comments}
            style={{ marginTop: 20 }}
          />
          <EmptyView />
        </ScrollView>
        {menuVisible && (
          <BSteemModal visible={menuVisible} handleOnClose={this.handleHideMenu}>
            <PostMenu
              hideMenu={this.handleHideMenu}
              handleNavigateToComments={this.navigateToComments}
              postData={postDetails}
              displayPhotoBrowserMenu={displayPhotoBrowserMenu}
              handleDisplayPhotoBrowser={this.handleDisplayPhotoBrowser}
              handleEditPost={this.handleEditPost}
              hideReblogMenu
            />
          </BSteemModal>
        )}
        {displayPhotoBrowser && (
          <PostPhotoBrowser
            displayPhotoBrowser={displayPhotoBrowser}
            mediaList={formattedImages}
            initialPhotoIndex={0}
            handleClose={this.handleHidePhotoBrowser}
            handleAction={this.handlePhotoBrowserShare}
          />
        )}
      </Container>
    );
  }
}

export default PostScreen;
