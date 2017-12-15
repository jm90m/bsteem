import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, WebView } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getHtml } from 'util/postUtils';
import PostHeader from 'components/post-preview/Header';
import postBodyStyles from 'constants/postBodyStyles';
import PostMenu from 'components/post-menu/PostMenu';
import { MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import * as navigationConstants from 'constants/navigation';
import { getIsAuthenticated } from 'state/rootReducer';

const Container = styled.View`
  flex: 1;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding-top: 10px;
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

  render() {
    const { body, parsedJsonMetadata, postData } = this.props.navigation.state.params;
    const htmlPostTitle = `<h1>${postData.title}</h1>`;
    const htmlBody = `<body>${htmlPostTitle}<div class="Body">${getHtml(body, parsedJsonMetadata)}</div></body>`;
    const htmlHead = `<head>${postBodyStyles}</head>`;
    const html = `<html>${htmlHead}${htmlBody}</html>`;

    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <PostHeader postData={postData} navigation={this.props.navigation} />
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
        <WebView source={{ html }} javaScriptEnabled />
      </Container>
    );
  }
}

export default PostScreen;
