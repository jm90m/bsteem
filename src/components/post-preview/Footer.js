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

class Footer extends Component {
  static propTypes = {
    postData: PropTypes.shape(),
    onPressVote: PropTypes.func,
    likedPost: PropTypes.bool,
    loadingVote: PropTypes.bool,
    reblogPost: PropTypes.func,
    authUsername: PropTypes.string,
    loadingReblog: PropTypes.bool,
    rebloggedList: PropTypes.arrayOf([PropTypes.number, PropTypes.string]),
  };

  static defaultProps = {
    postData: {},
    onPressVote: () => {},
    likedPost: false,
    loadingVote: false,
    reblogPost: () => {},
    authUsername: '',
    loadingReblog: false,
  };

  renderVoteButton() {
    const { likedPost, onPressVote, loadingVote } = this.props;
    console.log('LOADING VOTE', loadingVote);
    if (loadingVote) {
      return <Loading color={COLORS.BLUE.MARINER} size="small" />;
    }

    if (likedPost) {
      return (
        <TouchableOpacity onPress={onPressVote}>
          <MaterialIcons name="thumb-up" size={24} color={COLORS.BLUE.MARINER} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={onPressVote}>
        <MaterialIcons name="thumb-up" size={24} color={COLORS.BLUE.LINK_WATER} />
      </TouchableOpacity>
    );
  }

  renderReblogLink() {
    const { postData, authUsername, reblogPost, loadingReblog, rebloggedList } = this.props;
    const ownPost = authUsername === postData.author;
    const showReblogLink = !ownPost && postData.parent_author === '';
    const isReblogged = _.includes(rebloggedList, postData.id);

    if (loadingReblog) {
      return <Loading color={COLORS.BLUE.MARINER} size="small" />;
    }

    if (isReblogged) {
      return <MaterialCommunityIcons name="tumblr-reblog" size={24} color={COLORS.BLUE.MARINER} />;
    }

    if (showReblogLink) {
      return (
        <TouchableOpacity onPress={reblogPost}>
          <MaterialCommunityIcons name="tumblr-reblog" size={24} color={COLORS.BLUE.LINK_WATER} />
        </TouchableOpacity>
      );
    }
    return null;
  }

  render() {
    const { postData } = this.props;
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
        <FooterValue>{upVotes.length}</FooterValue>
        <MaterialCommunityIcons
          name="comment-processing"
          size={24}
          color={COLORS.BLUE.LINK_WATER}
        />
        <FooterValue>{children}</FooterValue>
        {this.renderReblogLink()}
        <Payout>${formattedDisplayedPayout}</Payout>
      </Container>
    );
  }
}

export default Footer;
