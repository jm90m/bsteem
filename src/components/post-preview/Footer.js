import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import { MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import SmallLoading from 'components/common/SmallLoading';
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
  color: ${props => props.customTheme.tertiaryColor};
  align-self: center;
`;

const Payout = styled.Text`
  margin-left: auto;
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.customTheme.tertiaryColor};
  align-self: center;
  ${props => (props.payoutIsDeclined ? 'text-decoration-line: line-through' : '')};
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

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
    customTheme: PropTypes.shape().isRequired,
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
    const { likedPost, onPressVote, loadingVote, customTheme } = this.props;

    if (loadingVote) {
      return <SmallLoading />;
    }

    if (likedPost) {
      return (
        <TouchableOpacity onPress={onPressVote}>
          <MaterialIcons
            name={MATERIAL_ICONS.like}
            size={ICON_SIZES.footerActionIcon}
            color={customTheme.primaryColor}
          />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={onPressVote}>
        <MaterialIcons
          name={MATERIAL_ICONS.like}
          size={ICON_SIZES.footerActionIcon}
          color={customTheme.tertiaryColor}
        />
      </TouchableOpacity>
    );
  }

  renderReblogLink() {
    const {
      postData,
      authUsername,
      reblogPost,
      loadingReblog,
      rebloggedList,
      customTheme,
    } = this.props;
    const ownPost = authUsername === postData.author;
    const showReblogLink = !ownPost && postData.parent_author === '';
    const isReblogged = _.includes(rebloggedList, `${postData.id}`);

    if (loadingReblog) {
      return <SmallLoading />;
    }

    if (isReblogged) {
      return (
        <MaterialCommunityIcons
          name={MATERIAL_COMMUNITY_ICONS.reblog}
          size={ICON_SIZES.footerActionIcon}
          color={customTheme.primaryColor}
        />
      );
    }

    if (showReblogLink) {
      return (
        <TouchableOpacity onPress={reblogPost}>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.reblog}
            size={ICON_SIZES.footerActionIcon}
            color={customTheme.tertiaryColor}
          />
        </TouchableOpacity>
      );
    }
    return null;
  }

  render() {
    const {
      postData,
      handleNavigateToComments,
      handleNavigateToVotes,
      onPressVote,
      customTheme,
    } = this.props;
    const { active_votes, children } = postData;
    const upVotes = getUpvotes(active_votes).sort(sortVotes);
    const payout = calculatePayout(postData);
    const displayedPayout = payout.cashoutInTime ? payout.potentialPayout : payout.pastPayouts;
    const formattedDisplayedPayout = _.isUndefined(displayedPayout)
      ? '0.00'
      : parseFloat(displayedPayout).toFixed(2);
    const payoutIsDeclined = _.get(payout, 'isPayoutDeclined', false);

    return (
      <Container>
        {this.renderVoteButton()}
        <TouchableOpacity
          onPress={onPressVote}
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
        {this.renderReblogLink()}
        <TouchableOpacity
          onPress={handleNavigateToVotes}
          style={{ marginLeft: 'auto', alignItems: 'center' }}
        >
          <Payout customTheme={customTheme} payoutIsDeclined={payoutIsDeclined}>
            ${formattedDisplayedPayout}
          </Payout>
        </TouchableOpacity>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(Footer);
