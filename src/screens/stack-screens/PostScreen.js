import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Dimensions, Share, View, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as navigationConstants from 'constants/navigation';
import { getPostLoading, getSinglePostDetails, getCustomTheme, getIntl } from 'state/rootReducer';
import FooterTags from 'components/post/FooterTags';
import PostFooter from 'components/post-common/footer/PostFooter';
import PostHeader from 'components/post-common/header/Header';
import PrimaryButton from 'components/common/PrimaryButton';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import LargeLoading from 'components/common/LargeLoading';
import PostBody from 'components/post/PostBody';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import { fetchPostDetails } from 'state/actions/postsActions';
import commonStyles from 'styles/common';
import { getProxyImageURL } from 'util/imageUtils';
import PostNavigationHeader from 'components/post/PostNavigationHeader';
import PostNavigationLoadingHeaderContainer from 'components/post/PostNavigationLoadingHeaderContainer';

let BSteemModal = null;
let PostPhotoBrowser = null;
let PostMenu = null;
let PostComments = null;
let EmbedContent = null;

const { width: deviceWidth } = Dimensions.get('screen');

const mapStateToProps = (state, ownProps) => {
  const { author, permlink } = ownProps.navigation.state.params;
  const postKey = `${author}/${permlink}`;
  return {
    customTheme: getCustomTheme(state),
    postDetails: getSinglePostDetails(state, postKey),
    postLoading: getPostLoading(state),
    intl: getIntl(state),
  };
};

const mapDispatchToProps = dispatch => ({
  fetchPostDetails: (author, permlink) => dispatch(fetchPostDetails.action({ author, permlink })),
});

