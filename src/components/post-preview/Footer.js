import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/styles';
import { sortVotes } from '../../util/sortUtils';
import { getUpvotes } from '../../util/voteUtils';
import { calculatePayout } from '../../util/steemitUtils';
import { getAuthUsername } from '../../state/rootReducer';

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

const mapStateToProps = state => ({
  authUsername: getAuthUsername(state),
});
@connect(mapStateToProps)
class Footer extends Component {
  static propTypes = {
    postData: PropTypes.shape(),
    onPressVote: PropTypes.func,
    authUsername: PropTypes.string,
  };

  static defaultProps = {
    postData: {},
    onPressVote: () => {},
    authUsername: '',
  };

  renderVoteButton() {
    const { postData, authUsername, onPressVote } = this.props;
    const userVote = _.find(postData.active_votes, { voter: authUsername }) || {};
    const isVoted = userVote.percent > 0;

    if (isVoted) {
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
        <MaterialCommunityIcons name="tumblr-reblog" size={24} color={COLORS.BLUE.LINK_WATER} />
        <Payout>${formattedDisplayedPayout}</Payout>
      </Container>
    );
  }
}

export default Footer;
