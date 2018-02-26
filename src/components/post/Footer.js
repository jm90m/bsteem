import React, { Component } from 'react';
import { TouchableOpacity, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import { sortVotes } from 'util/sortUtils';
import { getUpvotes } from 'util/voteUtils';
import { calculatePayout } from 'util/steemitUtils';
import { getAuthUsername, getCurrentUserRebloggedList } from 'state/rootReducer';
import { currentUserReblogPost } from 'state/actions/currentUserActions';
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
  color: ${COLORS.TERTIARY_COLOR};
  align-self: center;
`;

const Payout = styled.Text`
  margin-left: auto;
  font-size: 14px;
  font-weight: 700;
  color: ${COLORS.TERTIARY_COLOR};
  align-self: center;
`;

const Loading = styled.ActivityIndicator``;

const mapStateToProps = state => ({
  authUsername: getAuthUsername(state),
  rebloggedList: getCurrentUserRebloggedList(state),
});

const mapDispatchToProps = dispatch => ({
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
    authUsername: PropTypes.string.isRequired,
    currentUserReblogPost: PropTypes.func.isRequired,
    handleLikePost: PropTypes.func,
    navigation: PropTypes.shape(),
    postData: PropTypes.shape(),
    rebloggedList: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleNavigateToVotes: PropTypes.func,
  };

  static defaultProps = {
    navigation: {},
    postData: {},
    handleNavigateToVotes: () => {},
    handleLikePost: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      displayReblogModal: false,
      loadingReblog: false,
    };

    this.hideReblogModal = this.hideReblogModal.bind(this);
    this.handleNavigateToComments = this.handleNavigateToComments.bind(this);
    this.handleReblogConfirm = this.handleReblogConfirm.bind(this);
    this.loadingReblogStart = this.loadingReblogStart.bind(this);
    this.loadingReblogEnd = this.loadingReblogEnd.bind(this);
    this.showReblogModal = this.showReblogModal.bind(this);
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

  handleNavigateToComments() {
    const { postData } = this.props;
    const { category, author, permlink, id } = postData;
    this.props.navigation.navigate(navigationConstants.COMMENTS, {
      author,
      category,
      permlink,
      postId: id,
      postData,
    });
  }

  renderVoteButton() {
    const { likedPost, loadingVote } = this.props;

    if (loadingVote) {
      return <Loading color={COLORS.PRIMARY_COLOR} size="small" />;
    }

    if (likedPost) {
      return (
        <TouchableOpacity onPress={this.props.handleLikePost}>
          <MaterialIcons name="thumb-up" size={24} color={COLORS.PRIMARY_COLOR} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={this.props.handleLikePost}>
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
    const { postData, handleNavigateToVotes } = this.props;
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
        <TouchableOpacity
          onPress={handleNavigateToVotes}
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <FooterValue>{upVotes.length}</FooterValue>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleNavigateToComments} style={{ flexDirection: 'row' }}>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.comment}
            size={24}
            color={COLORS.TERTIARY_COLOR}
          />
          <FooterValue>{children}</FooterValue>
        </TouchableOpacity>
        {this.renderReblogLink()}
        <TouchableOpacity
          onPress={handleNavigateToVotes}
          style={{ marginLeft: 'auto', alignItems: 'center' }}
        >
          <Payout>${formattedDisplayedPayout}</Payout>
        </TouchableOpacity>
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
