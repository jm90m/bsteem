import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import { MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import SmallLoading from 'components/common/SmallLoading';
import PrimaryText from 'components/common/text/PrimaryText';
import { sortVotes } from 'util/sortUtils';
import { getUpvotes } from 'util/voteUtils';
import { calculatePayout } from 'util/steemitUtils';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  footerValue: {
    marginRight: 16,
    marginLeft: 5,
    fontSize: 15,
    alignSelf: 'center',
  },
  payout: {
    marginLeft: 'auto',
    fontSize: 15,
    alignSelf: 'center',
  },
});

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
        <View>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.reblog}
            size={ICON_SIZES.footerActionIcon}
            color={customTheme.primaryColor}
          />
        </View>
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
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {this.renderVoteButton()}
          <TouchableOpacity onPress={onPressVote}>
            <PrimaryText style={[styles.footerValue, { color: customTheme.tertiaryColor }]}>
              {upVotes.length}
            </PrimaryText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleNavigateToComments}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.comment}
            size={ICON_SIZES.footerActionIcon}
            color={customTheme.tertiaryColor}
          />
          <PrimaryText
            style={[styles.footerValue, { color: customTheme.tertiaryColor, marginBottom: 3 }]}
          >
            {children}
          </PrimaryText>
        </TouchableOpacity>
        {this.renderReblogLink()}
        <TouchableOpacity onPress={handleNavigateToVotes}>
          <PrimaryText
            style={[
              styles.payout,
              {
                color: customTheme.tertiaryColor,
                textDecorationLine: payoutIsDeclined ? 'line-through' : 'none',
                marginBottom: 3,
              },
            ]}
          >
            ${formattedDisplayedPayout}
          </PrimaryText>
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(mapStateToProps)(Footer);
