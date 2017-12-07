import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import _ from 'lodash';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from 'constants/styles';
import { sortVotes } from 'util/sortUtils';
import { getUpvotes } from 'util/voteUtils';
import { calculatePayout } from 'util/steemitUtils';

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

class CommentsFooter extends Component {
  static propTypes = {
    commentData: PropTypes.shape(),
  };

  static defaultProps = {
    commentData: {},
  };

  render() {
    const { commentData } = this.props;
    const { active_votes, children } = commentData;
    const upVotes = getUpvotes(active_votes).sort(sortVotes);
    const payout = calculatePayout(commentData);
    const displayedPayout = payout.cashoutInTime ? payout.potentialPayout : payout.pastPayouts;
    const formattedDisplayedPayout = _.isUndefined(displayedPayout)
      ? '0.00'
      : parseFloat(displayedPayout).toFixed(2);

    return (
      <Container>
        <MaterialIcons name="thumb-up" size={24} color={COLORS.BLUE.LINK_WATER} />
        <FooterValue>{upVotes.length}</FooterValue>
        <MaterialCommunityIcons
          name="comment-processing"
          size={24}
          color={COLORS.BLUE.LINK_WATER}
        />
        <FooterValue>{children}</FooterValue>
        <Payout>${formattedDisplayedPayout}</Payout>
      </Container>
    );
  }
}

export default CommentsFooter;
