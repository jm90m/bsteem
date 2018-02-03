import React, { Component } from 'react';
import { TouchableOpacity, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from 'constants/styles';
import { sortVotes } from 'util/sortUtils';
import { getUpvotes, isPostVoted } from 'util/voteUtils';
import { calculatePayout } from 'util/steemitUtils';
import {
  getIsAuthenticated,
  getAuthUsername,
  getCurrentUserRebloggedList,
} from 'state/rootReducer';
import { currentUserVotePost, currentUserReblogPost } from 'state/actions/currentUserActions';
import * as postConstants from 'constants/postConstants';
import * as navigationConstants from 'constants/navigation';
import ReblogModal from './ReblogModal';

const Container = styled.View`
  flex-direction: row;
  padding: 10px 16px;
`;

const FooterValue = styled.Text`
  margin-right: 16px;
  margin-left: 5px;
  font-size: 14px;
  font-weight: 700;
  color: ${COLORS.BLUE.LINK_WATER};
  align-self: center;
`;

const Payout = styled.Text`
  margin-left: auto;
  font-size: 14px;
  font-weight: 700;
  color: ${COLORS.BLUE.LINK_WATER};
  align-self: center;
`;

const Loading = styled.ActivityIndicator``;

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
class Footer extends Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authUsername: PropTypes.string.isRequired,
    currentUserReblogPost: PropTypes.func.isRequired,
    currentUserVotePost: PropTypes.func.isRequired,
    navigation: PropTypes.shape(),
    postData: PropTypes.shape(),
    rebloggedList: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    navigation: {},
    postData: {},
  };

  constructor(props) {
    super(props);
    const { postData } = props;

    this.state = {
      likedPost: isPostVoted(postData),
      loadingVote: false,
      displayReblogModal: false,
      loadingReblog: false,
    };

    this.hideReblogModal = this.hideReblogModal.bind(this);
    this.handleReblogConfirm = this.handleReblogConfirm.bind(this);
    this.handleOnPressVote = this.handleOnPressVote.bind(this);
    this.loadingVote = this.loadingVote.bind(this);
    this.likedVoteSuccess = this.likedVoteSuccess.bind(this);
    this.unlikedVoteSuccess = this.unlikedVoteSuccess.bind(this);
    this.loadingReblogStart = this.loadingReblogStart.bind(this);
    this.loadingReblogEnd = this.loadingReblogEnd.bind(this);
    this.showReblogModal = this.showReblogModal.bind(this);
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

  hideReblogModal() {
    this.setState({
      displayReblogModal: false,
    });
  }

  showReblogModal() {
    this.setState({
      displayReblogModal: true,
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

  renderVoteButton() {
    const { likedPost, loadingVote } = this.state;

    console.log('LOADING VOTE', loadingVote);

    if (loadingVote) {
      return <Loading color={COLORS.PRIMARY_COLOR} size="small" />;
    }

    if (likedPost) {
      return (
        <TouchableOpacity onPress={this.handleOnPressVote}>
          <MaterialIcons name="thumb-up" size={24} color={COLORS.PRIMARY_COLOR} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={this.handleOnPressVote}>
        <MaterialIcons name="thumb-up" size={24} color={COLORS.BLUE.LINK_WATER} />
      </TouchableOpacity>
    );
  }

  renderReblogLink() {
    const { postData, authUsername, rebloggedList } = this.props;
    const { loadingReblog } = this.state;
    const ownPost = authUsername === postData.author;
    const showReblogLink = !ownPost && postData.parent_author === '';
    const isReblogged = _.includes(rebloggedList, `${postData.id}`);

    if (loadingReblog) {
      return <Loading color={COLORS.PRIMARY_COLOR} size="small" />;
    }

    if (isReblogged) {
      return <MaterialCommunityIcons name="tumblr-reblog" size={24} color={COLORS.PRIMARY_COLOR} />;
    }

    if (showReblogLink) {
      return (
        <TouchableOpacity onPress={this.showReblogModal}>
          <MaterialCommunityIcons name="tumblr-reblog" size={24} color={COLORS.BLUE.LINK_WATER} />
        </TouchableOpacity>
      );
    }
    return null;
  }

  render() {
    const { postData } = this.props;
    const { displayReblogModal } = this.state;
    const { active_votes, children } = postData;
    const activeVotes = Array.isArray(active_votes) ? active_votes : [];
    const upVotes = getUpvotes(activeVotes).sort(sortVotes);
    const payout = calculatePayout(postData);
    const displayedPayout = payout.cashoutInTime ? payout.potentialPayout : payout.pastPayouts;
    const formattedDisplayedPayout = _.isUndefined(displayedPayout)
      ? '0.00'
      : parseFloat(displayedPayout).toFixed(2);

    return (
      <Container>
        {this.renderVoteButton()}
        <FooterValue>{upVotes.length}</FooterValue>
        <MaterialCommunityIcons
          name="comment-processing"
          size={24}
          color={COLORS.BLUE.LINK_WATER}
        />
        <FooterValue>{children}</FooterValue>
        {this.renderReblogLink()}
        <Payout>${formattedDisplayedPayout}</Payout>
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

export default Footer;
