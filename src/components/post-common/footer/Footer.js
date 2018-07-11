import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { currentUserReblogPost } from 'state/actions/currentUserActions';
import commonStyles from 'styles/common';
import VotesButton from 'components/post-common/footer/VotesButton';
import CommentsButton from 'components/post-common/footer/CommentsButton';
import ReblogButton from 'components/post-common/footer/ReblogButton';
import PayoutButton from 'components/post-common/footer/PayoutButton';

let BSteemModal = null;
let ReblogModal = null;

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

class Footer extends React.PureComponent {
  static propTypes = {
    currentUserReblogPost: PropTypes.func.isRequired,
    likedPost: PropTypes.bool,
    loadingVote: PropTypes.bool,
    handleLikePost: PropTypes.func,
    postDetails: PropTypes.shape(),
  };

  static defaultProps = {
    likedPost: false,
    loadingVote: false,
    handleLikePost: () => {},
    postDetails: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      displayReblogModal: false,
      loadingReblog: false,
    };

    this.hideReblogModal = this.hideReblogModal.bind(this);
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
    if (BSteemModal === null) {
      BSteemModal = require('components/common/BSteemModal').default;
    }
    if (ReblogModal === null) {
      ReblogModal = require('components/post/ReblogModal').default;
    }

    this.setState({
      displayReblogModal: true,
    });
  }

  handleReblogConfirm() {
    const { postDetails } = this.props;
    const { id, author, permlink } = postDetails;
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
    const { postDetails, likedPost, loadingVote } = this.props;
    const { displayReblogModal, loadingReblog } = this.state;
    const { active_votes, id: postId, author, parent_author: parentAuthor } = postDetails;
    const activeVotes = _.size(active_votes);

    return (
      <View style={commonStyles.postFooterContainer}>
        <VotesButton
          activeVotes={activeVotes}
          onPressVote={this.props.handleLikePost}
          likedPost={likedPost}
          loadingVote={loadingVote}
        />

        <CommentsButton postDetails={postDetails} />
        <ReblogButton
          loadingReblog={loadingReblog}
          author={author}
          parentAuthor={parentAuthor}
          postId={postId}
          onPressReblog={this.showReblogModal}
        />
        <PayoutButton postDetails={postDetails} />
        {displayReblogModal && (
          <BSteemModal visible={displayReblogModal} handleOnClose={this.hideReblogModal}>
            <ReblogModal
              closeModal={this.hideReblogModal}
              confirmReblog={this.handleReblogConfirm}
            />
          </BSteemModal>
        )}
      </View>
    );
  }
}

export default connect(null, mapDispatchToProps)(Footer);
