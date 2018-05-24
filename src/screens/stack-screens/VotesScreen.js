import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import * as navigationConstants from 'constants/navigation';
import styled from 'styled-components/native';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import Voter from 'components/votes/Voter';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import { getUpvotes, getDownvotes, getRatio } from 'util/voteUtils';
import moment from 'moment-timezone';
import { getSortedVotes } from 'util/sortUtils';
import { VOTE_VALUE_SORT } from 'constants/postConstants';
import VoteSortMenu from 'components/votes/VoteSortMenu';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import StyledFlatList from 'components/common/StyledFlatList';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import { calculatePayout } from 'util/steemitUtils';

const Container = styled(StyledViewPrimaryBackground)`
  flex: 1;
`;

const Menu = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
`;

const MenuTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
`;

const VoteCounts = styled(StyledTextByBackground)`
  margin: 0 5px;
`;

const EmptyContainer = styled(StyledViewPrimaryBackground)`
  padding: 20px;
`;

const RightMenuIconContainer = styled.View`
  padding: 5px;
  flex-direction: row;
`;

const EmptyText = styled(StyledTextByBackground)``;

const PayoutDetailsContainer = styled(StyledViewPrimaryBackground)``;

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
    const ratio = getRatio(postData);

    this.state = {
      ratio,
      menu: MENU.UP_VOTES,
      sortMenuDisplay: false,
      sort: VOTE_VALUE_SORT,
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

  handleNavigateToUser(username) {
    this.props.navigation.navigate(navigationConstants.USER, { username });
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

  handleSetSortMenuDisplay = sortMenuDisplay => () => this.setState({ sortMenuDisplay });

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
        handleNavigateToUser={() => this.handleNavigateToUser(voter)}
      />
    );
  }

  renderHeaderComponent() {
    const { intl } = this.props;
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
      <PayoutDetailsContainer>
        {payoutLimitHit && <PayoutDetailsText>{intl.payout_limit_reached}</PayoutDetailsText>}
        {cashoutInTime ? (
          <PayoutDetailsContainer>
            <PayoutDetailsText>
              {`${intl.payout_potential_payout}: $${potentialPayout}`}
            </PayoutDetailsText>
            <PayoutDetailsText>
              {`${intl.payout_will_be_released} ${displayedTime}`}
            </PayoutDetailsText>
          </PayoutDetailsContainer>
        ) : (
          <PayoutDetailsContainer>
            <PayoutDetailsText>{`${intl.payout_total_past}: $${pastPayouts}`}</PayoutDetailsText>
            <PayoutDetailsText>{`${intl.payout_author}: $${authorPayouts}`}</PayoutDetailsText>
            <PayoutDetailsText>{`${intl.payout_curator}: $${curatorPayouts}`}</PayoutDetailsText>
          </PayoutDetailsContainer>
        )}
      </PayoutDetailsContainer>
    );
  }

  render() {
    const { customTheme, intl } = this.props;
    const { postData } = this.props.navigation.state.params;
    const { menu, sortMenuDisplay, sort } = this.state;
    const { active_votes: activeVotes } = postData;
    const upVotes = getUpvotes(activeVotes);
    const downVotes = getDownvotes(activeVotes);
    const selectedDownVotesMenu = _.isEqual(menu, MENU.DOWN_VOTES);
    const emptyText = selectedDownVotesMenu ? intl.no_downvoted : intl.no_upvoted;
    const displayedVotes = selectedDownVotesMenu ? downVotes : upVotes;
    const sortedVotes = getSortedVotes(displayedVotes, sort.id);
    const displayEmptyText = _.isEmpty(displayedVotes);

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <Menu>
            <MenuTouchable onPress={this.handleShowUpVotes}>
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.voteFill}
                size={ICON_SIZES.menuIcon}
                color={
                  menu === MENU.UP_VOTES ? customTheme.primaryColor : customTheme.secondaryColor
                }
              />
              <VoteCounts>{upVotes.length}</VoteCounts>
            </MenuTouchable>
            <MenuTouchable onPress={this.handleShowDownVotes}>
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.unvoteFill}
                size={ICON_SIZES.menuIcon}
                color={
                  menu === MENU.DOWN_VOTES ? customTheme.primaryColor : customTheme.secondaryColor
                }
              />
              <VoteCounts>{downVotes.length}</VoteCounts>
            </MenuTouchable>
          </Menu>
          <TouchableWithoutFeedback onPress={this.handleSetSortMenuDisplay(true)}>
            <RightMenuIconContainer>
              <MaterialCommunityIcons
                name={sort.icon}
                color={customTheme.primaryColor}
                size={ICON_SIZES.menuIcon}
              />
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.menuVertical}
                size={ICON_SIZES.menuIcon}
                color={customTheme.secondaryColor}
              />
            </RightMenuIconContainer>
          </TouchableWithoutFeedback>
        </Header>
        {displayEmptyText && (
          <EmptyContainer>
            <EmptyText>{emptyText}</EmptyText>
          </EmptyContainer>
        )}
        <StyledFlatList
          data={sortedVotes}
          ListHeaderComponent={this.renderHeaderComponent}
          renderItem={this.renderActiveVotesRow}
          enableEmptySections
          keyExtractor={(item, index) => `${_.get(item, 'item.voter', '')}${index}`}
          initialNumToRender={10}
        />
        <VoteSortMenu
          hideMenu={this.handleSetSortMenuDisplay(false)}
          handleSortVotes={this.handleSortVotes}
          visible={sortMenuDisplay}
        />
      </Container>
    );
  }
}

export default connect(mapStateToProps)(VotesScreen);
