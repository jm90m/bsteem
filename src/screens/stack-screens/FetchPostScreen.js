import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Dimensions, Share } from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import _ from 'lodash';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getHtml } from 'util/postUtils';
import { COLORS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import { fetchPostDetails } from 'state/actions/postsActions';
import {
  getPostsDetails,
  getPostLoading,
  getIsAuthenticated,
  getAuthUsername,
  getEnableVotingSlider,
  getUsersDetails,
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import PostPhotoBrowser from 'components/post/PostPhotoBrowser';
import PostMenu from 'components/post-menu/PostMenu';
import HTML from 'react-native-render-html';
import FooterTags from 'components/post/FooterTags';
import Footer from 'components/post/Footer';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import PostHeader from 'components/post-preview/Header';
import PrimaryButton from 'components/common/PrimaryButton';
import * as postConstants from 'constants/postConstants';
import { currentUserVotePost } from 'state/actions/currentUserActions';
import EmbedContent from 'components/post-preview/EmbedContent';
import BSteemModal from 'components/common/BSteemModal';
import { isPostVoted } from 'util/voteUtils';
import PostVoteSlider from 'components/post/PostVoteSlider';
import PostComments from 'components/post/PostComments';
import TitleText from 'components/common/TitleText';
import tinycolor from 'tinycolor2';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import LargeLoading from 'components/common/LargeLoading';
import ReplyHeader from 'components/post/ReplyHeader';
import { getProxyImageURL } from '../../util/imageUtils';

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled.View`
  flex: 1;
`;

const Touchable = styled.TouchableOpacity``;

const Menu = styled.View`
  justify-content: center;
  padding: 10px;
`;

const NoPostFoundContainer = styled(StyledViewPrimaryBackground)`
  padding: 20px;
`;

const NoPostFoundText = styled(StyledTextByBackground)``;

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
  postsDetails: getPostsDetails(state),
  postLoading: getPostLoading(state),
  authenticated: getIsAuthenticated(state),
  authUsername: getAuthUsername(state),
  enableVotingSlider: getEnableVotingSlider(state),
  usersDetails: getUsersDetails(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  fetchPostDetails: (author, permlink) => dispatch(fetchPostDetails.action({ author, permlink })),
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
});

class FetchPostScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    postLoading: PropTypes.bool,
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    postsDetails: PropTypes.shape(),
    usersDetails: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    enableVotingSlider: PropTypes.bool.isRequired,
    fetchPostDetails: PropTypes.func.isRequired,
    currentUserVotePost: PropTypes.func.isRequired,
    authUsername: PropTypes.string,
  };

  static defaultProps = {
    postsDetails: {},
    postLoading: false,
    authUsername: '',
  };

  constructor(props) {
    super(props);
    const currentPostDetails = this.getCurrentPostDetails();
    this.state = {
      menuVisible: false,
      displayPhotoBrowser: false,
      initialPhotoIndex: 0,
      loadingVote: false,
      likedPost: isPostVoted(currentPostDetails, props.authUsername),
      displayVoteSlider: false,
    };

    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.setMenuVisible = this.setMenuVisible.bind(this);
    this.loadingVote = this.loadingVote.bind(this);
    this.likedVoteSuccess = this.likedVoteSuccess.bind(this);
    this.unlikedVoteSuccess = this.unlikedVoteSuccess.bind(this);

    this.navigateBack = this.navigateBack.bind(this);
    this.navigateToVotes = this.navigateToVotes.bind(this);
    this.navigateToLoginTab = this.navigateToLoginTab.bind(this);
    this.navigateToUser = this.navigateToUser.bind(this);
    this.navigateToComments = this.navigateToComments.bind(this);

    this.handlePostLinkPress = this.handlePostLinkPress.bind(this);
    this.handleLikePost = this.handleLikePost.bind(this);
    this.handleFeedNavigation = this.handleFeedNavigation.bind(this);
    this.handleDisplayPhotoBrowser = this.handleDisplayPhotoBrowser.bind(this);
    this.handleHidePhotoBrowser = this.handleHidePhotoBrowser.bind(this);
    this.handlePhotoBrowserShare = this.handlePhotoBrowserShare.bind(this);
    this.handleEditPost = this.handleEditPost.bind(this);

    this.getCurrentPostDetails = this.getCurrentPostDetails.bind(this);
    this.fetchCurrentPostDetails = this.fetchCurrentPostDetails.bind(this);
    this.sendVote = this.sendVote.bind(this);
    this.handleVoteSliderSendVote = this.handleVoteSliderSendVote.bind(this);
    this.renderNoPostFound = this.renderNoPostFound.bind(this);
  }

  componentDidMount() {
    const { author, permlink } = this.props.navigation.state.params;

    this.props.fetchPostDetails(author, permlink);
  }

  getCurrentPostDetails() {
    const { author, permlink } = this.props.navigation.state.params;
    const { postsDetails } = this.props;
    const postKey = `${author}/${permlink}`;
    return _.get(postsDetails, postKey, {});
  }

  setMenuVisible(visible) {
    this.setState({ menuVisible: visible });
  }

  fetchCurrentPostDetails() {
    const { author, permlink } = this.props.navigation.state.params;
    this.props.fetchPostDetails(author, permlink);
  }

  handleHideMenu() {
    this.setMenuVisible(false);
  }

  loadingVote() {
    this.setState({
      loadingVote: true,
    });
  }

  likedVoteSuccess(votePercent) {
    const { enableVotingSlider, authUsername, postsDetails, usersDetails } = this.props;
    const { author, permlink } = this.props.navigation.state.params;
    try {
      // directly modify the current vote post data, if it does not have an active vote then
      // create a new vote object
      if (enableVotingSlider) {
        let hasActiveVote = false;
        const postKey = `${author}/${permlink}`;
        const postData = postsDetails[postKey];
        for (let i = 0; i < _.size(postData.active_votes); i += 1) {
          if (authUsername === postData.active_votes[i].voter) {
            postData.active_votes[i].percent = votePercent;
            hasActiveVote = true;
            break;
          }
        }

        if (!hasActiveVote) {
          const reputation = _.get(usersDetails, `${authUsername}.reputation`);
          const newVoteObject = {
            voter: authUsername,
            percent: votePercent,
            reputation,
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
    const { enableVotingSlider } = this.props;
    const currentPostDetails = this.getCurrentPostDetails();
    const { author, permlink } = currentPostDetails;
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

  handleVoteSliderDisplay = displayVoteSlider => () => this.setState({ displayVoteSlider });

  handleVoteSliderSendVote(voteWeight) {
    this.setState({
      displayVoteSlider: false,
    });
    this.sendVote(voteWeight);
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

  navigateBack() {
    this.props.navigation.goBack();
  }

  navigateToUser(username) {
    this.props.navigation.navigate(navigationConstants.USER, { username });
  }

  navigateToLoginTab() {
    this.props.navigation.navigate(navigationConstants.LOGIN);
  }

  handleFeedNavigation(tag) {
    this.props.navigation.navigate(navigationConstants.FEED, { tag });
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

  handlePhotoBrowserShare(photoData) {
    const { photo } = photoData;
    const content = {
      message: photo,
      title: photo,
      url: photo,
    };
    Share.share(content);
  }

  handlePostLinkPress(e, url) {
    console.log('clicked link: ', url);
    const isTag = _.includes(url, postConstants.POST_HTML_BODY_TAG);
    const isUser = _.includes(url, postConstants.POST_HTML_BODY_USER);

    if (isUser) {
      const user = _.get(_.split(url, postConstants.POST_HTML_BODY_USER), 1, 'bsteem');
      this.navigateToUser(user);
    } else if (isTag) {
      const tag = _.get(_.split(url, postConstants.POST_HTML_BODY_TAG), 1, 'bsteem');
      this.handleFeedNavigation(tag);
    } else {
      try {
        Expo.WebBrowser.openBrowserAsync(url).catch(error => {
          console.log('invalid url', error, url);
        });
      } catch (error) {
        console.log('unable to open url', error, url);
      }
    }
  }

  navigateToComments() {
    const currentPostDetails = this.getCurrentPostDetails();
    const { author, category, permlink, id } = currentPostDetails;
    this.props.navigation.navigate(navigationConstants.COMMENTS, {
      author,
      category,
      permlink,
      postId: id,
      postData: currentPostDetails,
    });
    this.handleHideMenu();
  }

  navigateToVotes() {
    const currentPostDetails = this.getCurrentPostDetails();
    this.props.navigation.navigate(navigationConstants.VOTES, {
      postData: currentPostDetails,
    });
  }

  handleEditPost() {
    const postData = this.getCurrentPostDetails();
    this.handleHideMenu();
    this.props.navigation.navigate(navigationConstants.EDIT_POST, {
      postData,
    });
  }

  renderNoPostFound() {
    const { intl } = this.props;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
        </Header>
        <NoPostFoundContainer>
          <NoPostFoundText>{intl.no_post_found}</NoPostFoundText>
        </NoPostFoundContainer>
      </Container>
    );
  }

  renderEmbed() {
    const currentPostDetails = this.getCurrentPostDetails();
    const { json_metadata } = currentPostDetails;
    const jsonParse = _.attempt(JSON.parse, json_metadata);
    const parsedJsonMetadata = _.isError(jsonParse) ? {} : jsonParse;
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
    const { author } = this.props.navigation.state.params;
    const { postLoading, authUsername, customTheme, intl } = this.props;
    const {
      displayPhotoBrowser,
      menuVisible,
      initialPhotoIndex,
      loadingVote,
      likedPost,
      displayVoteSlider,
    } = this.state;
    const currentPostDetails = this.getCurrentPostDetails();

    if (postLoading) {
      return <LargeLoading style={{ paddingTop: 100 }} />;
    } else if (_.isEmpty(currentPostDetails)) {
      return this.renderNoPostFound();
    }

    const { body, json_metadata, title } = currentPostDetails;
    const jsonParse = _.attempt(JSON.parse, json_metadata);
    const parsedJsonMetadata = _.isError(jsonParse) ? {} : jsonParse;
    const parsedHtmlBody = getHtml(body, parsedJsonMetadata);
    const images = _.get(parsedJsonMetadata, 'image', []);
    const widthOffset = 20;
    const formattedImages = _.map(images, image => ({ photo: image }));
    const tags = _.uniq(_.compact(_.get(parsedJsonMetadata, 'tags', [])));
    const displayPhotoBrowserMenu = !_.isEmpty(formattedImages);

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <TitleText>{author}</TitleText>
          <Menu>
            <Touchable onPress={() => this.setMenuVisible(!menuVisible)}>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.menuVertical}
                color={customTheme.secondaryColor}
              />
            </Touchable>
          </Menu>
        </Header>
        {menuVisible && (
          <BSteemModal visible={menuVisible} handleOnClose={this.handleHideMenu}>
            <PostMenu
              hideMenu={this.handleHideMenu}
              handleNavigateToComments={this.navigateToComments}
              postData={currentPostDetails}
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
            handleClose={this.handleHidePhotoBrowser}
            initialPhotoIndex={initialPhotoIndex}
            handleAction={this.handlePhotoBrowserShare}
          />
        )}
        <ScrollView style={{ padding: 10, backgroundColor: customTheme.primaryBackgroundColor }}>
          <ReplyHeader postData={currentPostDetails} navigation={this.props.navigation} />
          <PostHeader
            navigation={this.props.navigation}
            postData={currentPostDetails}
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
          <FooterTags tags={tags} handleFeedNavigation={this.handleFeedNavigation} />
          {displayVoteSlider ? (
            <PostVoteSlider
              postData={currentPostDetails}
              hideVoteSlider={this.handleVoteSliderDisplay(false)}
              handleVoteSliderSendVote={this.handleVoteSliderSendVote}
            />
          ) : (
            <Footer
              postData={currentPostDetails}
              navigation={this.props.navigation}
              loadingVote={loadingVote}
              likedPost={likedPost}
              handleLikePost={this.handleLikePost}
              handleNavigateToVotes={this.navigateToVotes}
            />
          )}
          <PostComments postData={currentPostDetails} navigation={this.props.navigation} />
          <PrimaryButton
            onPress={this.navigateToComments}
            title={intl.see_all_comments}
            style={{ marginTop: 20, marginBottom: 100 }}
          />
          <EmptyView />
        </ScrollView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FetchPostScreen);
