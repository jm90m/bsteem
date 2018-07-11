import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import * as navigationConstants from 'constants/navigation';
import { COLORS } from 'constants/styles';
import { currentUserVotePost } from 'state/actions/currentUserActions';
import _ from 'lodash';
import PrimaryText from 'components/common/text/PrimaryText';
import { getCustomTheme } from 'state/rootReducer';
import tinycolor from 'tinycolor2';
import Header from '../../post-common/header/Header';
import CommentFooter from './CommentsFooter';
import * as postConstants from '../../../constants/postConstants';
import BodyShort from '../../post-preview/BodyShort';
import { isPostVoted } from '../../../util/voteUtils';

const Container = styled.View`
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  border-top-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: 1px;
`;

const Title = styled(PrimaryText)`
  padding-bottom: 10px;
  font-size: 20px;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  color: ${props =>
    tinycolor(props.customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
`;

const TitleContainer = styled.View`
  flex-direction: row;
  padding: 0 5px;
`;

const CommentTag = styled.View`
  background-color: ${props => props.customTheme.secondaryColor};
  padding: 3px;
  width: 30px;
  height: 20px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-top: 3px;
  margin-right: 5px;
`;

const CommentTagText = styled(PrimaryText)`
  color: ${props =>
    tinycolor(props.customTheme.secondaryColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR};
  line-height: 20px;
  font-size: 12px;
  justify-content: center;
  border-radius: 4px;
`;

const Touchable = styled.TouchableOpacity``;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
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
});

class CommentsPreview extends Component {
  static propTypes = {
    commentData: PropTypes.shape(),
    navigation: PropTypes.shape().isRequired,
    currentUserVotePost: PropTypes.func.isRequired,
    currentUsername: PropTypes.string,
    customTheme: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    commentData: {},
    currentUsername: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      likedPost: isPostVoted(props.commentData, props.currentUsername),
      loadingVote: false,
    };

    this.navigateToFullComment = this.navigateToFullComment.bind(this);
    this.navigateToParent = this.navigateToParent.bind(this);
    this.likedVoteSuccess = this.likedVoteSuccess.bind(this);
    this.unlikedVoteSuccess = this.unlikedVoteSuccess.bind(this);
    this.handleNavigateToVotes = this.handleNavigateToVotes.bind(this);
    this.handleNavigateToComments = this.handleNavigateToComments.bind(this);
    this.loadingVote = this.loadingVote.bind(this);
    this.handleOnPressVote = this.handleOnPressVote.bind(this);
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

  handleNavigateToVotes() {
    const { commentData } = this.props;
    this.props.navigation.push(navigationConstants.VOTES, {
      postData: commentData,
    });
  }

  handleNavigateToComments() {
    const { commentData } = this.props;
    const { category, author, permlink, id } = commentData;
    this.props.navigation.push(navigationConstants.COMMENTS, {
      author,
      category,
      permlink,
      postId: id,
      postData: commentData,
    });
  }

  handleOnPressVote() {
    const { navigation, currentUsername, commentData } = this.props;

    if (!_.isEmpty(currentUsername)) {
      const { author, permlink } = commentData;
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

  navigateToParent() {
    const { commentData } = this.props;
    const { parent_author, parent_permlink } = commentData;

    this.props.navigation.push(navigationConstants.POST, {
      author: parent_author,
      permlink: parent_permlink,
    });
  }

  navigateToFullComment() {
    const { commentData } = this.props;
    const { author, permlink } = commentData;
    this.props.navigation.push(navigationConstants.POST, {
      author,
      permlink,
    });
  }

  render() {
    const { commentData, navigation, currentUsername, customTheme } = this.props;
    const { likedPost, loadingVote } = this.state;

    return (
      <Container customTheme={customTheme}>
        <Header
          postData={commentData}
          navigation={navigation}
          currentUsername={currentUsername}
          hideMenuButton
        />
        <Touchable onPress={this.navigateToParent}>
          <TitleContainer>
            <CommentTag customTheme={customTheme}>
              <CommentTagText customTheme={customTheme}>RE</CommentTagText>
            </CommentTag>
            <Title customTheme={customTheme}>{commentData.title || commentData.root_title}</Title>
          </TitleContainer>
        </Touchable>
        <Touchable onPress={this.navigateToFullComment}>
          <BodyShort content={commentData.body} />
        </Touchable>
        <CommentFooter
          commentData={commentData}
          handleNavigateToVotes={this.handleNavigateToVotes}
          handleNavigateToComments={this.handleNavigateToComments}
          loadingVote={loadingVote}
          likedPost={likedPost}
          onPressVote={this.handleOnPressVote}
        />
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentsPreview);
