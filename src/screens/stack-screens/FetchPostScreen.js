import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ScrollView, Dimensions, WebView } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import _ from 'lodash';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getHtml } from 'util/postUtils';
import { COLORS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import { searchFetchPostDetails } from 'state/actions/searchActions';
import {
  getIsAuthenticated,
  getCurrentSearchedPosts,
  getSearchFetchPostLoading,
} from 'state/rootReducer';
import PostPhotoBrowser from 'components/post/PostPhotoBrowser';
import PostMenu from 'components/post-menu/PostMenu';
import HTMLView from 'components/html-view/HTMLView';
import FooterTags from 'components/post/FooterTags';
import Footer from 'components/post/Footer';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';

const { width } = Dimensions.get('screen');

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

function renderNode(node, index, siblings, parent, defaultRenderer) {
  if (node.name === 'iframe') {
    return (
      <WebView
        key={`iframe-${node.attribs.src}`}
        source={{ uri: node.attribs.src }}
        style={{ height: 400, width: width - 20 }}
        height={400}
        width={width - 20}
      />
    );
  }
}

const mapStateToProps = state => ({
  currentSearchedPosts: getCurrentSearchedPosts(state),
  searchFetchPostLoading: getSearchFetchPostLoading(state),
});

const mapDispatchToProps = dispatch => ({
  searchFetchPostDetails: (author, permlink) =>
    dispatch(searchFetchPostDetails.action({ author, permlink })),
});

class SearchPostScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
  };

  static propTypes = {
    searchFetchPostLoading: PropTypes.bool,
    navigation: PropTypes.shape().isRequired,
    currentSearchedPosts: PropTypes.shape(),
    searchFetchPostDetails: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentSearchedPosts: {},
    searchFetchPostLoading: false,
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
    this.handlePostLinkPress = this.handlePostLinkPress.bind(this);
    this.handleImagePress = this.handleImagePress.bind(this);
    this.handleFeedNavigation = this.handleFeedNavigation.bind(this);
    this.handleHidePhotoBrowser = this.handleHidePhotoBrowser.bind(this);
    this.navigateToUser = this.navigateToUser.bind(this);
  }

  componentDidMount() {
    const { author, permlink } = this.props.navigation.state.params;
    const { currentSearchedPosts } = this.props;
    const postKey = `${author}/${permlink}`;
    const post = _.get(currentSearchedPosts, postKey, {});

    if (_.isEmpty(post)) {
      this.props.searchFetchPostDetails(author, permlink);
    }
  }

  setMenuVisible(visible) {
    this.setState({ menuVisible: visible });
  }

  handleHideMenu() {
    this.setMenuVisible(false);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  navigateToUser(username) {
    this.props.navigation.navigate(navigationConstants.USER, { username });
  }

  handleFeedNavigation(tag) {
    this.props.navigation.navigate(navigationConstants.FEED, { tag });
  }

  handlePostLinkPress(url) {
    console.log('clicked link: ', url);
    const urlArray = _.split(url, '');
    const isUserURL = urlArray[0] === '/' && urlArray[1] === '@';
    if (isUserURL) {
      const user = _.slice(urlArray, 2, urlArray.length);
      this.navigateToUser(user.join(''));
    }
  }

  handleImagePress(url, alt) {
    const { author, permlink } = this.props.navigation.state.params;
    const { currentSearchedPosts } = this.props;
    const postKey = `${author}/${permlink}`;
    const postData = _.get(currentSearchedPosts, postKey, {});
    const { json_metadata } = postData;
    const jsonParse = _.attempt(JSON.parse, json_metadata);
    const parsedJsonMetadata = _.isError(jsonParse) ? {} : jsonParse;
    const images = _.get(parsedJsonMetadata, 'image', []);
    const photoIndex = _.findIndex(images, imageURL => _.includes(imageURL, alt));
    console.log('IMAGE PRESSED', `URL: ${url}]\nALT: ${alt}`, `PhotoIndex: ${photoIndex}`, images);
    this.setState({
      displayPhotoBrowser: true,
      initialPhotoIndex: photoIndex >= 0 ? photoIndex : 0,
    });
  }

  handleHidePhotoBrowser() {
    this.setState({
      displayPhotoBrowser: false,
    });
  }

  render() {
    const { author, permlink } = this.props.navigation.state.params;
    const { currentSearchedPosts, searchFetchPostLoading } = this.props;
    const { displayPhotoBrowser, menuVisible, initialPhotoIndex } = this.state;
    const postKey = `${author}/${permlink}`;
    const postData = _.get(currentSearchedPosts, postKey, {});

    console.log(postData, searchFetchPostLoading);
    if (_.isEmpty(postData) || searchFetchPostLoading) {
      return <Loading color={COLORS.PRIMARY_COLOR} size="large" />;
    }

    const { body, json_metadata } = postData;
    const jsonParse = _.attempt(JSON.parse, json_metadata);
    const parsedJsonMetadata = _.isError(jsonParse) ? {} : jsonParse;
    const parsedHtmlBody = getHtml(body, parsedJsonMetadata);
    const images = _.get(parsedJsonMetadata, 'image', []);
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
        />
        <ScrollView style={{ padding: 10, backgroundColor: COLORS.WHITE.WHITE }}>
          <HTMLView
            value={parsedHtmlBody}
            renderNode={renderNode}
            onLinkPress={this.handlePostLinkPress}
            addLineBreaks={false}
            handleImagePress={this.handleImagePress}
          />
          <FooterTags tags={tags} handleFeedNavigation={this.handleFeedNavigation} />
          <Footer postData={postData} navigation={this.props.navigation} />
        </ScrollView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPostScreen);
