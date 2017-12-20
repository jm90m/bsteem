import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Modal } from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { COLORS } from 'constants/styles';
import {
  getIsAuthenticated,
  getAuthUsername,
  getCurrentUserRebloggedList,
} from 'state/rootReducer';
import { currentUserVotePost } from 'state/actions/currentUserActions';
import { isPostVoted } from 'util/voteUtils';
import * as navigationConstants from 'constants/navigation';
import * as postConstants from 'constants/postConstants';
import ReblogModal from 'components/post/ReblogModal';
import Footer from './Footer';
import Header from './Header';
import BodyShort from './BodyShort';
import PreviewImage from './PreviewImage';
import { currentUserReblogPost } from '../../state/actions/currentUserActions';

const Container = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  margin-top: 5px;
  margin-bottom: 5px;
  border-color: ${COLORS.WHITE.WHITE_SMOKE};
  border-width: 2px;
`;

const Content = styled.View`
  padding: 10px;
  padding-left: 0;
  padding-right: 0;
`;

const Title = styled.Text`
  padding-bottom: 10px;
  font-weight: 700;
  font-size: 20px;
  margin: 0 16px 8px;
`;

const Touchable = styled.TouchableOpacity``;

const mapStateToProps = state => ({
  authenticated: getIsAuthenticated(state),
  authUsername: getAuthUsername(state),
  rebloggedList: getCurrentUserRebloggedList(state),
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
  currentUserReblogPost: (
    postId,
    postAuthor,
    postPermlink,
    reblogSuccessCallback,
    reblogFailCallback,
  ) =>
    dispatch(
      currentUserReblogPost.action({
        postId,
        postAuthor,
        postPermlink,
        reblogSuccessCallback,
        reblogFailCallback,
      }),
    ),
});
@connect(mapStateToProps, mapDispatchToProps)
class PostPreview extends Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    authUsername: PropTypes.string,
    currentUserReblogPost: PropTypes.func.isRequired,
    currentUserVotePost: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
    postData: PropTypes.shape(),
    rebloggedList: PropTypes.arrayOf([PropTypes.string, PropTypes.number]),
    currentUsername: PropTypes.string,
  };

  static defaultProps = {
    postData: {},
    authenticated: false,
    authUsername: '',
    rebloggedList: [],
    currentUsername: '',
  };

  constructor(props) {
    super(props);
    const { postData } = props;

    this.state = {
      likedPost: isPostVoted(postData, props.authUsername),
      loadingVote: false,
      displayReblogModal: false,
      loadingReblog: false,
    };

    this.handleOnPressVote = this.handleOnPressVote.bind(this);
    this.loadingVote = this.loadingVote.bind(this);
    this.likedVoteSuccess = this.likedVoteSuccess.bind(this);
    this.unlikedVoteSuccess = this.unlikedVoteSuccess.bind(this);
    this.showReblogModal = this.showReblogModal.bind(this);
    this.hideReblogModal = this.hideReblogModal.bind(this);
    this.handleReblogConfirm = this.handleReblogConfirm.bind(this);
    this.loadingReblogStart = this.loadingReblogStart.bind(this);
    this.loadingReblogEnd = this.loadingReblogEnd.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const isDifferentAuthenticated = this.props.authenticated !== nextProps.authenticated;
    const isDifferentAuthUsername = this.props.authUsername !== nextProps.authUsername;

    if (isDifferentAuthenticated || isDifferentAuthUsername) {
      const { postData, authUsername } = nextProps;
      this.setState({
        likedPost: isPostVoted(postData, authUsername),
        loadingVote: false,
      });
    }
  }

  loadingVote() {
    this.setState({
      loadingVote: true,
    });
  }

  likedVoteSuccess() {
    this.setState({
      likedPost: true,
      loadingVote: false,
    });
  }

  unlikedVoteSuccess() {
    this.setState({
      likedPost: false,
      loadingVote: false,
    });
  }

  handleOnPressVote() {
    const { navigation, authenticated, postData } = this.props;
    if (authenticated) {
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
      navigation.navigate(navigationConstants.LOGIN);
    }
  }

  loadingReblogStart() {
    this.setState({
      loadingReblog: true,
      displayReblogModal: false,
    });
  }

  loadingReblogEnd() {
    this.setState({
      loadingReblog: false,
      displayReblogModal: false,
    });
  }

  showReblogModal() {
    this.setState({
      displayReblogModal: true,
    });
  }

  hideReblogModal() {
    this.setState({
      displayReblogModal: false,
    });
  }

  handleReblogConfirm() {
    const { postData } = this.props;
    const { id, author, permlink } = postData;
    this.loadingReblogStart();
    this.props.currentUserReblogPost(
      id,
      author,
      permlink,
      this.loadingReblogEnd,
      this.loadingReblogEnd,
    );
  }

  render() {
    const { postData, navigation, authUsername, rebloggedList, currentUsername } = this.props;
    const { likedPost, loadingVote, displayReblogModal, loadingReblog } = this.state;
    const { title, category, author, json_metadata, body, permlink, id } = postData;
    const parsedJsonMetadata = JSON.parse(json_metadata);
    const images = parsedJsonMetadata.image || [];
    const previewImage = _.head(images);
    const hasPreviewImage = images.length > 0 && !_.isEmpty(previewImage);

    return (
      <Container>
        <Header postData={postData} navigation={navigation} currentUsername={currentUsername} />
        <Content>
          <Touchable
            onPress={() =>
              navigation.navigate(navigationConstants.POST, {
                title,
                body,
                permlink,
                author,
                parsedJsonMetadata,
                category,
                postId: id,
                postData,
              })}
          >
            <Title>{title}</Title>
            {hasPreviewImage && <PreviewImage images={images} />}
            <BodyShort content={body} />
          </Touchable>
        </Content>
        <Footer
          authUsername={authUsername}
          likedPost={likedPost}
          loadingReblog={loadingReblog}
          loadingVote={loadingVote}
          onPressVote={this.handleOnPressVote}
          postData={postData}
          reblogPost={this.showReblogModal}
          rebloggedList={rebloggedList}
        />
        <Modal
          animationType="slide"
          transparent
          visible={displayReblogModal}
          onRequestClose={this.hideReblogModal}
        >
          <ReblogModal closeModal={this.hideReblogModal} confirmReblog={this.handleReblogConfirm} />
        </Modal>
      </Container>
    );
  }
}

export default PostPreview;
