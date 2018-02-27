import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import _ from 'lodash';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from 'constants/styles';
import { sortVotes } from 'util/sortUtils';
import { getUpvotes } from 'util/voteUtils';
import { calculatePayout } from 'util/steemitUtils';
import { MATERIAL_ICONS } from '../../../constants/styles';

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

const TouchableOpacity = styled.TouchableOpacity``;

const Loading = styled.ActivityIndicator``;

class CommentsFooter extends Component {
  static propTypes = {
    commentData: PropTypes.shape(),
    handleNavigateToVotes: PropTypes.func.isRequired,
    handleNavigateToComments: PropTypes.func.isRequired,
    loadingVote: PropTypes.bool.isRequired,
    likedPost: PropTypes.bool.isRequired,
    onPressVote: PropTypes.func.isRequired,
  };

  static defaultProps = {
    commentData: {},
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
          <MaterialIcons name={MATERIAL_ICONS.voteFill} size={24} color={COLORS.PRIMARY_COLOR} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={onPressVote}>
        <MaterialIcons name={MATERIAL_ICONS.voteFill} size={24} color={COLORS.TERTIARY_COLOR} />
      </TouchableOpacity>
    );
  }

  render() {
    const { commentData, handleNavigateToVotes, handleNavigateToComments } = this.props;
    const { active_votes, children } = commentData;
    const upVotes = getUpvotes(active_votes).sort(sortVotes);
    const payout = calculatePayout(commentData);
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

export default CommentsFooter;
