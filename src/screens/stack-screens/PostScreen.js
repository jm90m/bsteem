import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ScrollView, Dimensions, Image, View, WebView } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getHtml } from 'util/postUtils';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import { getIsAuthenticated } from 'state/rootReducer';
import postBodyStyles from 'constants/postBodyStyles';
import PostMenu from 'components/post-menu/PostMenu';
import HTMLView from 'components/html-view/HTMLView';

const { width } = Dimensions.get('screen');

const StyledImage = styled.Image`
`;

function renderNode(node, index, siblings, parent, defaultRenderer) {
  if (node.name === 'iframe') {
    return (
      <WebView
        key={`iframe-${node.attribs.src}`}
        source={{ uri: node.attribs.src }}
        style={{ height: 400, width }}
        height={400}
        width={width}
      />
    );
  }

  console.log('NODE', node.name);

  // if (node.name === 'img') {
  //   return (
  //     <View>
  //       <Image
  //         key={node.attribs.src}
  //         source={{ uri: node.attribs.src }}
  //         style={{ height: null, width }}
  //         resizeMode="contain"
  //       />
  //     </View>
  //   );
  // // }
  //
  // console.log('NODE', node.name);
}

const Container = styled.View`
  flex: 1;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  padding-top: 20px;
`;

const Touchable = styled.TouchableOpacity`
`;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const Menu = styled.View`
  justify-content: center;
  padding: 10px;
`;

const Author = styled.Text`
  color: ${COLORS.BLUE.MARINER};
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
    };

    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.navigateToComments = this.navigateToComments.bind(this);
    this.navigateToLoginTab = this.navigateToLoginTab.bind(this);
    this.handleLikePost = this.handleLikePost.bind(this);
    this.handlePostLinkPress = this.handlePostLinkPress.bind(this);
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

  navigateToLoginTab() {
    this.props.navigation.navigate(navigationConstants.LOGIN);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  navigateToComments() {
    const { author, category, permlink, postId } = this.props.navigation.state.params;
    this.props.navigation.navigate(navigationConstants.COMMENTS, {
      author,
      category,
      permlink,
      postId,
    });
  }

  handlePostLinkPress(url) {
    console.log('clicked link: ', url);
  }

  render() {
    const { body, parsedJsonMetadata, postData, author } = this.props.navigation.state.params;
    const parsedHtmlBody = getHtml(body, parsedJsonMetadata);

    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <Author>
            {author}
          </Author>
          <Menu>
            <Touchable onPress={() => this.setModalVisible(!this.state.modalVisible)}>
              <MaterialCommunityIcons size={24} name={MATERIAL_COMMUNITY_ICONS.menuVertical} />
            </Touchable>
          </Menu>
        </Header>
        <Modal
          animationType="slide"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={this.handleHideModal}
        >
          <PostMenu hideMenu={this.handleHideModal} handleLikePost={this.handleLikePost} />
        </Modal>
        <ScrollView>
          <HTMLView
            value={parsedHtmlBody}
            renderNode={renderNode}
            onLinkPress={this.handlePostLinkPress}
          />
        </ScrollView>
      </Container>
    );
  }
}

export default PostScreen;
