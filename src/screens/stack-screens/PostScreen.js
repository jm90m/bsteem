import React, { Component } from 'react';
import { Modal, WebView } from 'react-native';
import styled from 'styled-components/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getHtml } from 'util/postUtils';
import PostHeader from 'components/post-preview/Header';
import postBodyStyles from 'constants/postBodyStyles';
import PostMenu from 'components/post-menu/PostMenu';
import { MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';

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

class PostScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
  };

  state = {
    modalVisible: false,
  };

  setModalVisible = visible => this.setState({ modalVisible: visible });

  handleHideModal = () => this.setModalVisible(false);

  navigateBack = () => this.props.navigation.goBack();

  navigateToComments = () => {
    const { author, category, permlink, postId } = this.props.navigation.state.params;
    this.props.navigation.navigate('COMMENTS', {
      author,
      category,
      permlink,
      postId,
    });
  };

  render() {
    const {
      author,
      body,
      permlink,
      parsedJsonMetadata,
      category,
      postData,
    } = this.props.navigation.state.params;
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
          <PostMenu hideMenu={this.handleHideModal} />
        </Modal>
        <WebView source={{ html }} javaScriptEnabled={true} />
      </Container>
    );
  }
}

export default PostScreen;
