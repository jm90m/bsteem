import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ScrollView, Dimensions, WebView, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import _ from 'lodash';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getHtml } from 'util/postUtils';
import entities from 'entities';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import { getIsAuthenticated } from 'state/rootReducer';
import PostPhotoBrowser from 'components/post/PostPhotoBrowser';
import PostMenu from 'components/post-menu/PostMenu';
import HTMLView from 'components/html-view/HTMLView';
import FooterTags from 'components/post/FooterTags';
import Footer from 'components/post/Footer';
import Header from 'components/common/Header';
import PostImage from 'components/post/PostImage';

const { width } = Dimensions.get('screen');

const Container = styled.View`
  flex: 1;
`;

const Touchable = styled.TouchableOpacity``;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const Menu = styled.View`
  justify-content: center;
  padding: 10px;
`;

const Author = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

const mapStateToProps = state => ({
  authenticated: getIsAuthenticated(state),
});

@connect(mapStateToProps)
class PostScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
  };

  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    navigation: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      displayPhotoBrowser: false,
      initialPhotoIndex: 0,
    };

    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.navigateToComments = this.navigateToComments.bind(this);
    this.navigateToLoginTab = this.navigateToLoginTab.bind(this);
    this.navigateToUser = this.navigateToUser.bind(this);
    this.handleLikePost = this.handleLikePost.bind(this);
    this.handlePostLinkPress = this.handlePostLinkPress.bind(this);
    this.handleImagePress = this.handleImagePress.bind(this);
    this.handleFeedNavigation = this.handleFeedNavigation.bind(this);
    this.handleHidePhotoBrowser = this.handleHidePhotoBrowser.bind(this);
    this.renderNode = this.renderNode.bind(this);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  handleHideModal() {
    this.setModalVisible(false);
  }

  handleLikePost() {
    const { authenticated } = this.props;
    if (authenticated) {
      // like post
    } else {
      this.navigateToLoginTab();
    }
    this.handleHideModal();
  }

  navigateToUser(username) {
    this.props.navigation.navigate(navigationConstants.USER, { username });
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

  handleHidePhotoBrowser() {
    this.setState({
      displayPhotoBrowser: false,
    });
  }

  handleImagePress(url, alt) {
    const { parsedJsonMetadata } = this.props.navigation.state.params;
    const images = _.get(parsedJsonMetadata, 'image', []);
    const photoIndex = _.findIndex(images, imageURL => _.includes(imageURL, alt));
    console.log('IMAGE PRESSED', `URL: ${url}]\nALT: ${alt}`, `PhotoIndex: ${photoIndex}`, images);
    this.setState({
      displayPhotoBrowser: true,
      initialPhotoIndex: photoIndex >= 0 ? photoIndex : 0,
    });
  }

  renderNode(node, index, siblings, parent, defaultRenderer) {
    const widthOffset = 20;
    const fullPostMaxHeight = 400;
    if (node.name === 'iframe') {
      return (
        <WebView
          key={`iframe-${node.attribs.src}`}
          source={{ uri: node.attribs.src }}
          style={{ height: fullPostMaxHeight, width: width - widthOffset }}
          height={fullPostMaxHeight}
          width={width - widthOffset}
        />
      );
    }

    console.log('NODE', node.type, node.name, node);

    if (node.type === 'tag') {
      if (node.name === 'img') {
        const imageSRC = node.attribs.src;
        console.log('NODE_IMAGE_ATTRIBS', node.attribs);
        return (
          <TouchableOpacity
            onPress={() => this.handleImagePress(imageSRC, node.attribs.alt)}
            key={`post-image-${index}`}
          >
            <PostImage images={[imageSRC]} widthOffset={widthOffset} height={300} />
          </TouchableOpacity>
        );
      }
    }
  }

  render() {
    const { body, parsedJsonMetadata, postData, author } = this.props.navigation.state.params;
    const { displayPhotoBrowser, modalVisible, initialPhotoIndex } = this.state;
    const parsedHtmlBody = getHtml(body, parsedJsonMetadata);
    const images = _.get(parsedJsonMetadata, 'image', []);
    const formattedImages = _.map(images, image => ({
      photo: image,
      caption: image.caption || '',
    }));
    const tags = _.compact(_.get(parsedJsonMetadata, 'tags', []));

    console.log('POST DATA ---> START');
    console.log(parsedJsonMetadata, postData);
    console.log('POST DATA ---> END');
    console.log('HTML DATA PARSED', parsedHtmlBody);

    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <Author>{author}</Author>
          <Menu>
            <Touchable onPress={() => this.setModalVisible(!this.state.modalVisible)}>
              <MaterialCommunityIcons size={24} name={MATERIAL_COMMUNITY_ICONS.menuVertical} />
            </Touchable>
          </Menu>
        </Header>
        <ScrollView style={{ padding: 10, backgroundColor: COLORS.WHITE.WHITE }}>
          <HTMLView
            value={parsedHtmlBody}
            renderNode={this.renderNode}
            onLinkPress={this.handlePostLinkPress}
            addLineBreaks={false}
            handleImagePress={this.handleImagePress}
          />
          <FooterTags tags={tags} handleFeedNavigation={this.handleFeedNavigation} />
          <Footer postData={postData} navigation={this.props.navigation} />
        </ScrollView>
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={this.handleHideModal}
        >
          <PostMenu
            hideMenu={this.handleHideModal}
            handleLikePost={this.handleLikePost}
            handleNavigateToComments={this.navigateToComments}
            postData={postData}
          />
        </Modal>
        <PostPhotoBrowser
          displayPhotoBrowser={displayPhotoBrowser}
          mediaList={formattedImages}
          initialPhotoIndex={initialPhotoIndex}
          handleClose={this.handleHidePhotoBrowser}
        />
      </Container>
    );
  }
}

export default PostScreen;
