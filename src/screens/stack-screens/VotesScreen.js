import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ListView } from 'react-native';
import * as navigationConstants from 'constants/navigation';
import styled from 'styled-components/native';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';
import Voter from 'components/votes/Voter';
import { COLORS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import { getUpvotes, getDownvotes, getRatio } from 'util/voteUtils';
import { sortVotes } from 'util/sortUtils';

const Container = styled.View``;

const StyledListView = styled.ListView`
  background-color: ${COLORS.LIST_VIEW_BACKGROUND};
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

const VoteCounts = styled.Text`
  margin: 0 5px;
`;

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const MENU = {
  UP_VOTES: 'upvotes',
  DOWN_VOTES: 'downvotes',
};

class VotesScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
  };
  constructor(props) {
    super(props);
    const { postData } = props.navigation.state.params;
    const ratio = getRatio(postData);

    this.state = {
      ratio,
      menu: MENU.UP_VOTES,
    };

    this.navigateBack = this.navigateBack.bind(this);
    this.renderActiveVotesRow = this.renderActiveVotesRow.bind(this);
    this.handleShowUpVotes = this.handleShowUpVotes.bind(this);
    this.handleShowDownVotes = this.handleShowDownVotes.bind(this);
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

  renderActiveVotesRow(rowData) {
    const { ratio } = this.state;
    const { voter, rshares, percent } = rowData;
    const calculatedVoteValue = rshares * ratio;
    const voteValue = calculatedVoteValue > 0 ? calculatedVoteValue : 0;
    const votePercent = Math.abs(percent / 10000 * 100);
    return (
      <Voter
        key={voter}
        voter={voter}
        voteValue={voteValue}
        votePercent={votePercent}
        handleNavigateToUser={() => this.handleNavigateToUser(voter)}
      />
    );
  }

  render() {
    const { postData } = this.props.navigation.state.params;
    const { menu } = this.state;
    const { active_votes: activeVotes } = postData;
    const upVotes = getUpvotes(activeVotes).sort(sortVotes);
    const downVotes = getDownvotes(activeVotes)
      .sort(sortVotes)
      .reverse();
    const displayedVotes = menu === MENU.DOWN_VOTES ? downVotes : upVotes;

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <Menu>
            <MenuTouchable onPress={this.handleShowUpVotes}>
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.voteFill}
                size={ICON_SIZES.menuIcon}
                color={menu === MENU.UP_VOTES ? COLORS.PRIMARY_COLOR : COLORS.SECONDARY_COLOR}
              />
              <VoteCounts>{upVotes.length}</VoteCounts>
            </MenuTouchable>
            <MenuTouchable onPress={this.handleShowDownVotes}>
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.unvoteFill}
                size={ICON_SIZES.menuIcon}
                color={menu === MENU.DOWN_VOTES ? COLORS.PRIMARY_COLOR : COLORS.SECONDARY_COLOR}
              />
              <VoteCounts>{downVotes.length}</VoteCounts>
            </MenuTouchable>
          </Menu>
        </Header>
        <StyledListView
          dataSource={ds.cloneWithRows(displayedVotes)}
          renderRow={this.renderActiveVotesRow}
          enableEmptySections
        />
      </Container>
    );
  }
}

export default VotesScreen;
