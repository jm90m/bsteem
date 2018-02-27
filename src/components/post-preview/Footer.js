import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/styles';
import { sortVotes } from '../../util/sortUtils';
import { getUpvotes } from '../../util/voteUtils';
import { calculatePayout } from '../../util/steemitUtils';

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

class Footer extends Component {
  static propTypes = {
    postData: PropTypes.shape(),
    onPressVote: PropTypes.func,
    likedPost: PropTypes.bool,
    loadingVote: PropTypes.bool,
    reblogPost: PropTypes.func,
    authUsername: PropTypes.string,
    loadingReblog: PropTypes.bool,
    rebloggedList: PropTypes.arrayOf(PropTypes.string),
    handleNavigateToComments: PropTypes.func,
    handleNavigateToVotes: PropTypes.func,
  };

  static defaultProps = {
    postData: {},
    onPressVote: () => {},
    likedPost: false,
    loadingVote: false,
    reblogPost: () => {},
    authUsername: '',
    loadingReblog: false,
    rebloggedList: [],
    handleNavigateToComments: () => {},
    handleNavigateToVotes: () => {},
  };

  renderVoteButton() {
    const { likedPost, onPressVote, loadingVote } = this.props;
    console.log('LOADING VOTE', loadingVote);
    if (loadingVote) {
      return <Loading color={COLORS.PRIMARY_COLOR} size="small" />;
    }

    if (likedPost) {
      return (
        <TouchableOpacity onPress={onPressVote}>
          <MaterialIcons name="thumb-up" size={24} color={COLORS.PRIMARY_COLOR} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={onPressVote}>
        <MaterialIcons name="thumb-up" size={24} color={COLORS.TERTIARY_COLOR} />
      </TouchableOpacity>
    );
  }

  renderReblogLink() {
    const { postData, authUsername, reblogPost, loadingReblog, rebloggedList } = this.props;
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
        <TouchableOpacity onPress={reblogPost}>
          <MaterialCommunityIcons name="tumblr-reblog" size={24} color={COLORS.TERTIARY_COLOR} />
        </TouchableOpacity>
      );
    }
    return null;
  }

  render() {
    const { postData, handleNavigateToComments, handleNavigateToVotes } = this.props;
    const { active_votes, children } = postData;
    const upVotes = getUpvotes(active_votes).sort(sortVotes);
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
        <TouchableOpacity onPress={handleNavigateToComments} style={{ flexDirection: 'row' }}>
          <MaterialCommunityIcons
            name="comment-processing"
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
      </Container>
    );
  }
}

export default Footer;
