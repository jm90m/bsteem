import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import _ from 'lodash';
import PrimaryText from 'components/common/text/PrimaryText';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MATERIAL_COMMUNITY_ICONS, MATERIAL_ICONS, ICON_SIZES } from 'constants/styles';
import { sortVotes } from 'util/sortUtils';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import { getUpvotes } from 'util/voteUtils';
import { calculatePayout } from 'util/steemitUtils';
import SmallLoading from 'components/common/SmallLoading';

const Container = styled.View`
  flex-direction: row;
  padding: 10px 16px;
`;

const FooterValue = styled(PrimaryText)`
  margin-right: 16px;
  margin-left: 5px;
  font-size: 14px;
  color: ${props => props.customTheme.tertiaryColor};
  align-self: center;
`;

const Payout = styled(PrimaryText)`
  margin-left: auto;
  font-size: 14px;
  color: ${props => props.customTheme.tertiaryColor};
  align-self: center;
`;

const TouchableOpacity = styled.TouchableOpacity``;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

class CommentsFooter extends Component {
  static propTypes = {
    commentData: PropTypes.shape(),
    handleNavigateToVotes: PropTypes.func.isRequired,
    handleNavigateToComments: PropTypes.func.isRequired,
    customTheme: PropTypes.shape().isRequired,
    loadingVote: PropTypes.bool.isRequired,
    likedPost: PropTypes.bool.isRequired,
    onPressVote: PropTypes.func.isRequired,
  };

  static defaultProps = {
    commentData: {},
  };

  renderVoteButton() {
    const { likedPost, onPressVote, loadingVote, customTheme } = this.props;

    if (loadingVote) {
      return <SmallLoading />;
    }

    if (likedPost) {
      return (
        <TouchableOpacity onPress={onPressVote}>
          <MaterialIcons
            name={MATERIAL_ICONS.voteFill}
            size={ICON_SIZES.footerActionIcon}
            color={customTheme.primaryColor}
          />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={onPressVote}>
        <MaterialIcons
          name={MATERIAL_ICONS.voteFill}
          size={ICON_SIZES.footerActionIcon}
          color={customTheme.tertiaryColor}
        />
      </TouchableOpacity>
    );
  }

  render() {
    const {
      commentData,
      handleNavigateToVotes,
      handleNavigateToComments,
      customTheme,
    } = this.props;
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
          <FooterValue customTheme={customTheme}>{upVotes.length}</FooterValue>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNavigateToComments} style={{ flexDirection: 'row' }}>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.comment}
            size={ICON_SIZES.footerActionIcon}
            color={customTheme.tertiaryColor}
          />
          <FooterValue customTheme={customTheme}>{children}</FooterValue>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNavigateToVotes}
          style={{ marginLeft: 'auto', alignItems: 'center' }}
        >
          <Payout customTheme={customTheme}>${formattedDisplayedPayout}</Payout>
        </TouchableOpacity>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(CommentsFooter);