class PostScreen extends React.PureComponent {
  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          author: PropTypes.string.isRequired,
          permlink: PropTypes.string.isRequired,
          body: PropTypes.string,
          postData: PropTypes.shape(),
          parsedJsonMetadata: PropTypes.shape(),
        }),
      }),
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    fetchPostDetails: PropTypes.func.isRequired,
    authUsername: PropTypes.string,
    postDetails: PropTypes.shape(),
  };

  static defaultProps = {
    authUsername: '',
    postDetails: {},
    enableVotingSlider: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      menuVisible: false,
      displayPhotoBrowser: false,
      displayComments: false,
    };

    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.handleDisplayMenu = this.handleDisplayMenu.bind(this);
    this.handleHidePhotoBrowser = this.handleHidePhotoBrowser.bind(this);
    this.handleDisplayPhotoBrowser = this.handleDisplayPhotoBrowser.bind(this);
    this.handlePhotoBrowserShare = this.handlePhotoBrowserShare.bind(this);

    this.navigateBack = this.navigateBack.bind(this);
    this.navigateToComments = this.navigateToComments.bind(this);
    this.navigateToFeed = this.navigateToFeed.bind(this);

    this.handleEditPost = this.handleEditPost.bind(this);

    this.fetchCurrentPostDetails = this.fetchCurrentPostDetails.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const { postData } = this.props.navigation.state.params;
      const needsPostDetails = _.isEmpty(postData);

      if (needsPostDetails) {
        this.fetchCurrentPostDetails();
      }
      _.delay(() => {
        PostComments = require('components/post/PostComments').default;
        this.setState({
          displayComments: true,
        });
      }, 3000);
    });
  }

  handleHideMenu() {
    this.setState({
      menuVisible: false,
    });
  }

  handleDisplayMenu() {
    if (BSteemModal === null) {
      BSteemModal = require('components/common/BSteemModal').default;
    }

    if (PostMenu === null) {
      PostMenu = require('components/post-menu/PostMenu').default;
    }

    this.setState({
      menuVisible: true,
    });
  }

  fetchCurrentPostDetails() {
    const { author, permlink } = this.props.navigation.state.params;
    this.props.fetchPostDetails(author, permlink);
  }

  navigateToFeed(tag) {
    this.props.navigation.push(navigationConstants.FEED, { tag });
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  navigateToComments() {
    const { postDetails } = this.props;
    const { author, permlink } = this.props.navigation.state.params;
    const { id: postId, category } = postDetails;

    this.props.navigation.push(navigationConstants.COMMENTS, {
      author,
      category,
      permlink,
      postId,
      postData: postDetails,
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
    const { postDetails } = this.props;
    this.handleHideMenu();
    this.props.navigation.navigate(navigationConstants.EDIT_POST, {
      postData: postDetails,
    });
  }

  handleHidePhotoBrowser() {
    this.setState({
      displayPhotoBrowser: false,
    });
  }

  handleDisplayPhotoBrowser() {
    if (PostPhotoBrowser === null) {
      PostPhotoBrowser = require('components/post/PostPhotoBrowser').default;
    }
    this.setState({
      displayPhotoBrowser: true,
      menuVisible: false,
    });
  }

  renderEmbed() {
    const { parsedJsonMetadata } = this.props.navigation.state.params;
    const video = _.get(parsedJsonMetadata, 'video', {});

    if (_.has(video, 'content.videohash') && _.has(video, 'info.snaphash')) {
      EmbedContent = require('components/post-preview/EmbedContent').default;
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
        source: dTubeEmbedUrl,
      };
      const widthOffset = 20;
      const width = deviceWidth - widthOffset;
      return <EmbedContent embedContent={dtubeEmbedContent} width={width} />;
    }

    return null;
  }

  render() {
    const { authUsername, customTheme, intl, postDetails } = this.props;
    const { body, parsedJsonMetadata, author, postData } = this.props.navigation.state.params;

    if (_.isEmpty(postDetails) && _.isEmpty(postData)) {
      return (
        <PostNavigationLoadingHeaderContainer author={author} navigateBack={this.navigateBack} />
      );
    }

    const { displayPhotoBrowser, menuVisible, displayComments } = this.state;
    const title = _.get(postDetails, 'title', '');
    const images = _.get(parsedJsonMetadata, 'image', []);
    const formattedImages = _.map(images, image => ({
      photo: image,
      caption: image.caption || '',
    }));
    const tags = _.uniq(_.compact(_.get(parsedJsonMetadata, 'tags', [])));
    const widthOffset = 20;
    const displayPhotoBrowserMenu = !_.isEmpty(formattedImages);
    const scrollViewStyles = {
      padding: 10,
      backgroundColor: customTheme.primaryBackgroundColor,
    };
    const postBody = _.get(postDetails, 'body', body);

    let currentPostDetails = null;

    if (_.isEmpty(postDetails) && !_.isEmpty(postData)) {
      currentPostDetails = postData;
    } else {
      currentPostDetails = postDetails;
    }

    return (
      <StyledViewPrimaryBackground style={commonStyles.container}>
        <PostNavigationHeader
          author={author}
          displayMenu={this.handleDisplayMenu}
          navigateBack={this.navigateBack}
        />
        {_.isEmpty(currentPostDetails) ? (
          <View style={commonStyles.screenLoader}>
            <LargeLoading />
          </View>
        ) : (
          <ScrollView style={scrollViewStyles}>
            <PostHeader
              postData={currentPostDetails}
              currentUsername={authUsername}
              hideMenuButton
            />
            <StyledTextByBackground style={commonStyles.singlePostTitle}>
              {title}
            </StyledTextByBackground>
            {this.renderEmbed()}
            <PostBody
              body={postBody}
              parsedJsonMetadata={parsedJsonMetadata}
              widthOffset={widthOffset}
            />
            <FooterTags tags={tags} handleFeedNavigation={this.navigateToFeed} />
            <PostFooter postDetails={currentPostDetails} />
            {displayComments ? (
              <PostComments postData={currentPostDetails} navigation={this.props.navigation} />
            ) : (
              <View style={commonStyles.postSeeAllCommentsButtonStyle}>
                <LargeLoading />
              </View>
            )}
            <View style={commonStyles.postSeeAllCommentsButtonStyle}>
              <PrimaryButton onPress={this.navigateToComments} title={intl.see_all_comments} />
            </View>
            <View style={commonStyles.emptyView} />
          </ScrollView>
        )}
        {menuVisible && (
          <BSteemModal visible={menuVisible} handleOnClose={this.handleHideMenu}>
            <PostMenu
              hideMenu={this.handleHideMenu}
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
            initialPhotoIndex={0}
            handleClose={this.handleHidePhotoBrowser}
            handleAction={this.handlePhotoBrowserShare}
          />
        )}
      </StyledViewPrimaryBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostScreen);
