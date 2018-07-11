import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as navigationConstants from 'constants/navigation';
import styled from 'styled-components/native';
import Voter from 'components/votes/Voter';
import { getUpvotes, getDownvotes, getRatio } from 'util/voteUtils';
import moment from 'moment-timezone';
import { getSortedVotes } from 'util/sortUtils';
import { VOTE_VALUE_SORT } from 'constants/postConstants';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import StyledFlatList from 'components/common/StyledFlatList';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import { calculatePayout } from 'util/steemitUtils';
import VoteScreenHeader from 'components/votes/VoteScreenHeader';

let VoteSortMenu = null;

const Container = styled(StyledViewPrimaryBackground)`
  flex: 1;
`;

const EmptyContainer = styled(StyledViewPrimaryBackground)`
  padding: 20px;
`;

const PayoutDetailsText = styled(StyledTextByBackground)`
  padding: 10px;
`;

const MENU = {
  UP_VOTES: 'upvotes',
  DOWN_VOTES: 'downvotes',
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

class VotesScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);
    const { postData } = props.navigation.state.params;
    const { active_votes: activeVotes } = postData;
    const upVotes = getUpvotes(activeVotes);
    const downVotes = getDownvotes(activeVotes);
    const ratio = getRatio(postData);

    this.state = {
      ratio,
      menu: MENU.UP_VOTES,
      sortMenuDisplay: false,
      sort: VOTE_VALUE_SORT,
      upVotes,
      downVotes,
    };

    this.navigateBack = this.navigateBack.bind(this);
    this.renderActiveVotesRow = this.renderActiveVotesRow.bind(this);
    this.handleShowUpVotes = this.handleShowUpVotes.bind(this);
    this.handleShowDownVotes = this.handleShowDownVotes.bind(this);
    this.renderHeaderComponent = this.renderHeaderComponent.bind(this);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  handleShowUpVotes() {
    this.setState({
      menu: MENU.UP_VOTES,
    });
  }

  handleShowDownVotes() {
    this.setState({
      menu: MENU.DOWN_VOTES,
    });
  }

  handleNavigateToUser = username => () => {
    this.props.navigation.push(navigationConstants.USER, { username });
  };

  handleSetSortMenuDisplay = sortMenuDisplay => () => {
    if (sortMenuDisplay && VoteSortMenu === null) {
      VoteSortMenu = require('components/votes/VoteSortMenu').default;
    }

    this.setState({ sortMenuDisplay });
  };

  handleSortVotes = sort => () => {
    this.setState({
      sort,
      sortMenuDisplay: false,
    });
  };

  renderActiveVotesRow(rowData) {
    const { ratio } = this.state;
    const { voter, rshares, percent, time, reputation } = rowData.item;
    const calculatedVoteValue = rshares * ratio;
    const voteValue = calculatedVoteValue > 0 ? calculatedVoteValue : 0;
    const votePercent = parseFloat(Math.abs(_.divide(percent, 10000) * 100)).toFixed(0);
    return (
      <Voter
        key={voter}
        voter={voter}
        voteValue={voteValue}
        votePercent={votePercent}
        time={time}
        reputation={reputation}
        handleNavigateToUser={this.handleNavigateToUser(voter)}
      />
    );
  }

  renderHeaderComponent() {
    const { intl, customTheme } = this.props;
    const { postData } = this.props.navigation.state.params;
    const payoutDetails = calculatePayout(postData);
    const {
      payoutLimitHit,
      potentialPayout,
      cashoutInTime,
      isPayoutDeclined,
      pastPayouts,
      authorPayouts,
      curatorPayouts,
    } = payoutDetails;
    const displayedTime = moment(cashoutInTime)
      .tz(moment.tz.guess())
      .fromNow();

    if (isPayoutDeclined) {
      return <PayoutDetailsText>{intl.payout_declined}</PayoutDetailsText>;
    }

    return (
      <StyledViewPrimaryBackground
        style={{ borderBottomWidth: 1, borderBottomColor: customTheme.primaryBorderColor }}
      >
        {payoutLimitHit && <PayoutDetailsText>{intl.payout_limit_reached}</PayoutDetailsText>}
        {cashoutInTime ? (
          <StyledViewPrimaryBackground>
            <PayoutDetailsText>
              {`${intl.payout_potential_payout}: $${potentialPayout}`}
            </PayoutDetailsText>
            <PayoutDetailsText>
              {`${intl.payout_will_be_released} ${displayedTime}`}
            </PayoutDetailsText>
          </StyledViewPrimaryBackground>
        ) : (
          <StyledViewPrimaryBackground>
            <PayoutDetailsText>{`${intl.payout_total_past}: $${pastPayouts}`}</PayoutDetailsText>
            <PayoutDetailsText>{`${intl.payout_author}: $${authorPayouts}`}</PayoutDetailsText>
            <PayoutDetailsText>{`${intl.payout_curator}: $${curatorPayouts}`}</PayoutDetailsText>
          </StyledViewPrimaryBackground>
        )}
      </StyledViewPrimaryBackground>
    );
  }

  render() {
    const { intl } = this.props;
    const { menu, sortMenuDisplay, sort, upVotes, downVotes } = this.state;
    const upVotesSize = _.size(upVotes);
    const downVotesSize = _.size(downVotes);
    const selectedDownVotesMenu = _.isEqual(menu, MENU.DOWN_VOTES);
    const emptyText = selectedDownVotesMenu ? intl.no_downvoted : intl.no_upvoted;
    const displayedVotes = selectedDownVotesMenu ? downVotes : upVotes;
    const sortedVotes = getSortedVotes(displayedVotes, sort.id);
    const displayEmptyText = _.isEmpty(displayedVotes);
    const selectedUpVotesMenu = menu === MENU.UP_VOTES;

    return (
      <Container>
        <VoteScreenHeader
          navigateBack={this.navigateBack}
          handleSetSortMenuDisplay={this.handleSetSortMenuDisplay}
          handleShowUpVotes={this.handleShowUpVotes}
          handleShowDownVotes={this.handleShowDownVotes}
          sort={sort}
          selectedUpVotesMenu={selectedUpVotesMenu}
          upVotesSize={upVotesSize}
          downVotesSize={downVotesSize}
        />
        {displayEmptyText && (
          <EmptyContainer>
            <StyledTextByBackground>{emptyText}</StyledTextByBackground>
          </EmptyContainer>
        )}
        <StyledFlatList
          data={sortedVotes}
          ListHeaderComponent={this.renderHeaderComponent}
          renderItem={this.renderActiveVotesRow}
          enableEmptySections
          keyExtractor={(item, index) => `${_.get(item, 'item.voter', '')}${index}`}
          initialNumToRender={10}
          getItemLayout={(data, index) => ({ length: 50, offset: 50 * index, index })}
        />
        {sortMenuDisplay && (
          <VoteSortMenu
            hideMenu={this.handleSetSortMenuDisplay(false)}
            handleSortVotes={this.handleSortVotes}
            visible={sortMenuDisplay}
          />
        )}
      </Container>
    );
  }
}

export default connect(mapStateToProps)(VotesScreen);
