import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ScrollView, Dimensions, Share } from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import _ from 'lodash';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getHtml } from 'util/postUtils';
import { COLORS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import { fetchPostDetails } from 'state/actions/postsActions';
import { getPostsDetails, getPostLoading, getIsAuthenticated } from 'state/rootReducer';
import PostPhotoBrowser from 'components/post/PostPhotoBrowser';
import PostMenu from 'components/post-menu/PostMenu';
import HTML from 'react-native-render-html';
import FooterTags from 'components/post/FooterTags';
import Footer from 'components/post/Footer';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import PrimaryButton from 'components/common/PrimaryButton';
import * as postConstants from 'constants/postConstants';
import i18n from 'i18n/i18n';
import { currentUserVotePost } from 'state/actions/currentUserActions';

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled.View`
  flex: 1;
`;

const Touchable = styled.TouchableOpacity``;

const Menu = styled.View`
  justify-content: center;
  padding: 10px;
`;

const Loading = styled.ActivityIndicator`
  padding: 10px;
`;

const Author = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

const mapStateToProps = state => ({
  postsDetails: getPostsDetails(state),
  postLoading: getPostLoading(state),
  authenticated: getIsAuthenticated(state),
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

class SearchPostScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
  };

  static propTypes = {
    postLoading: PropTypes.bool,
    navigation: PropTypes.shape().isRequired,
    postsDetails: PropTypes.shape(),
    fetchPostDetails: PropTypes.func.isRequired,
    currentUserVotePost: PropTypes.func.isRequired,
  };

  static defaultProps = {
    postsDetails: {},
    postLoading: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      menuVisible: false,
      displayPhotoBrowser: false,
      initialPhotoIndex: 0,
    };

    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.setMenuVisible = this.setMenuVisible.bind(this);

    this.navigateBack = this.navigateBack.bind(this);
    this.navigateToVotes = this.navigateToVotes.bind(this);
    this.navigateToLoginTab = this.navigateToLoginTab.bind(this);
    this.navigateToUser = this.navigateToUser.bind(this);

    this.handlePostLinkPress = this.handlePostLinkPress.bind(this);
    this.handleFeedNavigation = this.handleFeedNavigation.bind(this);
    this.handleHidePhotoBrowser = this.handleHidePhotoBrowser.bind(this);
    this.handlePhotoBrowserShare = this.handlePhotoBrowserShare.bind(this);

    this.getCurrentPostDetails = this.getCurrentPostDetails.bind(this);
  }

  componentDidMount() {
    const { author, permlink } = this.props.navigation.state.params;
    const currentPostDetails = this.getCurrentPostDetails();

    if (_.isEmpty(currentPostDetails)) {
      this.props.fetchPostDetails(author, permlink);
    }
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

  handleHideMenu() {
    this.setMenuVisible(false);
  }

  handleLikePost() {
    const { authenticated } = this.props;
    if (authenticated) {
      const { postData } = this.props.navigation.state.params;
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

  navigateToComments() {
    const currentPostDetails = this.getCurrentPostDetails();
    const { author, category, permlink, postId, postData } = currentPostDetails;
    this.props.navigation.navigate(navigationConstants.COMMENTS, {
      author,
      category,
      permlink,
      postId,
      postData,
    });
    this.handleHideMenu();
  }

  navigateToVotes() {
    const currentPostDetails = this.getCurrentPostDetails();
    this.props.navigation.navigate(navigationConstants.VOTES, {
      postData: currentPostDetails,
    });
  }

  render() {
    const { author } = this.props.navigation.state.params;
    const { postLoading } = this.props;
    const {
      displayPhotoBrowser,
      menuVisible,
      initialPhotoIndex,
      loadingVote,
      likedPost,
    } = this.state;
    const currentPostDetails = this.getCurrentPostDetails();

    console.log(currentPostDetails);
    if (_.isEmpty(currentPostDetails) || postLoading) {
      return <Loading color={COLORS.PRIMARY_COLOR} size="large" />;
    }

    const { body, json_metadata } = currentPostDetails;
    const jsonParse = _.attempt(JSON.parse, json_metadata);
    const parsedJsonMetadata = _.isError(jsonParse) ? {} : jsonParse;
    const parsedHtmlBody = getHtml(body, parsedJsonMetadata);
    const images = _.get(parsedJsonMetadata, 'image', []);
    const widthOffset = 20;
    const formattedImages = _.map(images, image => ({ photo: image }));
    const tags = _.compact(_.get(parsedJsonMetadata, 'tags', []));

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <Author>{author}</Author>
          <Menu>
            <Touchable onPress={() => this.setMenuVisible(!menuVisible)}>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.menuVertical}
              />
            </Touchable>
          </Menu>
        </Header>
        <Modal
          animationType="slide"
          transparent
          visible={menuVisible}
          onRequestClose={this.handleHideMenu}
        >
          <PostMenu hideMenu={this.handleHideMenu} />
        </Modal>
        <PostPhotoBrowser
          displayPhotoBrowser={displayPhotoBrowser}
          mediaList={formattedImages}
          handleClose={this.handleHidePhotoBrowser}
          initialPhotoIndex={initialPhotoIndex}
          handleAction={this.handlePhotoBrowserShare}
        />
        <ScrollView style={{ padding: 10, backgroundColor: COLORS.WHITE.WHITE }}>
          <HTML
            html={parsedHtmlBody}
            imagesMaxWidth={deviceWidth - widthOffset}
            onLinkPress={this.handlePostLinkPress}
          />
          <FooterTags tags={tags} handleFeedNavigation={this.handleFeedNavigation} />
          <Footer
            postData={currentPostDetails}
            navigation={this.props.navigation}
            loadingVote={loadingVote}
            likedPost={likedPost}
            handleLikePost={this.handleLikePost}
            handleNavigateToVotes={this.navigateToVotes}
          />
          <PrimaryButton
            onPress={this.navigateToComments}
            title={i18n.post.viewComments}
            style={{ marginTop: 20, marginBottom: 40 }}
          />
        </ScrollView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPostScreen);
