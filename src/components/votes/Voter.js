import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Avatar from 'components/common/Avatar';
import { COLORS } from 'constants/styles';
import USDValue from 'components/common/USDValue';
import FollowButton from '../common/FollowButton';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 2px 0;
  padding: 5px 10px;
  background: ${COLORS.PRIMARY_BACKGROUND_COLOR};
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${COLORS.BORDER_COLOR};
`;

const Username = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  margin: 0 5px;
`;

const UserTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const VoteDetailsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FollowButtonContainer = styled.View`
  margin-left: auto;
`;

const VotePercent = styled.Text`
  margin: 0 5px;
`;

class Voter extends Component {
  static propTypes = {
    voter: PropTypes.string,
    voteValue: PropTypes.number,
    handleNavigateToUser: PropTypes.func,
    votePercent: PropTypes.number,
  };
  static defaultProps = {
    voter: '',
    voteValue: 0,
    votePercent: 0,
    handleNavigateToUser: () => {},
  };
  render() {
    const { voter, voteValue, votePercent, handleNavigateToUser } = this.props;

    return (
      <Container>
        <UserTouchable onPress={handleNavigateToUser}>
          <Avatar username={voter} />
          <Username>{voter}</Username>
        </UserTouchable>
        <VoteDetailsContainer>
          <USDValue value={voteValue} />
          <VotePercent>{Math.round(votePercent)}%</VotePercent>
        </VoteDetailsContainer>
        <FollowButtonContainer>
          <FollowButton username={voter} />
        </FollowButtonContainer>
      </Container>
    );
  }
}

export default Voter;
