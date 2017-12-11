import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Modal, WebView } from 'react-native';
import postBodyStyles from 'constants/postBodyStyles';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import { getHtml } from 'util/postUtils';
import { getCurrentSearchedPosts, getSearchFetchPostLoading } from 'state/rootReducer';
import { searchFetchPostDetails } from 'state/actions/searchActions';
import PostMenu from 'components/post-menu/PostMenu';
import PostHeader from 'components/post-preview/Header';

const Container = styled.View`
  flex: 1;
`;

const Touchable = styled.TouchableOpacity`
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding-top: 10px;
`;

const Menu = styled.View`
  justify-content: center;
  padding: 10px;
`;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const Loading = styled.ActivityIndicator`
  padding: 10px;
`;

const getPostKey = (author, permlink) => `${author}/${permlink}`;

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
      modalVisible: false,
    };

    this.handleHideModal = this.handleHideModal.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
  }

  componentDidMount() {
    const { author, permlink } = this.props.navigation.state.params;
    const { currentSearchedPosts } = this.props;
    const postKey = getPostKey(author, permlink);
    const post = _.get(currentSearchedPosts, postKey, {});

    if (_.isEmpty(post)) {
      this.props.searchFetchPostDetails(author, permlink);
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  handleHideModal() {
    this.setModalVisible(false);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { author, permlink } = this.props.navigation.state.params;
    const { currentSearchedPosts, searchFetchPostLoading } = this.props;
    const postKey = getPostKey(author, permlink);
    const postData = _.get(currentSearchedPosts, postKey, {});

    if (_.isEmpty(postData) || searchFetchPostLoading) {
      return <Loading color={COLORS.BLUE.MARINER} size="large" />;
    }

    const { body, json_metadata } = postData;
    const parsedJsonMetadata = JSON.parse(json_metadata);
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
        <WebView source={{ html }} javaScriptEnabled />
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPostScreen);
