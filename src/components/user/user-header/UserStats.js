import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import { abbreviateLargeNumber } from 'util/numberFormatter';

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background: ${COLORS.WHITE.WHITE};
  padding: 5px 16px;
`;

const ValueLabelContainer = styled.View`
  align-items: center;
`;

const Value = styled.Text`
  font-weight: bold;
`;

const Label = styled.Text`
  font-size: 12px;
`;

class UserStats extends Component {
  static propTypes = {
    followerCount: PropTypes.number,
    followingCount: PropTypes.number,
    postCount: PropTypes.number,
  };

  static defaultProps = {
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
  };

  render() {
    const { followerCount, followingCount, postCount } = this.props;
    return (
      <Container>
        <ValueLabelContainer>
          <Value>
            {abbreviateLargeNumber(postCount)}
          </Value>
          <Label>
            {'posts'}
          </Label>
        </ValueLabelContainer>
        <ValueLabelContainer>
          <Value>
            {abbreviateLargeNumber(followerCount)}
          </Value>
          <Label>
            {'followers'}
          </Label>
        </ValueLabelContainer>
        <ValueLabelContainer>
          <Value>
            {abbreviateLargeNumber(followingCount)}
          </Value>
          <Label>
            {'following'}
          </Label>
        </ValueLabelContainer>
      </Container>
    );
  }
}

export default UserStats;
