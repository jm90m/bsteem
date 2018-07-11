import React from 'react';
import PropTypes from 'prop-types';
import { isPostVoted } from 'util/voteUtils';
import { connect } from 'react-redux';
import { currentUserVotePost } from 'state/actions/currentUserActions';
import PostVoteSlider from 'components/post/PostVoteSlider';
import _ from 'lodash';
import withAuthActions from '../../common/withAuthActions';
import * as postConstants from '../../../constants/postConstants';
import {
  getEnableVotingSlider,
  getSingleUserDetails,
  getAuthUsername,
} from '../../../state/rootReducer';
import Footer from './Footer';

class PostFooter extends React.Component {
  static propTypes = {
    enableVotingSlider: PropTypes.bool.isRequired,
    onActionInitiated: PropTypes.func.isRequired,
    currentUserVotePost: PropTypes.func.isRequired,
    authUsername: PropTypes.string.isRequired,
    authUserDetails: PropTypes.shape().isRequired,
    votePressedCallback: PropTypes.func,
    postDetails: PropTypes.shape(),
  };

  static defaultProps = {
    votePressedCallback: () => {},
    postDetails: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      displayVoteSlider: false,
      likedPost: isPostVoted(props.postDetails, props.authUsername),
    };

    this.sendVote = this.sendVote.bind(this);
    this.handleVoteSliderSendVote = this.handleVoteSliderSendVote.bind(this);
    this.handleAuthVote = this.handleAuthVote.bind(this);
    this.handleOnPressVote = this.handleOnPressVote.bind(this);
    this.likedVoteSuccess = this.likedVoteSuccess.bind(this);
    this.likedVoteFail = this.likedVoteFail.bind(this);
    this.unlikedVoteSuccess = this.unlikedVoteSuccess.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const isDifferentAuthUsername = this.props.authUsername !== nextProps.authUsername;
    const likedPost = isPostVoted(nextProps.postDetails, nextProps.authUsername);

    if (isDifferentAuthUsername) {
      const { postDetails, authUsername } = nextProps;
      this.setState({
        likedPost: isPostVoted(postDetails, authUsername),
        loadingVote: false,
      });
    }

    if (this.state.likedPost !== likedPost) {
      this.setState({
        likedPost,
      });
    }
  }

  handleVoteSliderDisplay = displayVoteSlider => () => this.setState({ displayVoteSlider });

  sendVote(voteWeight) {
    this.setState({
      loadingVote: true,
    });

    const { postDetails, enableVotingSlider } = this.props;
    const { author, permlink } = postDetails;
    const { likedPost } = this.state;

    if (likedPost && !enableVotingSlider) {
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
      const voteFailCallback = this.likedVoteFail;
      this.props.currentUserVotePost(
        author,
        permlink,
        voteWeight,
        voteSuccessCallback,
        voteFailCallback,
      );
    }
  }

  handleVoteSliderSendVote(voteWeight) {
    this.setState({
      displayVoteSlider: false,
    });
    this.sendVote(voteWeight);
  }

  handleAuthVote() {
    const { enableVotingSlider } = this.props;

    if (enableVotingSlider) {
      this.setState({
        displayVoteSlider: true,
      });
      return;
    }

    this.sendVote(postConstants.DEFAULT_VOTE_WEIGHT);
  }

  handleOnPressVote() {
    this.props.votePressedCallback();
    this.props.onActionInitiated(this.handleAuthVote);
  }

  likedVoteSuccess(votePercent) {
    const { enableVotingSlider, postDetails, authUsername, authUserDetails } = this.props;
    try {
      // directly modify the current vote post data, if it does not have an active vote then
      // create a new vote object
      if (enableVotingSlider) {
        let hasActiveVote = false;
        for (let i = 0; i < _.size(postDetails.active_votes); i += 1) {
          if (authUsername === postDetails.active_votes[i].voter) {
            postDetails.active_votes[i].percent = votePercent;
            hasActiveVote = true;
            break;
          }
        }

        if (!hasActiveVote) {
          const reputation = `${(_.get(authUserDetails, `${authUsername}.reputation`), '')}`;
          const newVoteObject = {
            voter: authUsername,
            percent: votePercent,
            reputation,
          };
          postDetails.active_votes.push(newVoteObject);
        }
      }
    } catch (error) {
      console.log(error);
    }
    const likedPost = votePercent > 0;

    this.setState({
      likedPost,
      loadingVote: false,
    });
  }

  likedVoteFail() {
    this.setState({
      loadingVote: false,
    });
  }

  unlikedVoteSuccess() {
    this.setState({
      likedPost: false,
      loadingVote: false,
    });
  }

  render() {
    const { postDetails } = this.props;
    const { displayVoteSlider, loadingVote, likedPost } = this.state;

    if (_.isEmpty(postDetails)) return null;

    return displayVoteSlider ? (
      <PostVoteSlider
        postData={postDetails}
        hideVoteSlider={this.handleVoteSliderDisplay(false)}
        handleVoteSliderSendVote={this.handleVoteSliderSendVote}
      />
    ) : (
      <Footer
        likedPost={likedPost}
        loadingVote={loadingVote}
        postDetails={postDetails}
        handleLikePost={this.handleOnPressVote}
      />
    );
  }
}

const mapStateToProps = state => {
  const authUsername = getAuthUsername(state);
  return {
    enableVotingSlider: getEnableVotingSlider(state),
    authUsername,
    authUserDetails: getSingleUserDetails(state, authUsername),
  };
};

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
});

export default connect(mapStateToProps, mapDispatchToProps)(withAuthActions(PostFooter));
