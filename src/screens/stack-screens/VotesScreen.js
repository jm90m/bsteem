import React, { Component } from 'react';
import _ from 'lodash';
import { Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import Header from 'components/common/Header';
import BackButton from 'components/common/BackButton';

const Container = styled.View``;

const Voter = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

class VotesScreen extends Component {
  constructor(props) {
    super(props);

    this.navigateBack = this.navigateBack.bind(this);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { postData } = this.props.navigation.state.params;
    const { active_votes: activeVotes } = postData;
    const totalPayout =
      parseFloat(postData.pending_payout_value) +
      parseFloat(postData.total_payout_value) +
      parseFloat(postData.curator_payout_value);
    const voteRshares = postData.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0);
    const ratio = totalPayout / voteRshares;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
        </Header>
        <ScrollView>
          {_.map(activeVotes, vote => (
            <Voter key={vote.voter}>
              <Text>{vote.voter}</Text>
              <Text>{`$${vote.rshares * ratio}`}</Text>
            </Voter>
          ))}
        </ScrollView>
      </Container>
    );
  }
}

export default VotesScreen;
