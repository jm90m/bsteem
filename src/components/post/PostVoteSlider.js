import React, { Component } from 'react';
import styled from 'styled-components/native';
import { Slider } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ButtonGroup } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES, COLORS } from 'constants/styles';
import {
  getUsersDetails,
  getVotingPercent,
  getAuthUsername,
  getRewardFund,
  getSteemRate,
} from 'state/rootReducer';
import i18n from 'i18n/i18n';
import { getVoteValue } from 'util/userUtils';
import { calculatePayout } from 'util/steemitUtils';
import { DEFAULT_VOTE_WEIGHT } from 'constants/postConstants';

const Container = styled.View`
  padding: 10px 16px;
`;

const ActionContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
`;

const ActionText = styled.Text`
  color: ${props => props.color};
  margin-left: 3px;
`;

const HeaderContent = styled.View`
  flex-direction: row;
`;

const Payout = styled.Text`
  margin-left: auto;
  font-size: 14px;
  font-weight: 700;
  color: ${COLORS.TERTIARY_COLOR};
  align-self: center;
  ${props => (props.payoutIsDeclined ? 'text-decoration-line: line-through' : '')};
`;

const TouchableOpacity = styled.TouchableOpacity``;

const SliderContainer = styled.View`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const VoteWorth = styled.Text`
  justify-content: center;
  text-align: center;
  font-weight: bold;
  padding-top: 5px;
`;

const mapStateToProps = state => ({
  usersDetails: getUsersDetails(state),
  votingPercent: getVotingPercent(state),
  authUsername: getAuthUsername(state),
  rewardFund: getRewardFund(state),
  steemRate: getSteemRate(state),
});

class PostVoteSlider extends Component {
  static propTypes = {
    hideVoteSlider: PropTypes.func.isRequired,
    postData: PropTypes.shape(),
    authUsername: PropTypes.string.isRequired,
    usersDetails: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    steemRate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    handleVoteSliderSendVote: PropTypes.func.isRequired,
    votingPercent: PropTypes.number,
  };

  static defaultProps = {
    postData: {},
    votingPercent: 100,
  };

  static VOTING_PERCENT_BUTTONS = ['1%', '25%', '50%', '75%', '100%'];

  constructor(props) {
    super(props);
    const activeVotes = _.get(props.postData, 'active_votes', []);
    const currentUserActiveVote = _.find(activeVotes, vote => vote.voter === props.authUsername);
    const hasActiveVote = !_.isUndefined(currentUserActiveVote);
    let votePercent = props.votingPercent;

    if (hasActiveVote) {
      const voteAmount =
        _.get(currentUserActiveVote, 'percent', DEFAULT_VOTE_WEIGHT) / DEFAULT_VOTE_WEIGHT;
      votePercent = voteAmount * 100;
    }

    const buttonVotingPercentIndex = _.findIndex(PostVoteSlider.VOTING_PERCENT_BUTTONS, percent =>
      _.isEqual(parseFloat(percent), votePercent),
    );

    this.state = {
      buttonVotingPercentIndex,
      votePercent,
    };

    this.handleOnVotingSliderValue = this.handleOnVotingSliderValue.bind(this);
    this.handleOnVotingPercentButtonPress = this.handleOnVotingPercentButtonPress.bind(this);
    this.calculateVoteWorth = this.calculateVoteWorth.bind(this);
    this.handleOnVotePress = this.handleOnVotePress.bind(this);
  }

  handleOnVotePress() {
    const { votePercent } = this.state;
    const voteWeight = DEFAULT_VOTE_WEIGHT * (votePercent / 100);
    this.props.handleVoteSliderSendVote(voteWeight);
  }

  handleOnVotingSliderValue(votePercent) {
    const buttonVotingPercentIndex = _.findIndex(PostVoteSlider.VOTING_PERCENT_BUTTONS, percent =>
      _.isEqual(parseFloat(percent), votePercent),
    );
    this.setState({
      votePercent,
      buttonVotingPercentIndex,
    });
  }
  handleOnVotingPercentButtonPress(index) {
    const votePercent = parseFloat(_.get(PostVoteSlider.VOTING_PERCENT_BUTTONS, index, '1'));
    this.setState({
      votePercent,
      buttonVotingPercentIndex: index,
    });
  }

  calculateVoteWorth() {
    const { authUsername, usersDetails, rewardFund, steemRate } = this.props;
    const { votePercent } = this.state;
    const userDetails = _.get(usersDetails, authUsername, {});
    const userVoteWorth = getVoteValue(
      userDetails,
      _.get(rewardFund, 'recent_claims'),
      _.get(rewardFund, 'reward_balance'),
      steemRate,
      DEFAULT_VOTE_WEIGHT,
    );
    return userVoteWorth * (votePercent / 100);
  }

  render() {
    const { postData, hideVoteSlider } = this.props;
    const { buttonVotingPercentIndex, votePercent } = this.state;
    const payout = calculatePayout(postData);
    const displayedPayout = payout.cashoutInTime ? payout.potentialPayout : payout.pastPayouts;
    const formattedDisplayedPayout = _.isUndefined(displayedPayout)
      ? '0.00'
      : parseFloat(displayedPayout).toFixed(2);
    const payoutIsDeclined = _.get(payout, 'isPayoutDeclined', false);
    const selectedButtonStyle = { backgroundColor: COLORS.PRIMARY_COLOR };
    const selectedTextStyle = { color: COLORS.PRIMARY_COLOR };
    const voteWorth = parseFloat(this.calculateVoteWorth()).toFixed(2);

    return (
      <Container>
        <HeaderContent>
          <TouchableOpacity onPress={this.handleOnVotePress}>
            <ActionContainer>
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.checkCircle}
                size={ICON_SIZES.actionIcon}
                color={COLORS.POSITIVE_COLOR}
              />
              <ActionText color={COLORS.POSITIVE_COLOR}>{i18n.general.confirm}</ActionText>
            </ActionContainer>
          </TouchableOpacity>
          <TouchableOpacity onPress={hideVoteSlider}>
            <ActionContainer>
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.closeCircle}
                size={ICON_SIZES.actionIcon}
                color={COLORS.NEGATIVE_COLOR}
              />
              <ActionText color={COLORS.NEGATIVE_COLOR}>{i18n.general.cancel}</ActionText>
            </ActionContainer>
          </TouchableOpacity>
          <Payout payoutIsDeclined={payoutIsDeclined}>${formattedDisplayedPayout}</Payout>
        </HeaderContent>
        <SliderContainer>
          <Slider
            minimumValue={0}
            step={1}
            maximumValue={100}
            onValueChange={this.handleOnVotingSliderValue}
            value={votePercent}
          />
          <ButtonGroup
            onPress={this.handleOnVotingPercentButtonPress}
            selectedIndex={buttonVotingPercentIndex}
            buttons={PostVoteSlider.VOTING_PERCENT_BUTTONS}
            containerStyle={{ height: 50 }}
            selectedButtonStyle={selectedButtonStyle}
            selectedTextStyle={selectedTextStyle}
          />
          <VoteWorth>{`${i18n.post.voteWorth} $${voteWorth} (${votePercent}%)`}</VoteWorth>
        </SliderContainer>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(PostVoteSlider);
