import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { abbreviateLargeNumber } from 'util/numberFormatter';
import { COLORS } from 'constants/styles';

const Container = styled.View``;

const Username = styled.Text``;

const UserDetailsContainer = styled.View`
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

class SearchUserPreview extends Component {
  static propTypes = {
    username: PropTypes.string,
    followersCount: PropTypes.number,
    followingCount: PropTypes.number,
    postCount: PropTypes.number,
  };

  static defaultProps = {
    username: '',
    followersCount: 0,
    followingCount: 0,
    postCount: 0,
  };

  render() {
    const { username, postCount, followingCount, followersCount } = this.props;
    return (
      <Container>
        <Username>{username}</Username>
        <UserDetailsContainer>
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
              {abbreviateLargeNumber(followingCount)}
            </Value>
            <Label>
              {'following'}
            </Label>
          </ValueLabelContainer>
          <ValueLabelContainer>
            <Value>
              {abbreviateLargeNumber(followersCount)}
            </Value>
            <Label>
              {'followers'}
            </Label>
          </ValueLabelContainer>
        </UserDetailsContainer>
      </Container>
    );
  }
}

export default SearchUserPreview;
